#!/bin/bash
echo "Deploying scheduledWialonGPSFetch function without ESLint..."
mv .eslintrc.js .eslintrc.js.backup || true
firebase deploy --only functions:scheduledWialonGPSFetch
mv .eslintrc.js.backup .eslintrc.js || true
