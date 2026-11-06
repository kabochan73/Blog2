# Server Component / Client Component 設計

## 公開ページ（確定）

全てServer Component（SC）。ダークモード・検索・コメント・いいねなど、インタラクティブな機能はすべて「やらない」と決めているため、クライアント側の状態管理が必要な箇所がない。

| ファイル | SC / CC | 理由 |
|---|---|---|
| `(public)/layout.tsx` | SC | 静的なヘッダー/フッターのみ |
| `(public)/page.tsx`（記事一覧） | SC | サーバーで公開APIをfetchして描画するだけ |
| `(public)/posts/[slug]/page.tsx`（記事詳細） | SC | 同上 |
| `(public)/tags/[tag]/page.tsx`（タグ別一覧） | SC | 同上 |
| `PostCard.tsx` | SC | 表示のみ |
| `Pagination.tsx` | SC | `<Link href="/page/2">`（パスベース）での遷移のみ。クライアント状態不要 |
| `TagList.tsx` | SC | リンク一覧のみ。各リンクに`prefetch={true}`を指定し、ビューポートに関係なく全タグページを即座にプリフェッチ（Router Cacheに先読み）する |
| `MarkdownRenderer.tsx` | SC | react-markdownはRSC対応、ブラウザAPI不要 |
| `TableOfContents.tsx` | SC | **シンプルなリンク一覧**（見出し一覧を表示し、クリックでジャンプするだけ）。スクロール追従ハイライトは実装しないため、IntersectionObserverなどのクライアントAPIは不要 |

## 管理画面（確定）

全てClient Component（CC）。SEOが関係なく、ログイン必須の単一ユーザー向けページで、フォーム操作・非同期の作成/更新/削除が中心のため。

| ファイル | SC/CC | 理由 |
|---|---|---|
| `login/page.tsx` | CC | フォーム状態・ログインAPI呼び出し・`localStorage`書き込み・リダイレクトが必要 |
| `admin/layout.tsx` | **SC** | ルーティング専用。`export const instant = false`でCache Components検証を除外するため、Client Componentにはできない（詳細は[docs/frontend/folder-structure.md](./folder-structure.md)） |
| `admin/posts/page.tsx`（公開記事一覧） | CC | `useQuery`で一覧取得 |
| `admin/drafts/page.tsx`（下書き一覧） | CC | 同上 |
| `admin/posts/new/page.tsx` | CC | `PostForm`を作成モードで表示 |
| `admin/posts/[slug]/edit/page.tsx` | CC | `useQuery`で該当記事を取得、`PostForm`を編集モードで表示、削除ボタン |
| `admin/tags/page.tsx` | CC | タグの一覧・作成・編集・削除（`useQuery`/`useMutation`） |
| `PostForm.tsx` | CC | フォーム状態、`@uiw/react-md-editor`、保存時の`useMutation` |
| `TagPicker.tsx` | CC | タグの複数選択。タグ一覧取得も内部で`useQuery` |
| `ImageUploader.tsx` | CC | ファイル選択・アップロード・プレビュー |
| `AdminShell.tsx` | CC | マウント時に`localStorage`のトークンを確認し、無ければ`/login`へリダイレクト（ブラウザAPI必須）。`admin/layout.tsx`（SC）から`children`を受け取って描画する |
| `AdminHeader.tsx` | CC | `usePathname`で現在地を判定してタブをハイライトするため。`AdminShell.tsx`の中で使われる |

### データ取得にTanStack Queryを使う理由

- 管理画面のデータは全部ブラウザから直接Laravelへfetchする（Next.js/Vercelのキャッシュ機構は一切経由しない）
- キャッシュそのものの恩恵（個人利用・低頻度アクセスのため薄い）よりも、`isLoading`/`isError`/`data`の統一的な扱いや、`useMutation`＋`invalidateQueries()`による「保存後に一覧を再取得する」処理の簡潔さを優先して採用
- Router Cache（Next.jsのルート単位キャッシュ）は、管理画面のページがClient Componentで実データをRSCペイロードに含まないため、実質的に意味を持たない。データキャッシュの役割は全てTanStack Queryに任せる
- `staleTime`はデフォルトの`0`のまま（特別な設定をしない）。マウント時・タブフォーカス時に毎回バックグラウンドで再取得される。`gcTime`（旧`cacheTime`）もデフォルト（5分）のまま
