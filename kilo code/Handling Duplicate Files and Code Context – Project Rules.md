# Handling Duplicate Files and Code Context – Project Rules

## 1. Scanning and Import Checking
Every file in `/src` must be scanned and its import context analyzed.

> **Never delete a duplicate file without a thorough check!**

Before any deletion, you must determine:
- Which file is actively imported and used?
- Which file(s) are unreferenced, or only partially used?

## 2. De-duplication Process (Step-by-Step)

### A. Identify All Duplicates
- Use scripts like madge, ts-unused-exports, or custom audits to list all potentially duplicate files.
- Compare file content, names, and check import paths and references throughout the app (sidebarConfig, routes, parent components, tests).

### B. Analyze Import/Usage Context
- Find everywhere each version is imported or used.
- Identify which file is the "primary" (most-imported/actively integrated).
- Document which features, logic, types, or exports are unique to each file.

### C. Consolidate and Merge Logic
- Do NOT just delete unused or duplicate files.
- Before removal, merge all additional features, logic, prop types, comments, or exports from the duplicate(s) into the primary version.
- If the duplicate file has extra validation, functions, comments, or types, add these to the main file before removing.
- Make sure to test the final version for regressions or missing functionality.

### D. Update All Imports and References
- After consolidation, update all imports in the codebase to reference the merged file.
- Run `npm run lint` and `analyze:unused` to check for broken or lingering imports.
- Update sidebar, AppRoutes, and any test files to ensure there are no references to the old duplicate.

### E. Safe Deletion
- Only after merging and updating all references, delete the obsolete/duplicate file(s).
- Run a full build, lint, and test suite to confirm nothing is broken.

## 3. Context Building
- If files contain different business logic, comments, or validation, combine all relevant context, documentation, and logic into the kept file.
- Add detailed comments if you merge behavior or fields, so future devs understand all combined logic.

## 4. Documentation and Review
- Document the merge/de-duplication in your PR or commit message.
- Summarize what was merged, what was deleted, and how imports were updated.
- Always submit for code review – never merge a de-duplication/refactor PR unreviewed.

## 5. Summary Table (for Dev Onboarding)

| Step | Action |
|------|--------|
| Scan | List all files and check imports (manual + scripts) |
| Identify | Spot all duplicates and compare content/imports |
| Analyze | See which file is "in use" and what's unique in others |
| Merge | Move all unique/extra logic from duplicates into the imported file |
| Update | Change all imports/code to use the kept file |
| Test | Run lint, audit, and full test suite |
| Delete | Remove the now-obsolete duplicate file(s) |
| Document | Note changes in PR, update related docs if needed |

## 6. Special Notes
- **NEVER** just "delete and hope" – always merge, update, and test.
- If unsure: Ask for a second opinion/code review before removing any code or file.

Following these rules ensures no lost logic, no accidental breakage, and a maintainable codebase!
