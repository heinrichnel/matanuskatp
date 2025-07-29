# Robust Rule Set

## Core Principles

### No Orphaned Files
- Every file in `/src` must be imported and referenced in the project (via routes, sidebarConfig, context, parent components, or tests)
- No file may exist in the codebase if it is not connected to the app's structure

### No Duplicate Files
- Never leave duplicate files or code
- If similar/duplicate files exist, they must be merged and consolidated — never simply deleted or ignored

### No Blind Deletion
- Never delete a file because it "looks unused" or "is named similarly"
- Before deletion: Always check all imports, usage, and unique logic between files

### Merge All Unique Logic
- If files are duplicates, all unique logic, validation, types, or comments must be merged into the file that is actually imported/used
- Never lose business logic, comments, or types

### Update All References
- After merging/consolidating, all imports and usage throughout the app must reference the merged/primary file
- No broken or stale imports may remain

## Additional Requirements

### Code Quality
- Enforce Imports: No new file/component/page may be added unless it is imported and referenced immediately
- Lint, Build, and Test: All changes must pass linting, a successful build, and all relevant tests before merging
- No PR may be merged if it introduces errors or test failures

### Process Requirements
- Document All Changes: Every merge, consolidation, or deletion must be documented in the PR/commit message and with comments in code
- Require Code Review: No file deletion, merge, or refactor may be merged into main without a second-person review and approval
- No Manual Data Source Bypass: All data must be managed via the proper context/hooks pattern

## Instructions: Handling Duplicate Files and Imports

### Step-by-Step Process
1. **Scan and Identify**
  - Use audit tools (madge, ts-unused-exports, analyze:unused, etc.) to list all files and spot duplicates or unimported files

2. **Find All References**
  - Search the entire codebase for every import, usage, or reference to each file

3. **Analyze & Decide Primary File**
  - Decide which file is the "main" (most used/imported/architecturally correct)
  - Note any extra logic, validation, comments, types, or exports in both/all versions

4. **Merge Logic**
  - Merge all unique logic, comments, and types from duplicates into the main file
  - Add documentation/comments as you merge, explaining any non-obvious merges

5. **Update Imports & Usages**
  - Update every import and usage in the app to reference the main (merged) file
  - Check sidebar, AppRoutes, context, tests, and utilities for references

6. **Test Everything**
  - Run npm run lint, npm run build, and all test scripts to verify nothing broke
  - Manually check UI flows if needed

7. **Delete Duplicates**
  - Only after merging and updating imports, safely delete obsolete duplicate files

8. **Document the Process**
  - Clearly document what was merged, what was deleted, and where logic was moved in your PR or commit message

9. **Submit for Review**
  - Always submit your changes for code review before merging
