# 🚨 Pre-Deployment Checklist

> This checklist must be completed before deploying any updates to the Firebase Cloud Functions or related code to the production environment.

## 📋 Webhook Testing & Validation

### 1. Driver Behavior Webhook

- [ ] **Browser-based Tests**
  - [ ] Open `webhook-test.html` in browser
  - [ ] Test single valid event
  - [ ] Test multiple events payload
  - [ ] Verify duplicate detection (409 response for identical events)
  - [ ] Verify validation errors (400 response for invalid payloads)

- [ ] **Automated Tests**
  - [ ] Run `npm run test` from webhook testing package
  - [ ] Verify all test scenarios pass
  - [ ] Check error handling is functioning correctly

- [ ] **Firestore Verification**
  - [ ] Run `npm run verify` to check records were properly stored
  - [ ] Confirm document IDs follow pattern: `${fleetNumber}_${eventType}_${eventTime}`
  - [ ] Verify all required fields are present in stored documents

### 2. Function Configuration & Security

- [ ] **Authentication**
  - [ ] Webhook endpoints require proper authentication
  - [ ] Service account has minimal required permissions
  - [ ] No hardcoded credentials in function code

- [ ] **Error Handling**
  - [ ] All functions include try/catch blocks
  - [ ] Proper error responses with appropriate status codes
  - [ ] Detailed logging for debugging purposes

- [ ] **Performance**
  - [ ] Function cold start time is acceptable (< 2 seconds)
  - [ ] Large batch operations use chunking (max 500 per batch)
  - [ ] Memory usage stays within limits

## 🔍 General Function Deployment Checks

- [ ] **Local Testing**
  - [ ] Functions tested in Firebase emulator
  - [ ] No TypeScript compilation errors
  - [ ] ESLint passes without errors

- [ ] **Integration Validation**
  - [ ] Frontend components properly interact with functions
  - [ ] Webhook senders include proper retry logic
  - [ ] Event listeners update UI in real-time

- [ ] **Documentation**
  - [ ] Function behavior documented in code comments
  - [ ] API endpoints documented for external consumers
  - [ ] Webhook payload schemas documented

## 🚀 Deployment Steps

1. Review code changes one final time
2. Run `npm run build` to ensure compilation is successful
3. Deploy to staging first: `firebase deploy --only functions --project staging`
4. Test on staging environment
5. Deploy to production: `firebase deploy --only functions --project production`
6. Verify in production (minimal test)
7. Monitor logs for 30 minutes after deployment

## 🧯 Rollback Plan

If issues are detected after deployment, follow these steps:

1. Identify which functions are problematic
2. Revert code to last known good state
3. Deploy reverted code: `firebase deploy --only functions:functionName`
4. Notify team of rollback and issue
5. Document issue in incident log

---

> This checklist was completed by: ___________________  
> Date: ___________________  
> Approved by: ___________________