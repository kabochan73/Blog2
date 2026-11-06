# 決定事項ログ

決めたことと、まだ決めていないことを記録していく。

## 決定済み

| 項目 | 決定内容 |
|---|---|
| バックエンド | Laravel / PHP 8.4 |
| フロントエンド | Next.js 16 / TypeScript |
| 記事データ保存 | **（変更）** PostgreSQLの`posts`テーブル（旧: Markdownファイル） |
| 認証方式 | 1人用シンプルログイン（Laravel Sanctum + PostgreSQL） |
| スタイリング | Tailwind CSS |
| Markdownエディタ | プレビュー付き（@uiw/react-md-editor） |
| Web配信 | Nginx + PHP-FPM |
| 環境構築 | Docker Compose |
| ディレクトリ構成 | 1リポジトリ内に backend/ と frontend/ を分離 |
| デプロイ | 今回のスコープに含める。**（変更）** frontendはVercel、backend/DB/画像はRailway（Dockerfile）。[docs/infra/vercel.md](./infra/vercel.md)・[docs/infra/railway-services.md](./infra/railway-services.md)参照 |
| カテゴリ機能 | やらない（タグのみ） |
| 記事ステータス | 公開/下書きの切り替えを持つ |
| 記事プレビュー | 専用機能は作らず、管理画面の記事詳細ページで代替 |
| 管理者アカウント | database seederで投入（username: admin） |
| 機能スコープ | [docs/03-features.md](./03-features.md) に確定版を記載 |

| RSSフィード | 今回はやらない |
| frontmatterスキーマ | ~~廃止~~。記事はDBの`posts`テーブルで管理する方針に変更。[docs/backend/database-schema.md](./backend/database-schema.md) 参照（旧ドキュメントは[docs/archive/frontmatter-schema.md](./archive/frontmatter-schema.md)） |
| ファイル保存場所・命名規則 | 画像のみ有効。記事部分は廃止。[docs/backend/storage-layout.md](./backend/storage-layout.md) 参照 |
| タグ管理方式 | タグは紐付く記事がなくても独立して作成・編集・削除できる。`tags`テーブル＋`post_tag`中間テーブルで管理 |
| DB設計 | 確定。[docs/backend/database-schema.md](./backend/database-schema.md) 参照（PostgreSQL、`posts`/`tags`/`post_tag`/`users`/`personal_access_tokens`） |
| 公開API設計 | 確定。[docs/api/public.md](./api/public.md) 参照（ページネーションは`per_page=20`） |
| 認証設計 | 確定。[docs/backend/auth.md](./backend/auth.md) 参照（Sanctumトークン、有効期限30日、admin@example.comをseed） |
| 管理用API設計 | 確定。[docs/api/admin.md](./api/admin.md) 参照（記事は完全置換更新、画像は5MBまでjpg/png/webp） |
| ルーティング設計 | 確定。[docs/frontend/routing.md](./frontend/routing.md) 参照（管理画面は公開一覧`/admin/posts`と下書き一覧`/admin/drafts`を別画面に分ける） |
| スラッグ生成規則 | 確定。[docs/backend/slug-rule.md](./backend/slug-rule.md) 参照（手入力、作成後も編集可、変更時はDBの`slug`カラムを更新） |
| 管理者パスワード初期値 | ローカルは`.env.example`に適当な固定値（例: `password`）。本番はRailwayの環境変数で別途強固な値を設定（[docs/backend/auth.md](./backend/auth.md)参照） |
| Railwayサービス構成 | 確定。[docs/infra/railway-services.md](./infra/railway-services.md) 参照（**（変更）** backend/postgres/bucketの3サービス。frontendはVercelへ移行） |
| バックエンドのフォルダ構成 | 確定。[docs/backend/folder-structure.md](./backend/folder-structure.md) 参照（公開/管理でController分離、FormRequest・Resourceで整形、画像処理のみService化） |
| ログインページのパス | `/login`（`/admin`配下には置かない。[docs/frontend/routing.md](./frontend/routing.md)参照） |
| フロントエンドのフォルダ構成 | 確定。[docs/frontend/folder-structure.md](./frontend/folder-structure.md) 参照（公開ページは`(public)`ルートグループ、middleware.tsは作らずadmin/layout.tsxでガード） |
| 公開ページのSC/CC | 確定。[docs/frontend/component-types.md](./frontend/component-types.md) 参照（全てServer Component。TOCはスクロール追従なしのシンプルなリンク一覧） |
| 管理画面のデータ取得 | TanStack Queryを使う。採用理由はキャッシュそのものではなく、`isLoading`/`isError`管理や`invalidateQueries()`によるコードの分かりやすさ。公開ページはSEOのためServer Component＋サーバー側fetchのままで変更なし |
| 管理画面のSC/CC | 確定。[docs/frontend/component-types.md](./frontend/component-types.md) 参照。全てClient Component。Router Cacheは実データを持たないため管理画面では意味を持たず、データキャッシュはTanStack Queryに一任する |
| frontendのホスティング | **（変更）** Vercelにデプロイする。backend/DB/bucketはRailwayのまま。[docs/infra/vercel.md](./infra/vercel.md)参照 |
| レンダリング戦略 | **（変更）** 確定。[docs/frontend/rendering-strategy.md](./frontend/rendering-strategy.md) 参照。Vercel前提で全公開ページをSSG＋オンデマンド再検証（ISR）に統一。時間ベースのrevalidateは使わない |
| ページネーション方式 | **（変更）** クエリパラメータ（`?page=`）ではなくパスベース（`/page/[n]`, `/tags/[tag]/page/[n]`）にする。理由: クエリパラメータだとルート全体が動的レンダリング扱いになりSSG化できないため。[docs/frontend/routing.md](./frontend/routing.md)参照 |
| 範囲外ページの挙動 | `/page/[n]`で`n`が総ページ数を超える場合は404（`notFound()`） |
| 総ページ数の算出 | ハードコードせず、`generateStaticParams()`実行時・Webhook再検証時それぞれで公開APIの総記事数から動的に算出する |
| タグリンクのプリフェッチ | `TagList.tsx`の全リンクに`prefetch={true}`を指定し、ビューポートに関係なく全タグページを即座にRouter Cacheへ先読みする。[docs/frontend/component-types.md](./frontend/component-types.md)参照 |

| 実装ロードマップ | 確定。[docs/04-implementation-roadmap.md](./04-implementation-roadmap.md) 参照。機能ごとの縦切り（管理画面→公開ページの順）で進め、コミットは機能単位・5ファイル前後。進捗はそのファイルのチェックボックスで管理 |

## 未決定（これから詰める項目）

なし。設計はひととおり決定済み。実装フェーズへ進める。
