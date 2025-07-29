# Matanuska Fleet Platform – Standard Workflows

## Purpose
Workflows automate repetitive codebase quality and file maintenance tasks, ensuring all contributors follow `rules.md` and `instructions.md`.

---

## 📋 Codebase Deduplication Workflow

1. **/scan-orphans.md**
   - Scan for files in `/src` not imported anywhere
   - Generate a report of orphaned and duplicate files

2. **/analyze-duplicates.md**
   - For each potential duplicate:
     - List all usage/import locations
     - Summarize logic/types in each

3. **/merge-and-refactor.md**
   - For every true duplicate:
     - Open both/all files
     - Merge all logic/types/comments into the canonical file
     - Refactor and update imports

4. **/test-lint-validate.md**
   - Run all lint/build/test commands
   - Manual UI check for key flows
   - Fix any issues found

5. **/document-changes.md**
   - Summarize changes in PR/commit
   - List files merged/deleted, logic moved, import updates

6. **/submit-review.md**
   - Assign for peer review before merge

---

## 📦 Example: Monthly Maintenance Workflow

```bash
# Run monthly maintenance
npm run analyze:unused
npm run lint
npm run build

# Generate orphan report
bash scripts/syncRoutes.sh
# Review and merge orphans per above steps
```

---

## 🛡️ Automated PR Workflow

1. Search for TODO or debug statements
2. Run npm test, npm run lint, npm run build
3. Stage and commit with descriptive message
4. Push branch and create PR
5. Document file merges and deletions

---

## 🧩 Mode-Adaptive Workflows

- **Architect Mode**: Break deduplication into architecture and implementation tasks.
- **Debug Mode**: Focus on merging only logic relevant to current bugs/errors.
- **Code Mode**: Strictly follow merge/refactor/update/delete process above.
- **Orchestrator Mode**: Delegate each step to team members/modes with instructions and PR documentation.

---

## 🔄 Review Escalation Policy

- Any change deleting more than one file or over 50 lines requires a second reviewer.
- No code merges on Fridays without lead approval.
- All file merges, deletions, and significant refactors must be logged in CHANGELOG.md.

---

## ⚠️ Common Pitfalls (Avoid!)

- Merging only one duplicate, leaving others
- Testing locally, but not ensuring CI passes
- Not syncing sidebar/routes with file changes
- Failing to log merges or deletions

---

*Updated July 2025 by Matanuska Fleet Platform Maintainers*
