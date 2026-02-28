# Blog + Newsletter + Lead Sync Fix Plan

## Goal
Stabilize blog management (admin + backend + web), make category/author/service/slug/status truly persistent, fix editor/image flows, and connect newsletter subscribe to dashboard lead pipeline + email delivery.

## Scope (from your report)
1. Dashboard blog category shows fixed 4; web shows many; category create does not persist.
2. Saving as draft becomes published.
3. Blog create modal category dropdown style unreadable and not backend connected.
4. Writer input needs managed dropdown (avatar + add + delete).
5. Related Service is not properly connected; icon should auto from selected service; manual icon input should be removed.
6. URL slug is not connected.
7. Post Content editor is not working as expected.
8. Blog update image is broken (file update and URL update issues).
9. Web featured blog should be manually selectable from dashboard.
10. Blog-page subscribe does not appear in dashboard Lead Management, does not send mail, duplicate emails still show success.

## Current Root Causes (confirmed from code)
1. Blog categories in dashboard are local in-memory state (`initialCategories`) via `CategoryModal`; no backend model/API.
2. Backend blog schema has only: title, writer, readingTime, image, details, tags. No category, slug, status, serviceId, icon, featured.
3. Dashboard maps every fetched post to `status: 'published'` and `category: 'Uncategorized'` regardless of DB.
4. Writer is plain text input; no author source table.
5. Related service currently reads legacy `/services`; selected `serviceId` is not stored in backend blog model.
6. Slug field exists in UI only; backend does not store/validate unique slug.
7. RichTextEditor toolbar buttons have no editing logic; it is just a textarea.
8. Image update UX/API mismatch:
   - `ImageUploadField` prevents direct file replacement unless remove first.
   - Save payload sends `imageFile` only; URL updates often not sent.
   - Backend validation/schema does not formally support all image update scenarios.
9. Web homepage blog section uses static `featuredPosts` from constants, not backend.
10. Web blog subscribe uses Google Apps Script endpoint directly, not backend analytics/newsletter system.
11. LeadManagement newsletter tab reads `analytics` event `newsletter_subscribed`; web blog subscribe does not post this event.
12. Blog subscribe fallback shows success even on catch block.

## Implementation Strategy

### Phase 1 - Backend Blog Data Model Upgrade
- Update blog schema/interface/validation with persistent fields:
  - `categoryId` (ObjectId -> BlogCategory)
  - `categoryName` (denormalized string for quick render)
  - `slug` (unique, lowercase, hyphen)
  - `status` (`draft | published`)
  - `serviceId` (ObjectId -> Service or ServiceCategory, based on chosen source)
  - `serviceIcon` (auto-computed/denormalized)
  - `authorId` (ObjectId -> BlogAuthor)
  - `authorName`, `authorAvatar`
  - `isFeatured` (boolean), `featuredOrder` (optional)
- Keep `tags`, `image`, `details`, `readingTime` as existing.
- Add indexes: `slug unique`, `status`, `isFeatured`, `categoryId`.

### Phase 2 - New Backend Supporting Modules
- Create `blog-categories` module:
  - CRUD + list endpoints.
  - Soft delete support if needed.
- Create `blog-authors` module:
  - CRUD + list endpoints.
  - Fields: `name`, `avatar`, `isActive`.
- Add blog-specific endpoints:
  - `GET /blogs/featured`
  - `PATCH /blogs/:id/feature`
  - `GET /blogs/slug/:slug` (optional but recommended).

### Phase 3 - Blog Create/Update Logic Hardening
- In backend controller/service:
  - Resolve `serviceIcon` from selected service automatically.
  - If `slug` not provided -> auto generate from title.
  - If slug conflict -> add deterministic suffix.
  - Respect `status` draft/published.
  - Accept both image file upload and image URL update cleanly.
- If `isFeatured=true` and single-feature mode is required:
  - Auto-unfeature previous featured blog.

### Phase 4 - Data Migration / Backfill
- One migration script for existing blog documents:
  - generate missing slug from title.
  - set default `status='published'` for old records.
  - map missing category to `Uncategorized` category record.
  - preserve existing tags.
