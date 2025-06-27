# Edit in Intex.md

🧠 **Code & Workflow Improvement Ruleset**  
*This ruleset is used when improving structure, functionality, UI, backend logic, Firestore integration, and performance.*

---

## 🔍 Code Style

**Enforce consistent formatting, naming conventions, and documentation styles**

- Use **camelCase** for variables and functions, **PascalCase** for React components and TypeScript interfaces.
- Consistently **type all functions and props** using TypeScript interfaces/types.
- Each component must have a clear **responsibility** (Single Responsibility Principle).
- Use **ESLint and Prettier** with shared config files to maintain consistent code style.
- Add **JSDoc-style** comments for all exported functions/components.
- Avoid magic numbers/strings. Use enums or constants instead.

---

## 🧪 Functional Testing (Frontend + Backend)

**Ensure full app logic is tested and works as expected:**

- ✅ Create: Data persists to Firestore
- ✅ Read: Frontend reflects Firestore values
- ✅ Update: Edits are saved correctly
- ✅ Delete: Data removes cleanly from UI and DB
- ✅ Complete: Status flows update properly

Simulate:


Test modal buttons, validations, and all possible user flows.

---

## 🔗 Firestore & Integration Testing

**Trace data from UI → Firestore → Listener → Re-render**

- Validate Firestore paths, document shapes, and IDs.
- Check that `onSnapshot`/`getDocs` read from the right place.
- Firestore listeners:
  - Unsubscribe on unmount
  - Avoid duplicates
  - Handle empty collections gracefully
- Firebase Functions:
  - Should receive payload, validate it, and return proper status
  - Use try/catch with fallback messages

---

## 🧰 UI & UX Element Verification

**Visually and functionally verify all components**

- Modal behavior (open, close, submit, error)
- Input field validations
- Loading states
- Empty/error states
- Style consistency with Tailwind
- Responsive design on mobile and desktop

UI Elements to test:
- TripForm.tsx
- DieselImportModal.tsx
- CompletedTripEditModal.tsx
- DriverBehaviorTable.tsx
- Navigation & Sidebar layout

---

## 🔁 State Management & Logic

**Ensure app-wide and component-level logic is robust**

- Use `useState`, `useEffect`, or context/store libraries effectively
- Controlled inputs only
- Debounce high-frequency listeners if needed
- Don’t mutate shared state outside hooks

---

## 📦 File & Folder Structure

**Promote clean structure and component isolation**

- `/components/module-name/`
  - `Form.tsx`, `FormFields.tsx`, `Modal.tsx`
- `/firebase/`
  - `functions.ts`, `listeners.ts`
- `/hooks/` for custom React hooks
- `/utils/` for reusable logic
- `/types/` for central TypeScript interfaces

---

## 🛡 Error Handling & Edge Cases

- All async calls wrapped in try/catch
- Handle:
  - Offline mode
  - Null/undefined values
  - Duplicate submissions
  - Large file imports
  - Firestore write failures

UI must provide fallback messaging on all failures.

---

## 🚀 Deployment & Environments

- Ensure `.env` variables are used (not hardcoded keys)
- Firebase and Netlify configs should auto-deploy `main`
- CI/CD should:
  - Build project
  - Run tests
  - Deploy backend + frontend
- Firebase Hosting and Functions must be versioned and tested

---

## 📊 Recommended Testing Tools

- `React Testing Library` + `Jest`
- Postman / Insomnia for webhook endpoints
- Firebase Emulator Suite for offline Firestore/Functions testing
- Netlify logs + function traces for error debugging

---

## ✅ Verification Checklist

| Area                | Tests |
|---------------------|-------|
| Edit Flow           | ✅    |
| Delete Flow         | ✅    |
| Upload Diesel CSV   | ✅    |
| Save Trip           | ✅    |
| Complete Trip       | ✅    |
| Backend Webhook     | ✅    |
| Real-time Listener  | ✅    |
| Modal Rendering     | ✅    |
| Mobile Responsivity | ✅    |
| Firestore Writes    | ✅    |
| Error Messaging     | ✅    |
| State Updates       | ✅    |

---

💡 _This rule must be activated with a matching .kilocodemode config, e.g., `improvement-all.kilocodemode`._

