# フロントエンドのフォルダ構成（確定）

Next.js 16 / App Router / TypeScript。決定済みのルーティング（[docs/frontend/routing.md](./routing.md)）に対応させている。

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # ルートレイアウト（html/body、Tailwind読み込み）
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx                    # /login（admin配下とは独立）
│   │   ├── (public)/                       # ルートグループ。URLには影響しない整理用フォルダ
│   │   │   ├── layout.tsx                  # 公開ページ共通レイアウト
│   │   │   ├── page.tsx                    # "/" 記事一覧1ページ目（page/1と同じ内容を描画）
│   │   │   ├── page/[n]/page.tsx           # 記事一覧のページ送り（パスベース、ISR）
│   │   │   ├── posts/[slug]/page.tsx       # 記事詳細
│   │   │   ├── tags/[tag]/
│   │   │   │   ├── page.tsx                # タグ別一覧1ページ目
│   │   │   │   └── page/[n]/page.tsx       # タグ別一覧のページ送り
│   │   │   └── sitemap.ts                  # /sitemap.xml
│   │   └── admin/
│   │       ├── layout.tsx                  # ルーティング専用のServer Component。instant=falseでCache Components検証を除外
│   │       ├── (articles)/                 # ルートグループ。URLには影響しない（AdminHeaderのArticlesタブに対応する整理用）
│   │       │   ├── posts/
│   │       │   │   ├── page.tsx            # 公開記事一覧
│   │       │   │   ├── new/page.tsx        # 新規作成
│   │       │   │   └── [slug]/edit/page.tsx # 編集・削除
│   │       │   └── drafts/page.tsx         # 下書き一覧
│   │       └── tags/page.tsx               # タグ管理
│   ├── components/
│   │   ├── PostCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── TagList.tsx
│   │   ├── MarkdownRenderer.tsx            # react-markdown + remark-gfm + rehype-highlight
│   │   ├── TableOfContents.tsx             # 見出しからTOCを自動生成
│   │   └── admin/
│   │       ├── PostForm.tsx                # 作成・編集で共用（@uiw/react-md-editor）
│   │       ├── TagPicker.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── AdminHeader.tsx             # Articles/Tags/Logout、Articles配下で公開記事/下書きタブを表示
│   │       └── AdminShell.tsx              # 認証ガード＋Providers＋AdminHeaderの実体（admin/layout.tsxから分離したClient Component）
│   ├── hooks/                               # カスタムフック（データ取得・変更ロジック）
│   │   └── admin/
│   │       ├── posts/
│   │       │   ├── usePostsAdmin.ts        # 一覧取得（PostListで単独使用）
│   │       │   ├── useCreatePost.ts        # 作成（新規作成ページで単独使用）
│   │       │   └── usePostEditor.ts        # 詳細取得+更新+削除（編集ページで常にセット使用、まとめた）
│   │       └── tags/
│   │           ├── useTagsAdmin.ts
│   │           └── useTagsList.ts
│   └── lib/
│       ├── api.ts                          # 公開APIと管理APIのfetchラッパー
│       ├── auth.ts                         # トークンのlocalStorage読み書き
│       ├── pagination.ts                   # 総ページ数の算出（generateStaticParams共通ロジック）
│       └── types.ts                        # Post / Tag などAPIと共有する型
├── public/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## ポイント

- `/login`は`/admin`配下に置かない。`admin/layout.tsx`は「配下は全部認証必須」という単純なルールだけでガードできるようにし、例外分岐を作らない
- 公開ページ（`/`, `/posts/[slug]`, `/tags/[tag]`, `/sitemap.xml`）は`(public)`ルートグループでまとめる。Next.jsのルートグループはURLパスに影響しない整理用のフォルダ
- 公開ページはServer Componentから直接Laravelの公開APIをfetch（SEO・サイトマップに有利）
- ページ送りはクエリパラメータではなくパスベース（`page/[n]`）。`/`は`page/1`相当の内容を描画する別ファイルだが、表示ロジックは共通化する（[docs/frontend/rendering-strategy.md](./rendering-strategy.md)参照）
- frontendはVercelにデプロイするため、Dockerfile・Nginx設定は不要（[docs/infra/vercel.md](../infra/vercel.md)参照）
- 管理画面はClient Component中心。`localStorage`のトークンを使って管理APIを直接fetch（[docs/backend/auth.md](../backend/auth.md)の方針どおり）
- `middleware.ts`は作らない。トークンは`localStorage`にしかなく、Next.jsのmiddlewareは実行時にlocalStorageへアクセスできないため、認証チェックは`AdminShell.tsx`内のクライアント側ガードのみで行う（本当の防御線はバックエンドの`auth:sanctum`）
- `admin/layout.tsx`はルーティング専用のServer Component（`export const instant = false`）とし、実際のガード・Providers・ヘッダー描画は`components/admin/AdminShell.tsx`（Client Component）に分離する。理由: Next.js 16の「Cache Components」は`usePathname()`のような実行時依存の値を使うコンポーネントがレイアウト配下にあると、そのレイアウト配下の全ページが静的プリレンダー不可と判定してしまう。管理画面は元々常に動的（認証必須・クライアントサイドのみ）なので、`instant = false`で検証自体を除外するのが正しい（`instant`はClient Componentには書けない制約があるため、ルーティング用のServer ComponentレイヤーとClient Component本体を分離する必要がある）
- `PostForm.tsx`は新規作成・編集の両方で使い回す
- `app/`配下にはNext.jsのルーティング用ファイル（`page.tsx`, `layout.tsx`, `sitemap.ts`など）だけを置く。カスタムフックなどのロジックは`hooks/`（ページ専用でも、対応する`app/`のサブパスに合わせたサブフォルダに置く）に分離する
