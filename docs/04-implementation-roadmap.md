# 実装ロードマップ

機能ごとの縦切り（1機能をbackend→frontendまで一気通貫で作って、都度ローカルで動作確認する）で進める。デプロイはせず、ローカルのDocker Composeで動作確認する。コミットは機能単位、目安5ファイル前後。

進捗はこのファイルのチェックボックスで管理する。

## フェーズ1: 土台

- [x] 1. Laravel初期化（scaffold一式）
- [x] 2. Next.js初期化（scaffold一式）
- [x] 3. Docker構成（`docker-compose.yml`, `backend/Dockerfile`, `backend/docker/nginx.conf`, `.env.example`×2）

## フェーズ2: 認証

**backend**
- [x] 4. DB＋User: `personal_access_tokens`マイグレーション, `User.php`（HasApiTokens）, `config/sanctum.php`
- [x] 5. 管理者seed: `AdminUserSeeder.php`, `DatabaseSeeder.php`, `.env.example`更新
- [x] 6. ログインAPI: `Api/AuthController.php`, `LoginRequest.php`, `routes/api.php`追加, `config/cors.php`

**frontend**
- [x] 7. APIクライアント基盤: `lib/api.ts`, `lib/types.ts`, `.env.local.example`
- [x] 8. ログイン画面: `lib/auth.ts`, `login/page.tsx`
- [x] 9. 管理画面ガード: `admin/layout.tsx`, `AdminHeader.tsx`（後にサイドバー形式の`AdminNav.tsx`から、ヘッダー形式＋Articles配下の公開記事/下書きタブ切り替えに変更）

## フェーズ3: タグ管理

**backend**
- [x] 10. DB: `tags`マイグレーション, `Tag.php`
- [x] 11. 管理タグAPI: `Admin/TagController.php`, `StoreTagRequest.php`, `UpdateTagRequest.php`, `TagAdminResource.php`, routes追加

**frontend**
- [x] 12. TanStack Query導入: `QueryClientProvider`設定, `lib/queryClient.ts`, `admin/layout.tsx`への組み込み（公開ページには影響させないため、ルートlayoutではなくadmin配下のみ）
- [x] 13. タグ管理画面: `admin/tags/page.tsx`＋データ取得・変更ロジックは`useTagsAdmin.ts`に分離

## フェーズ4: 記事CRUD

**backend**
- [x] 14. DB: `posts`/`post_tag`マイグレーション, `Post.php`（リレーション）, `Tag.php`更新
- [x] 15. 管理記事API（読み取り・作成）: `Admin/PostController.php`(index/show/store), `StorePostRequest.php`, `PostAdminResource.php`, routes追加
- [x] 16. 管理記事API（更新・削除）: `Admin/PostController.php`(update/destroy追加), `UpdatePostRequest.php`（routes/api.phpは`apiResource`に統一）

**frontend**
- [x] 17. 一覧画面: `admin/posts/page.tsx`, `admin/drafts/page.tsx`, `Post`型追加（一覧表示は共通の`PostList.tsx`に切り出し）
- [x] 18. タグ選択UI: `TagPicker.tsx`（`useTagsList.ts`を切り出し、`useTagsAdmin.ts`と共用）
- [x] 19. 記事フォーム＋新規作成: `PostForm.tsx`, `admin/posts/new/page.tsx`（`useCreatePost.ts`で作成ロジックを分離）
- [x] 20. 編集・削除: `admin/posts/[slug]/edit/page.tsx`（ガード処理を`AdminShell.tsx`に分離、`admin/layout.tsx`は`instant = false`を設定したServer Componentに）

## フェーズ5: 画像アップロード

**backend**
- [x] 21. 画像アップロードAPI: `Admin/ImageController.php`, `UploadImageRequest.php`, `ImageUploadService.php`（intervention/image、最大幅1600px・品質80）, routes追加

**frontend**
- [x] 22. 画像アップロードUI: `ImageUploader.tsx`, `PostForm.tsx`への統合（サムネイル・本文挿入の両方）

## フェーズ6: 公開ページ

**backend**
- [x] 23. 公開記事API: `Api/PostController.php`(index/show), `PostResource.php`, routes追加
- [x] 24. 公開タグAPI: `Api/TagController.php`(index), `TagResource.php`, routes追加

**frontend**
- [x] 25. 共通レイアウト: `app/layout.tsx`, `globals.css`, `(public)/layout.tsx`（Tailwind v4のため`tailwind.config.ts`は不要）
- [x] 26. 記事一覧1ページ目: `(public)/layout.tsx`, `(public)/page.tsx`, `PostCard.tsx`
- [x] 27. ページ送り: `page/[n]/page.tsx`, `Pagination.tsx`, `lib/pagination.ts`
- [x] 28. 記事詳細: `posts/[slug]/page.tsx`, `MarkdownRenderer.tsx`
- [ ] 29. 目次(TOC): `TableOfContents.tsx`, 詳細ページへの統合
- [ ] 30. タグ別一覧: `tags/[tag]/page.tsx`, `tags/[tag]/page/[n]/page.tsx`, `TagList.tsx`（prefetch付き）

## フェーズ7: 仕上げ

- [ ] 31. サイトマップ: `(public)/sitemap.ts`
- [ ] 32. 再検証Webhook（Next.js側）: `app/api/revalidate/route.ts`
- [ ] 33. 再検証Webhook呼び出し（Laravel側）: `RevalidationService.php`, `Admin/PostController.php`・`Admin/TagController.php`への組み込み
