 Matanuska Fleet Platform – Standard Workflows

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



 Automated PR Workflow
Search for TODO or debug statements

Run npm test, npm run lint, npm run build

Stage and commit with descriptive message

Push branch and create PR

Document file merges and deletions

🧩 Mode-Adaptive Workflows
Architect Mode: Break deduplication into architecture and implementation tasks.

Debug Mode: Focus on merging only logic relevant to current bugs/errors.

Code Mode: Strictly follow merge/refactor/update/delete process above.

Orchestrator Mode: Delegate each step to team members/modes with instructions and PR documentation.

 Add Enforcement & Violation Handling
Add an Enforcement section to every rules/instructions file.

markdown
Copy
Edit
## Enforcement & Violation Response

- Any pull request (PR) or code change that does not fully comply with these rules will be **immediately rejected** by maintainers.
- Repeat violations (2+ in 30 days) will trigger a review of the contributor’s access privileges.
- Automated checks (CI, bots) will block any merge that fails orphan/duplicate detection, lint, or test gates.
- Major file deletions (over 50 lines or multiple files) require approval by at least two reviewers.
2. Definition of Done
Explicitly state the minimum conditions for a task to be considered complete.

markdown
Copy
Edit
## Definition of Done

- No orphaned or duplicate files remain.
- All imports and references are fully updated.
- Linting, build, and all tests pass.
- Documentation is updated to reflect all changes.
- Peer review is complete and all reviewer comments are addressed.
3. Automated Pre-Merge Checks
Require automated (CI) checks for every PR:

markdown
Copy
Edit
## Automated Checks Before Merge

- `npm run analyze:unused` – No orphaned or unused files.
- `npm run lint` – No unused or missing imports.
- `npm test` and `npm run build` – All tests and build pass.
- PR description must list all merged/deleted files and logic changes.
4. Golden Path Examples
Provide canonical examples for merging, import updating, and PR documentation.

markdown
Copy
Edit
## Example: Merging Duplicate Forms

1. Identify both forms with `madge` and code search.
2. Merge all unique fields, logic, and comments into the main form.
3. Update all imports and references to use the main form.
4. Remove/deprecate the duplicate.
5. Document the merge in the PR.
5. Change Request Checklist
Require that every PR includes a completed checklist like this:

markdown
Copy
Edit
## Change Request Checklist

- [x] Duplicate files identified and merged.
- [x] All unique logic preserved in canonical file.
- [x] All imports updated.
- [x] Lint, build, and tests pass.
- [x] Documentation updated.
- [x] Change clearly described in PR.
- [x] Peer review complete.
6. Self-Audit Requirement
After every major task, contributors must certify (in the PR) that they ran through the full process and checked for:

Orphaned files

Duplicates

Unused imports

All tests passing

7. Mandatory Change Logging
“All file merges, deletions, and significant refactors must be logged in CHANGELOG.md or a designated project audit log.”

8. Explicit Role & Mode Responsibility Table
Define a table for who is allowed/responsible for each action by mode/role:

Role/Mode	Can Implement	Must Review	Forbidden
Code	Yes	No	Deleting without merging
Architect	Yes	Yes	Direct code deletion without plan
Debug	Yes	Yes	Ignoring file consolidation rules
Orchestrator	Yes	Yes	Merging code without subtask approval

9. Review Escalation Policy
Any change deleting more than one file or over 50 lines requires a second reviewer.

No code merges on Fridays without lead approval.

10. Canonical Directory Structure
Include a visual diagram (ASCII or mermaid) of the required /src structure—no deviations allowed.

11. Legacy Folder Enforcement
“No code may remain in /legacy/ or /tmp/ for more than 7 days after merging a PR. All legacy code must be migrated or removed promptly.”

12. Common Pitfalls Section
Highlight common mistakes to avoid:

Merging only one duplicate, leaving others

Testing locally, but not ensuring CI passes

Not syncing sidebar/routes with file changes

# Core Workflows: Matanuska Fleet Management

## 1. Merge & De-duplicate Files

**Trigger:** Duplicate component, form, or utility is found.

**Steps:**
1. Run `npm run analyze:unused` to find orphans and duplicates.
2. Identify which duplicate is imported/referenced.
3. Open both files side-by-side.
4. Merge all unique code/comments from duplicate(s) into the canonical file.
5. Update every import, export, and reference in the codebase.
6. Remove the duplicate file(s).
7. Run `npm run lint` and `npm test`.
8. Update sidebarConfig and routing if relevant.
9. Log all changes in `CHANGELOG.md`.
10. Complete Change Request Checklist in PR.

