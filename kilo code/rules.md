# Matanuska Fleet Platform – Ruleset

## Purpose
These rules are **strictly enforced** for all contributors, AI code actions, and workflow automation in the `/src` tree of the Matanuska Transport Platform (React/TypeScript, Firebase backend, Netlify frontend).

---

## 🚫 Core File & Import Rules

1. **No Orphaned Files**
   - Every file must be imported/referenced (route, context, sidebar, parent, or test).
   - Orphaned files are not permitted.

2. **No Duplicates**
   - Duplicate or near-duplicate files are strictly forbidden.
   - All shared/overlapping logic must be merged into a single canonical file.

3. **Merge Before Delete**
   - Never delete a file if it contains unique logic, types, or comments—merge these into the primary imported file before deletion.

4. **Immediate Import Requirement**
   - No file, page, or utility may be created unless it is immediately imported and referenced.

5. **No Unused Imports**
   - Code must be regularly audited (tools: `madge`, `ts-unused-exports`, etc.) to ensure there are no unused or missing imports.

6. **Update All References**
   - After merging, update *every* code reference to point to the merged file—no legacy/broken imports allowed.

7. **Testing & Linting Mandatory**
   - No changes/merges are allowed unless they pass lint, build, and all tests (unit/integration/UI).

8. **Documentation Required**
   - Every consolidation, merge, or deletion must be clearly described in commit/PR messages.

9. **Peer Review Required**
   - No change may be merged to `main` without code review by another contributor.

10. **Immediate Tech Debt Response**
    - Any orphaned/duplicate file must be flagged and resolved as a priority.

---

## 🧩 Project Context-Specific Rules

- **TypeScript/React Only:**
  All code must comply with TypeScript and React best practices for modular, maintainable, and strongly-typed code.
- **No "ad-hoc" data fetching:**
  All data access must go via context/hooks—not direct fetches or local hacks.
- **Sidebar & Routing:**
  All pages/components referenced in the sidebar or navigation *must* be routed in AppRoutes/App.tsx.
- **Context-Driven Data Flow:**
  All state/data must use the designated context/provider pattern (AppContext, TyreContext, etc.)
- **Firebase/Firestore Usage:**
  All persistent data must follow the Firestore structure outlined in system documentation. No manual local file data stores.

---

## 📦 Project Structure & Mode Integration

- **Custom Modes:**
  All project modes (Code, Architect, Debug, Orchestrator, Ask) must respect these rules.
- **File Mentions:**
  @/src/… mentions always reflect the true canonical file location.
- **Workflows & Automation:**
  All workflow markdown and automation scripts must adhere to this policy.

---

## ⚠️ Enforcement & Violation Response

- Any pull request (PR) or code change that does not fully comply with these rules will be **immediately rejected** by maintainers.
- Repeat violations (2+ in 30 days) will trigger a review of the contributor's access privileges.
- Automated checks (CI, bots) will block any merge that fails orphan/duplicate detection, lint, or test gates.
- Major file deletions (over 50 lines or multiple files) require approval by at least two reviewers.

---

## ✅ Definition of Done

- No orphaned or duplicate files remain.
- All imports and references are fully updated.
- Linting, build, and all tests pass.
- Documentation is updated to reflect all changes.
- Peer review is complete and all reviewer comments are addressed.

---

*Updated July 2025 by Matanuska Fleet Platform Maintainers*
