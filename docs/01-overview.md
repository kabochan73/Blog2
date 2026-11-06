# 個人ブログアプリ 概要

## 目的
自分専用のブログアプリ。記事の投稿・編集を管理画面から行い、公開ページで読める形にする。

## 技術スタック

| 項目 | 内容 |
|---|---|
| バックエンド | Laravel（PHP 8.4） |
| フロントエンド | Next.js 16（TypeScript） |
| 記事データ | PostgreSQL（`posts`テーブル） |
| DB | PostgreSQL（認証・タグ・記事すべて統合。[docs/backend/database-schema.md](./backend/database-schema.md)） |
| スタイリング | Tailwind CSS |
| Web配信（backend） | Nginx + PHP-FPM |
| ローカル環境構築 | Docker Compose |
| 本番デプロイ | frontendはVercel、backend・DB・画像ストレージはRailway（[docs/infra/vercel.md](./infra/vercel.md)・[docs/infra/railway-services.md](./infra/railway-services.md)） |

## 構成図（ざっくり、本番）

```
[ブラウザ]
   │
   ├─ Next.js (frontend, Vercel) ── 公開ページ（全ページSSG+ISR） / 管理画面UI
   │        │           ▲
   │        │fetch(API) │ オンデマンド再検証Webhook
   │        ▼           │
   │   [Nginx] ──→ [PHP-FPM / Laravel (backend, Railway)]
   │                      │
   │                      ├─ PostgreSQL（Railway managed） (posts / tags / post_tag / users / personal_access_tokens)
   │                      └─ bucket（Railway、S3互換） (アップロード画像)
```

ローカル開発環境はDocker Composeで backend・frontend・postgres をまとめて動かす（画像はLaravelのローカル`public`ディスク）。

## リポジトリ構成

```
Blog2/
├── docs/            # このフォルダ。設計・決定事項のドキュメント
├── backend/         # Laravel
├── frontend/        # Next.js
└── docker-compose.yml
```

## 機能スコープ（MVP）

- 公開ページ：記事一覧、記事詳細、タグ別一覧
- 管理画面：ログイン、記事の作成・編集・削除（DB管理）、画像アップロード、タグCRUD
- デプロイも今回のスコープに含める（frontend: Vercel、backend/DB/画像: Railway）