---

## 2. Add or Update a Page/Feature

**Trigger:** New business requirement or feature addition.

**Steps:**
1. Confirm where the feature fits in `/src` tree and sidebarConfig.
2. Create file(s) **only** if immediately imported and routed.
3. Add all required imports, route entries, and sidebar links.
4. If creating forms or context, connect to global AppContext or relevant module context.
5. Write basic tests for the new feature.
6. Run lint, test, and build.
7. Document in README and CHANGELOG.
8. Submit PR with checklist.

---

## 3. CI Pre-Merge Workflow

**Trigger:** PR submitted.

**Steps:**
1. CI runs `npm run analyze:unused`, `npm run lint`, `npm test`, `npm run build`.
2. Block merge on any failure.
3. Require peer review (two for major refactors/deletions).
4. Confirm PR checklist is complete.
5. Approve and merge only if all steps pass.

---

## 4. Self-Audit & Peer Review

**Trigger:** Before/after code review.

**Steps:**
1. Developer runs all checks, fills checklist.
2. Reviewer verifies:
    - No orphan/duplicate files.
    - Imports, routes, and references are correct.
    - Tests/documentation are updated.
    - No legacy/temp code remains.
3. Both sign off in PR.

---

## 5. Legacy/Temp Code Clean-Up

**Trigger:** Any code in `/legacy/` or `/tmp/`.

**Steps:**
1. Migrate all reusable code into canonical files in `/src`.
2. Remove code from `/legacy/` or `/tmp/`.
3. Run all lint and build checks.
4. Log migration in CHANGELOG.md.
5. Complete PR checklist.

---

**All workflows must be followed and documented in every relevant PR. Deviations are not permitted.**
workflows.md
markdown
Copy
Edit
# Core Workflows: Matanuska Fleet Management

## 1. Merge & De-duplicate Files

**Trigger:** Duplicate component, form, or utility is found.

**Steps:**
1. Run `npm run analyze:unused` to find orphans and duplicates.
2. Identify which duplicate is imported/referenced.
3. Open both files side-by-side.
4. Merge all unique code/comments from duplicate(s) into the canonical file.
5. Update every import, export, and reference in the codebase.
6. Remove the duplicate file(s).
7. Run `npm run lint` and `npm test`.
8. Update sidebarConfig and routing if relevant.
9. Log all changes in `CHANGELOG.md`.
10. Complete Change Request Checklist in PR.

---

## 2. Add or Update a Page/Feature

**Trigger:** New business requirement or feature addition.

**Steps:**
1. Confirm where the feature fits in `/src` tree and sidebarConfig.
2. Create file(s) **only** if immediately imported and routed.
3. Add all required imports, route entries, and sidebar links.
4. If creating forms or context, connect to global AppContext or relevant module context.
5. Write basic tests for the new feature.
6. Run lint, test, and build.
7. Document in README and CHANGELOG.
8. Submit PR with checklist.

---

## 3. CI Pre-Merge Workflow

**Trigger:** PR submitted.

**Steps:**
1. CI runs `npm run analyze:unused`, `npm run lint`, `npm test`, `npm run build`.
2. Block merge on any failure.
3. Require peer review (two for major refactors/deletions).
4. Confirm PR checklist is complete.
5. Approve and merge only if all steps pass.

---

## 4. Self-Audit & Peer Review

**Trigger:** Before/after code review.

**Steps:**
1. Developer runs all checks, fills checklist.
2. Reviewer verifies:
    - No orphan/duplicate files.
    - Imports, routes, and references are correct.
    - Tests/documentation are updated.
    - No legacy/temp code remains.
3. Both sign off in PR.

---

## 5. Legacy/Temp Code Clean-Up

**Trigger:** Any code in `/legacy/` or `/tmp/`.

**Steps:**
1. Migrate all reusable code into canonical files in `/src`.
2. Remove code from `/legacy/` or `/tmp/`.
3. Run all lint and build checks.
4. Log migration in CHANGELOG.md.
5. Complete PR checklist.

---

**All workflows must be followed and documented in every relevant PR. Deviations are not permitted.**
