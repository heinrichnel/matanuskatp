#!/bin/bash

# Exit on any error
set -e

echo "🔄 Building application..."
npm run build

echo "🔄 Deploying to Firebase..."
npx firebase deploy

echo "✅ Deployment complete! Your Google Maps integration is now live."
echo "🌎 Visit your deployed application to see the Maps feature in action."