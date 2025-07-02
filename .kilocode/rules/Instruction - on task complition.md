# Task Completion – Required Git Workflow

Upon completion of any development task (feature, bug fix, or update), you **must** follow this workflow to ensure all changes are committed and pushed to the `main` branch:

1. **Stage all changes:**
   ```sh
   git add .
Commit with a clear message describing the task completed:

sh
Copy
Edit
git commit -m "Describe the completed task"
Push your commit(s) to the main branch:

sh
Copy
Edit
git push origin main
Verify on your remote repository (e.g., GitHub) that all changes appear under the main branch.

Notes:

Ensure your local branch is up to date with main before starting a new task (git pull origin main).

If you encounter conflicts during push, resolve them locally before retrying.

This workflow ensures every completed task is immediately backed up and visible to the team.

