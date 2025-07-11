#!/bin/bash

# Script to update and synchronize routes with sidebar configuration

echo "==============================================="
echo "Matanuska Transport Platform - Route Sync Tool"
echo "==============================================="

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# Make scripts executable
chmod +x scripts/*.js

echo -e "\n[1/5] Validating components based on sidebar configuration..."
npx ts-node scripts/validateComponents.ts

echo -e "\n[2/5] Generating routes from sidebar configuration..."
npx ts-node scripts/generateRoutes.ts

echo -e "\n[3/5] Updating AppRoutes file..."
if [ ! -f src/AppRoutes.tsx ]; then
  echo "AppRoutes.tsx not found. Copying to App.tsx for reference."
  cat > src/AppRoutes.tsx.reference << EOF
// Reference file generated from sidebarConfig.ts
// You can use this as a reference to update your App.tsx file
$(cat src/AppRoutes.tsx)
EOF
  echo "Created src/AppRoutes.tsx.reference"
else
  echo "Updated src/AppRoutes.tsx"
fi

echo -e "\n[4/5] Updating documentation..."
cat > ROUTING_STATUS.md << EOF
# Routing Status Report

## Last Updated
$(date)

## Sidebar Configuration
- Total menu items: $(grep -c "id:" src/config/sidebarConfig.ts)
- Total routes: $(grep -c "path:" src/config/sidebarConfig.ts)

## Component Status
$(cat COMPONENT_VALIDATION.md | sed -n '/^## Summary/,$p')

## Next Steps
1. Run tests to validate route functionality
2. Update any missing components
3. Ensure all pages have proper titles and metadata
EOF

echo "Created ROUTING_STATUS.md"

echo -e "\n[5/5] Running validation on routes..."
echo "Checking for route path duplicates..."
grep "path:" src/config/sidebarConfig.ts | sort | uniq -c | sort -nr | while read count path; do
  if [ "$count" -gt 1 ]; then
    echo "WARNING: Duplicate route path found: $path ($count occurrences)"
  fi
done

echo -e "\nChecking for component path duplicates..."
grep "component:" src/config/sidebarConfig.ts | sort | uniq -c | sort -nr | while read count component; do
  if [ "$count" -gt 1 ]; then
    echo "WARNING: Duplicate component path found: $component ($count occurrences)"
  fi
done

echo -e "\n==============================================="
echo "Route synchronization complete!"
echo "Review ROUTING_STATUS.md for current status"
echo "==============================================="
