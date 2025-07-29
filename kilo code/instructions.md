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

*Updated July 2025 by Matanuska Fleet Platform Maintainers*
