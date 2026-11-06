# ~~Markdown frontmatterスキーマ~~（廃止・置き換え済み）

> **このドキュメントは廃止されました。** 記事データはMarkdownファイルではなくPostgreSQLの`posts`テーブルで管理する方針に変更されました。最新のスキーマは[docs/backend/database-schema.md](../backend/database-schema.md)を参照してください。以下は変更前の記録として残しています。

---

記事はMarkdownファイル1本＝1記事。slugをファイル名かつ一意キーとして扱う（DB不使用）。

## フォーマット

```yaml
---
title: "記事タイトル"
slug: "example-post"
status: "published"      # "published" | "draft"
tags: ["laravel", "nextjs"]
thumbnail: "/storage/images/example-thumb.jpg"
excerpt: "一覧ページに出す概要文（省略時は本文の先頭から自動生成）"
created_at: "2026-11-06T10:00:00+09:00"
updated_at: "2026-11-06T12:00:00+09:00"
---

本文（Markdown）がここに続く
```

## フィールド定義

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | string | ○ | 記事タイトル |
| `slug` | string | ○ | 一意キー。ファイル名と一致（`{slug}.md`）。作成後も編集可能（変更時はファイル名もリネーム） |
| `status` | `"published"` \| `"draft"` | ○ | 公開/下書きの切り替え |
| `tags` | string[] | - | 省略時は空配列。タグ一覧は全記事から動的集計（タグ専用マスタファイルは持たない） |
| `thumbnail` | string (path) | - | 画像アップロード機能で設定したパス |
| `excerpt` | string | - | 省略時は本文先頭N文字からAPI側で自動生成 |
| `created_at` | ISO8601 string | ○ | 一覧の並び替えに使用 |
| `updated_at` | ISO8601 string | ○ | 編集時にLaravel側で自動更新 |

## 補足

- `slug`の生成規則は[docs/backend/slug-rule.md](../backend/slug-rule.md)参照（手入力、作成後も編集可）
- **（方針変更）** タグは記事に紐付いていなくても独立して作成・編集・削除したいという要望のため、SQLiteに`tags`テーブルを追加して管理する（frontmatterの`tags`配列は記事側が持つタグ名の一覧のまま）。詳細は管理用API設計で決定
