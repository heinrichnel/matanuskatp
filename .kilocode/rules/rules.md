# Project Coding & Structure Rules

## Core Principles

- All files must be properly imported and referenced within the `/src` directory tree.
- No file may be created unless it is immediately imported somewhere in the application.
- Duplicates are not permitted. When duplicates are found, only the version in active use should remain; logic, comments, and features from other copies must be merged into the canonical file.
- After merging, all imports and references must point to the remaining canonical file. Orphaned or unused files must be removed.
- All feature, form, page, or context files must be connected to routing and/or a central state/context if required by the module.
- Only delete a file after verifying its contents are merged and it’s not imported anywhere.
- All merges, deletions, and major changes must be logged in `CHANGELOG.md` or the audit log.
- No code may remain in `/legacy/` or `/tmp/` longer than 7 days after a PR merge. Legacy code must be migrated or removed.

## Automated Enforcement

- Pull Requests (PRs) are blocked if:
  - Orphaned, duplicate, or unused files are detected (`npm run analyze:unused`)
  - Lint or build fails (`npm run lint`, `npm run build`)
  - Tests do not pass (`npm test`)
- All PRs must include a completed Change Request Checklist (see instructions.md).
- PRs deleting >1 file or >50 lines must have two reviewers.
- No code merges on Fridays without explicit team lead approval.

## Definition of Done

- No orphaned or duplicate files remain.
- All imports, routes, and references updated.
- Build, lint, and all tests pass.
- Documentation and CHANGELOG are updated.
- PR passes peer review and checklist.
- All merges and deletions are properly logged.

## Roles & Mode Responsibility

| Role/Mode      | Can Implement | Must Review | Forbidden                              |
| -------------- | ------------ | ----------- | -------------------------------------- |
| Code           | Yes          | No          | Deleting without merging or logging    |
| Architect      | Yes          | Yes         | Direct code deletion w/o plan          |
| Debug          | Yes          | Yes         | Ignoring file policy or audit trail    |
| Orchestrator   | Yes          | Yes         | Merging code w/o approved subtasks     |

## Violation Handling

- Any PR or code change violating these rules will be **immediately rejected**.
- Two violations in 30 days triggers an access privilege review.
- Major file deletions require logging and dual approval.
- Automated checks (CI/bots) will block all non-compliant merges.

## Common Pitfalls (Avoid!)

- Leaving duplicates after merging only one file.
- Updating code locally but not syncing CI.
- Breaking routing/sidebar sync with file moves.
- Failing to log merges or deletions.

---

**Remember: All rules must be actively enforced to keep the codebase clean, maintainable, and scalable.**





# Project Coding & Structure Rules

## Core Principles

- All files must be properly imported and referenced within the `/src` directory tree.
- No file may be created unless it is immediately imported somewhere in the application.
- Duplicates are not permitted. When duplicates are found, only the version in active use should remain; logic, comments, and features from other copies must be merged into the canonical file.
- After merging, all imports and references must point to the remaining canonical file. Orphaned or unused files must be removed.
- All feature, form, page, or context files must be connected to routing and/or a central state/context if required by the module.
- Only delete a file after verifying its contents are merged and it’s not imported anywhere.
- All merges, deletions, and major changes must be logged in `CHANGELOG.md` or the audit log.
- No code may remain in `/legacy/` or `/tmp/` longer than 7 days after a PR merge. Legacy code must be migrated or removed.

## Automated Enforcement

- Pull Requests (PRs) are blocked if:
  - Orphaned, duplicate, or unused files are detected (`npm run analyze:unused`)
  - Lint or build fails (`npm run lint`, `npm run build`)
  - Tests do not pass (`npm test`)
- All PRs must include a completed Change Request Checklist (see instructions.md).
- PRs deleting >1 file or >50 lines must have two reviewers.
- No code merges on Fridays without explicit team lead approval.

## Definition of Done

- No orphaned or duplicate files remain.
- All imports, routes, and references updated.
- Build, lint, and all tests pass.
- Documentation and CHANGELOG are updated.
- PR passes peer review and checklist.
- All merges and deletions are properly logged.

## Roles & Mode Responsibility

| Role/Mode      | Can Implement | Must Review | Forbidden                              |
| -------------- | ------------ | ----------- | -------------------------------------- |
| Code           | Yes          | No          | Deleting without merging or logging    |
| Architect      | Yes          | Yes         | Direct code deletion w/o plan          |
| Debug          | Yes          | Yes         | Ignoring file policy or audit trail    |
| Orchestrator   | Yes          | Yes         | Merging code w/o approved subtasks     |

## Violation Handling

- Any PR or code change violating these rules will be **immediately rejected**.
- Two violations in 30 days triggers an access privilege review.
- Major file deletions require logging and dual approval.
- Automated checks (CI/bots) will block all non-compliant merges.

## Common Pitfalls (Avoid!)

- Leaving duplicates after merging only one file.
- Updating code locally but not syncing CI.
- Breaking routing/sidebar sync with file moves.
- Failing to log merges or deletions.

---

**Remember: All rules must be actively enforced to keep the codebase clean, maintainable, and scalable.**