- Seed default categories (Mobile, AI, Web3, Backend) only if user wants these as defaults.

### Phase 5 - Admin Dashboard BlogManagement Refactor
- Replace local category modal source with backend APIs.
- Replace writer input with Author dropdown component:
  - show avatar + name list.
  - add-new author inline/modal.
  - delete author action.
- Related Service:
  - fetch from chosen backend source.
  - remove manual icon input field.
  - on service select -> auto display selected icon.
- Slug field:
  - auto-fill from title (editable).
  - show slug validation feedback.
- Status:
  - send and render real backend status.
- Fix category select option readability:
  - explicit option styling for dark theme.
- Ensure table uses API values directly (no forced published/default category mapping).

### Phase 6 - Editor + Image UX Fix in Admin
- Replace current pseudo toolbar with real rich text editor (recommended: ReactQuill/Tiptap).
- Persist HTML/markdown output in `details`.
- Improve ImageUploadField:
  - support replace file while preview exists.
  - support URL mode + upload mode toggle.
  - validate URL and show load-error state.
- Update save payload builder to always send intended image value:
  - file -> multipart `image`.
  - URL -> `imageUrl` or `image` string field.

### Phase 7 - Web Blog Integration
- Blog page category list should use backend category field (not random tag explosion).
- Homepage blog section should fetch featured blogs from backend.
- Blog page featured block should use backend-selected featured post (or featuredOrder), not first filtered item.
- Keep fallback behavior when no featured exists.

### Phase 8 - Newsletter Pipeline (Blog Subscribe -> Backend -> Lead Management + Email)
- Add backend newsletter subscriber module:
  - fields: `email (unique)`, `source`, `subscribedAt`, `status`.
  - endpoint: `POST /newsletter/subscribe` with duplicate handling.
- On successful subscribe:
  - store subscriber record.
  - emit analytics event `newsletter_subscribed`.
  - send notification email to admin recipient(s).
  - optional welcome email to subscriber.
- On duplicate email:
  - return deterministic response (e.g., `already_subscribed`) without false success.
- Update web BlogPage subscribe to call backend endpoint (not GAS).
- Optionally align Footer subscribe to same backend endpoint for consistency.

### Phase 9 - Lead Management Alignment
- Keep existing analytics-based pipeline but ensure newsletter subscribe now creates event.
- Optionally add direct `newsletterApi.getSubscribers()` and merge/fallback for reliability.
- Verify newsletter tab shows new subscriptions immediately after refresh.

### Phase 10 - QA, Validation, and Release Checks
- API tests:
  - create draft/published, update status, slug uniqueness, featured toggle.
  - image update by file and by URL.
  - category/author CRUD persistence.
  - newsletter subscribe success + duplicate path.
- UI tests:
  - category persistence after refresh.
  - writer dropdown add/delete.
  - related service auto icon.
  - editor content save/load.
  - featured blog appears in web correctly.
  - lead management newsletter tab receives new subscribe.
- Smoke test end-to-end:
  - Create draft blog -> remains draft.
  - Publish selected blog -> appears in web list.
  - Mark featured blog -> featured appears on web.
  - Subscribe with same email twice -> second attempt shows duplicate state, no fake success.

## Execution Order (recommended)
1. Backend schema + endpoints
2. Migration/backfill
3. Admin BlogManagement refactor
4. Web featured/category integration
5. Newsletter backend + web subscribe switch
6. Lead management verification
7. Final QA

## Risks and Notes
- Existing data lacks new fields, so migration is mandatory.
- Service source needs one decision: use legacy `services` vs new `service categories` as related service reference.
- Real rich-text editor package adds dependency; we should standardize output format (HTML recommended).
- If production already has GAS data, we may need one-time import for newsletter continuity.

## Definition of Done
- Category/author/service/slug/status/featured are fully backend-persistent.
- Draft and published behave correctly in dashboard and web.
- Editor and image update flows work reliably.
- Featured blog is manually controlled from dashboard and reflected on web.
- Blog subscribe is backend-driven, deduplicated, sends email, and appears in Lead Management.
