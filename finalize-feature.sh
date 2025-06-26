#!/bin/bash

# =================================================================
# Finalize Feature Script
# =================================================================
#
# Automates the entire workflow for finalizing a feature branch.
# This script ensures dependencies are installed, runs all validation
# checks (linting, tests), creates a production build, and then
# safely merges the feature into the main branch and deploys.
#
# Usage:
# ./finalize-feature.sh "Your meaningful commit message"
#

# --- Configuration and Setup ---
# Halt script on any error, undefined variable, or pipe failure
set -euo pipefail

# --- Color Codes for Output ---
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[0;33m'
COLOR_RED='\033[0;31m'
COLOR_RESET='\033[0m'

# --- Helper Functions ---
function print_stage {
    echo -e "\n${COLOR_YELLOW}====== $1 ======${COLOR_RESET}"
}

function print_success {
    echo -e "${COLOR_GREEN}✅ $1${COLOR_RESET}"
}

function print_error {
    echo -e "${COLOR_RED}❌ ERROR: $1${COLOR_RESET}" >&2
    exit 1
}

# --- Argument Validation ---
COMMIT_MESSAGE="${1-}" # Use default empty value to avoid unbound variable error
if [ -z "$COMMIT_MESSAGE" ]; then
    print_error "Commit message is required. Usage: ./finalize-feature.sh \"Your commit message\""
fi

# --- Main Script ---
# 1. Get current branch name
FEATURE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$FEATURE_BRANCH" == "main" ]; then
    print_error "This script cannot be run on the 'main' branch. Please run it from a feature branch."
fi
print_stage "Starting finalization for branch: $FEATURE_BRANCH"

# 2. Install dependencies
print_stage "Ensuring dependencies are up to date..."
npm install
print_success "Dependencies installed."

# 3. Run validation checks
print_stage "Running linter..."
npm run lint
print_success "Linter passed."

print_stage "Running tests..."
npm run test
print_success "All tests passed."

# 4. Create production build
print_stage "Creating production build..."
npm run build
print_success "Production build created successfully in 'dist/' directory."

# 5. Commit changes
print_stage "Committing changes..."
git add .
git commit -m "$COMMIT_MESSAGE"
print_success "Changes committed with message: \"$COMMIT_MESSAGE\""

# 6. Merge into main branch
print_stage "Merging into main branch..."
git checkout main
print_success "Switched to 'main' branch."

git pull origin main
print_success "Pulled latest changes from 'origin main'."

git merge "$FEATURE_BRANCH"
print_success "Merged branch '$FEATURE_BRANCH' into 'main'."

# 7. Push to remote
print_stage "Pushing changes to remote..."
git push origin main
print_success "Pushed 'main' branch to remote repository."

# 8. Trigger deployment
print_stage "Triggering deployment..."
if [ -f "./scripts/deploy.sh" ]; then
    chmod +x ./scripts/deploy.sh
    ./scripts/deploy.sh
    print_success "Deployment script executed."
else
    print_error "Deployment script not found at ./scripts/deploy.sh"
fi

echo -e "\n${COLOR_GREEN}🚀🚀🚀 Feature finalization complete! 🚀🚀🚀${COLOR_RESET}"