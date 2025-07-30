# Matanuska Fleet Platform – Instructions

## Purpose
These instructions define **how to implement, enforce, and maintain** the project's code quality, file structure, and import logic, as defined in `rules.md`.

---

## 🛠️ File/Import Consolidation: Step-by-Step

1. **Scan & Identify**
   - Use code analysis tools (`madge`, `ts-unused-exports`, etc.) to list:
     - Orphaned files (not imported/referenced)
     - Potential duplicates (similar names/content)

2. **Map All References**
   - For every candidate file, search the entire codebase for:
     - Imports (components, routes, context, sidebar, tests, etc.)
     - Usage in workflows, hooks, or scripts

3. **Determine the Primary File**
   - Choose the canonical file (imported most, architecturally correct).
   - Note all unique logic, types, comments in each version.

4. **Merge All Logic**
   - Copy all unique code, validation, types, comments, and exports into the primary file.
   - Refactor as needed to avoid logic loss or behavior regression.

5. **Update All Imports**
   - Refactor all references in codebase to the merged file.
   - Remove references to duplicates everywhere.

6. **Delete Obsolete Files**
   - Once fully merged and all imports are updated, safely delete the unused file(s).

7. **Test and Lint**
   - Run `npm run lint`, `npm run build`, and all tests (unit/integration/UI).
   - Confirm no UI, logic, or data loss in manual flows if relevant.

8. **Document the Change**
   - In your PR/commit, summarize:
     - Which files were merged
     - What was moved/refactored
     - Which files were deleted

9. **Peer Review**
   - Submit the change for review—do not merge without approval from another team member.

---

## 🧭 Automation & Mode Guidance

- **When using Kilo Code Context Mentions:**
  - Always reference the canonical (merged) file path.
  - Use precise @/src/… paths in all chat/tasks.
- **When using Code Actions:**
  - Do not "fix by deletion" if code is duplicated; follow the merge steps above.
  - Always choose "Add to Context" before "Fix/Refactor" if in doubt.
- **In Architect/Debug/Orchestrator Mode:**
  - Break complex merges into sub-tasks and document workflows.

---

## 🔎 Audit & Maintenance

- Audit the codebase monthly for:
  - Orphaned/unused files
  - Stale/duplicate logic
  - Unused imports

---

## 📋 Example: Merging Duplicate Forms

1. Identify both forms with `madge` and code search.
2. Merge all unique fields, logic, and comments into the main form.
3. Update all imports and references to use the main form.
4. Remove/deprecate the duplicate.
5. Document the merge in the PR.

---

## ✓ Change Request Checklist

- [ ] Duplicate files identified and merged.
- [ ] All unique logic preserved in canonical file.
- [ ] All imports updated.
- [ ] Lint, build, and tests pass.
- [ ] Documentation updated.
- [ ] Change clearly described in PR.
- [ ] Peer review complete.

---

# Step-by-Step Instructions for Code Deduplication

## 1. Scan and Identify
- Use audit tools (madge, ts-unused-exports, analyze:unused, etc.)
- List all files and spot duplicates or unimported files

## 2. Find All References
- Search the entire codebase for every import, usage, or reference to each file

## 3. Analyze & Decide Primary File
- Decide which file is the "main" (most used/imported/architecturally correct)
- Note any extra logic, validation, comments, types, or exports in all versions

## 4. Merge Logic
- Merge all unique logic, comments, and types from duplicates into the main file
- Add documentation/comments as you merge, explaining any non-obvious merges

## 5. Update Imports & Usages
- Update every import and usage in the app to reference the main (merged) file
- Check sidebar, AppRoutes, context, tests, and utilities for references

## 6. Test Everything
- Run `npm run lint`, `npm run build`, and all test scripts
- Manually check UI flows if needed

## 7. Delete Duplicates
- Only after merging and updating imports, safely delete obsolete duplicate files

## 8. Document the Process
- Clearly document what was merged, deleted, and where logic was moved in PR/commit message

## 9. Submit for Review
- Always submit your changes for code review before merging
