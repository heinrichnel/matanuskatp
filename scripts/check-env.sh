#!/bin/bash

# Check if we're running in Vercel's environment
if [ -n "$VERCEL" ] && [ "$VERCEL" = "1" ]; then
  echo "Running in Vercel environment"
else
  echo "Running in local or other environment"
fi

# Critical environment variables for our app
CRITICAL_VARS=(
  "VITE_WIALON_SESSION_TOKEN"
  "VITE_GOOGLE_MAPS_API_KEY"
  "VITE_FIREBASE_PROJECT_ID"
  "VITE_FIREBASE_API_KEY"
  "VITE_FIREBASE_AUTH_DOMAIN"
)

# Check for critical environment variables
echo "Checking critical environment variables:"
MISSING=0
for VAR in "${CRITICAL_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ $VAR is missing"
    MISSING=$((MISSING+1))
  else
    echo "✅ $VAR is set"
  fi
done

# Wialon specific checks
if [ -n "$VITE_WIALON_SESSION_TOKEN" ]; then
  echo "✅ Wialon token is configured"
else
  echo "❌ Wialon token is not set - integration will not work!"
fi

# Summary
echo ""
if [ $MISSING -gt 0 ]; then
  echo "⚠️ $MISSING critical environment variables are missing"
  echo "Make sure to set them in your Vercel project settings."
  echo "https://vercel.com/docs/projects/environment-variables"
  exit 1
else
  echo "✅ All critical environment variables are set"
  exit 0
fi
