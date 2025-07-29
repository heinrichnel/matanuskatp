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
