#!/bin/bash

# Migrate from Netlify to Vercel
echo "🚀 Starting migration from Netlify to Vercel..."

# 1. Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

# 2. Remove Netlify specific files
echo "🗑️ Removing Netlify specific configurations..."
if [ -f ".netlify/state.json" ]; then
  rm .netlify/state.json
  echo "  - Removed .netlify/state.json"
fi

# 3. Update package.json scripts
echo "📝 Updating package.json scripts..."
npx json -I -f package.json -e '
  if (this.scripts.deploy) {
    this.scripts.deploy = "vercel --prod"
  } else {
    this.scripts.deploy = "vercel --prod" 
  }
  if (!this.scripts["vercel-deploy"]) {
    this.scripts["vercel-deploy"] = "vercel --prod"
  }
  if (!this.scripts["vercel-dev"]) {
    this.scripts["vercel-dev"] = "vercel dev"
  }
'

# 4. Check environment variables
echo "🔍 Checking for environment variables..."
if [ -f ".env.local" ]; then
  echo "  - Found .env.local file"
else
  echo "⚠️  Warning: No .env.local file found. Make sure to set up environment variables in Vercel."
fi

# 5. Login to Vercel (if not already logged in)
echo "🔑 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
  echo "  - Please login to Vercel:"
  vercel login
else
  echo "  - Already logged in to Vercel"
fi

# 6. Link to Vercel project
echo "🔗 Linking to Vercel project..."
if [ ! -f ".vercel/project.json" ]; then
  vercel link
else
  echo "  - Already linked to Vercel project"
fi

echo ""
echo "✅ Migration preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your changes to GitHub"
echo "2. Connect your repository in the Vercel dashboard"
echo "3. Configure environment variables in the Vercel dashboard"
echo "4. Deploy your project with 'npm run deploy' or through the Vercel dashboard"
echo ""
echo "For more information, visit: https://vercel.com/docs/concepts/deployments/git"
