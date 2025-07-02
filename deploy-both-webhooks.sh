#!/bin/bash
# Deployment script for both enhanced webhooks

# Set error handling
set -e

echo "🔄 Starting deployment of enhanced webhooks..."

# Navigate to functions directory
cd functions

# Make a backup of current implementation
echo "📦 Creating backup of current implementation..."
cp src/index.ts src/index.ts.backup.$(date +%Y%m%d%H%M%S)

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript code
echo "🔨 Building TypeScript code..."
npm run build

# Deploy both webhook functions
echo "🚀 Deploying both webhook functions..."
firebase deploy --only functions:importDriverBehaviorWebhook,functions:importTripsFromWebBook

echo "✅ Deployment complete!"
echo "📋 Verify deployment with: firebase functions:list"
echo ""
echo "🧪 Testing the webhooks:"
echo ""
echo "   1. Driver Behavior Webhook:"
echo "      cd .."
echo "      export NODE_ENV=development"
echo "      node improved-driver-behavior-webhook-test.js"
echo ""
echo "   2. WebBook Import Webhook:"
echo "      cd .."
echo "      export NODE_ENV=development"
echo "      node improved-webbook-import-test.js"
echo ""
echo "⚠️ Monitor logs for any issues:"
echo "   firebase functions:log"