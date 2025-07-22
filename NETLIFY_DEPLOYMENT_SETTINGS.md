# Netlify Deployment Settings for Matanuska Transport Platform

This document outlines the correct deployment settings for both the full application and the simplified test version of the Matanuska Transport Platform.

## Full Application Deployment

When deploying the complete Vite + React application, use the following settings:

### Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Environment Variables
The application requires several environment variables to be set in the Netlify UI:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_WIALON_SESSION_TOKEN`
- `VITE_WIALON_API_URL`
- `VITE_WIALON_LOGIN_URL`
- `VITE_MAPS_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_MAPS_SERVICE_URL`
- `VITE_CLOUD_RUN_URL`
- `VITE_CLOUD_RUN_URL_ALTERNATIVE`
- `VITE_GCP_CONSOLE_URL`
- `VITE_ENV_MODE` = "production"
- `VITE_USE_EMULATOR` = "false"

### Node.js Version
- Set Node.js version to `22.15.1` in the Netlify UI or via the netlify.toml file.

## Simplified Test Deployment

For the simplified test version (sidebar only with grey background):

### Build Settings
- **Build command:** (leave empty)
- **Publish directory:** `/`

### Deployment Method
1. Use the `deploy-simplified.sh` script to generate the deployment package
2. Upload the resulting ZIP file (`matanuska-simplified-deploy.zip`) via the Netlify UI

## Recent Updates

- Sidebar background color changed from white to grey (#f3f4f6 / gray-100)
- Added active trip functionality verification
- Fixed environment validation script path

## Troubleshooting Common Issues

### "validate-env.js not found" Error
This error occurs because the validation script was moved to a new location. The solution is to update the build command in netlify.toml to point to the correct script location:
```
command = "npm run build"
```

### Build Failures
If you encounter build failures:
1. Check that all required environment variables are set
2. Ensure the Node.js version is compatible (22.15.1 recommended)
3. Consider deploying the simplified test version first to verify basic functionality
