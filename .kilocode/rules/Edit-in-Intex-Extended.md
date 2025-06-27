
# Edit in Intex.md

## 🧠 Advanced Performance & Optimization

**Analyse and improve performance across UI and backend**

- Profile component re-renders using React DevTools → prevent unnecessary renders
- Lazy load non-critical modules (e.g., PDF export, CSV imports)
- Paginate large Firestore queries (use `limit` and `startAfter`)
- Memoize computed values (`useMemo`, `useCallback`) where beneficial
- Avoid loading entire collections into memory — always filter at query level
- De-bounce user typing or search fields
- Test time-to-interact (TTI) on mobile

## 🔐 Authentication, Authorization & Permissions

**Make sure roles and access boundaries are enforced**

- Firebase Authentication:
  - Confirm that all write actions require a signed-in user
  - Anonymous users should not trigger writes
- Firestore Rules:
  - Read/write rules must match app logic
  - Test with different users and roles
- Functions:
  - Secure endpoints with request validation or service account restrictions
- UI-level role filtering (e.g., Admin vs Viewer)
  - Hide buttons and modals for unauthorized roles

## 🌐 Offline Support & Sync Recovery

**Ensure resilience to dropped connections or failed syncs**

- Firestore:
  - Enable offline persistence where needed
  - Detect network reconnection and resync changes
- UI:
  - Show “Reconnecting…” indicators if Firestore disconnects
  - Provide retry options for failed submissions
- Use Firestore’s `.pendingWrites` flags to warn user about unsynced data

## 🧭 Audit Trails & Logging

**Track what happened, when, and by whom**

- Each update must be recorded with:
  - `updatedBy` (user email/ID)
  - `updatedAt` (timestamp)
  - `changeReason` if applicable
- CompletedTripEditModal must store edit logs per change
- Firebase Functions must `console.log()` inputs and errors with `JSON.stringify()`
- Enable Firebase Cloud Logging on all functions

## 🔃 File Uploads, Images & Attachments

- Ensure files are uploaded to correct Firebase Storage path
- Validate file type and size before upload
- Provide user feedback (e.g., upload progress, success, error)
- Store reference to uploaded file (URL, metadata) in Firestore
- Delete file from storage when Firestore doc is deleted

## 📤 Webhook & External API Testing

**Test all integrations across backend**

- For each webhook (e.g. `importDriverBehaviorWebhook`, `importTripsFromWebBook`):
  - Test manually with Postman
  - Confirm headers, payload shape, and response codes
- Retry logic for failed external posts
- Avoid duplicate writes (use unique doc IDs)
- Rate-limit if necessary to avoid flooding Firebase Functions

## 📦 CSV Import & Data Transformation

**For Diesel CSV, Trip CSV and Driver Behavior events**

- Validate structure (required columns, data types)
- Sanitize input (e.g., date strings, malformed numbers)
- Flag duplicates
- Track how many rows succeeded, failed, or skipped
- Add rollback logic (if any row in a batch fails)

## 🧪 Manual QA Checklist Addendum

| Feature                         | Steps to Verify                  |
|----------------------------------|----------------------------------|
| Real-Time Firestore Sync        | Add → reload → appears instantly |
| Trip Edits Persist              | Change → Save → Confirm update   |
| Modal Validation                | Submit with errors → Block save |
| Upload PDF/Image                | Upload → Preview → Confirm path |
| Webhook Firestore Flow          | Post payload → Check collection |
| Offline Sync                    | Disconnect Wi-Fi → add trip → reconnect |
| Firebase Rule Denial            | Try write as guest → deny        |

## 📁 Deployment Health & Final Validation

- `vite build` must complete with 0 warnings/errors
- Netlify deploy logs must show “build succeeded”
- Firebase Functions console must be free of:
  - `UnhandledPromiseRejection`
  - `Permission denied`
  - `undefined` variable errors
- CI/CD deploy action must run on `push to main`
- All env variables must be resolved correctly in production

✳️ Once these improvements are implemented and verified, update the version changelog and deploy the latest build to Netlify and Firebase.
