# Environment Setup Guide

This document provides instructions for setting up the environment variables required by APppp.

## Required Environment Variables

APppp requires several environment variables to function properly. These are used for connecting to external services like Google Maps, Firebase, and other integrations.

### Core Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key for map functionality | Yes |
| `VITE_GOOGLE_MAPS_IFRAME_URL` | URL template for Google Maps iframe embedding | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase application ID | Yes |

### Optional Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ENV_MODE` | Environment mode (development, staging, production) | No (defaults to development) |
| `VITE_WIALON_LOGIN_URL` | URL for Wialon integration | No |
| `VITE_SAGE_API_KEY` | API key for Sage integration | No |
| `VITE_SAGE_CLIENT_ID` | Client ID for Sage integration | No |
| `VITE_SAGE_CLIENT_SECRET` | Client secret for Sage integration | No |
| `PORT` | Port for Express server (when running server.js) | No (defaults to 3000) |

## Setup Instructions

1. Create a `.env` file in the root directory of the project
2. Copy the variables from `.env.example`
3. Fill in the values for each variable
4. Restart the development server

### Example `.env` file

```
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
VITE_GOOGLE_MAPS_IFRAME_URL=https://www.google.com/maps/embed/v1/place?key=${VITE_GOOGLE_MAPS_API_KEY}&q=Space+Needle,Seattle+WA

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Environment Mode
VITE_ENV_MODE=development
```

## Obtaining API Keys

### Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API, Maps Embed API, and any other Maps APIs you need
4. Create an API key from the Credentials page
5. Restrict the API key to your domains for security

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a web app to your Firebase project
3. Copy the Firebase config from the Firebase console
4. Fill in the corresponding values in your `.env` file

## Environment Setup Validation

The application includes utilities to validate your environment setup:

- In development mode, the `EnvironmentSetupStatus` component will display any issues with your environment variables
- Check the browser console for detailed environment validation messages
- The `checkEnvVariables()` utility can be used in components to verify environment variables

## Environment-Specific Settings

For different environments (development, staging, production), you can create:

- `.env.development` - For development settings
- `.env.production` - For production settings
- `.env.staging` - For staging settings

## Security Notes

- Never commit `.env` files to your repository
- `.env.example` is committed as a template without real values
- For deployment, set environment variables in your hosting platform (e.g., Netlify, Vercel, etc.)
- Consider using environment variable encryption for production deployments


VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_MOBILESERVICE_APP_ID=YOUR_MOBILE_APP_ID
VITE_MOBILESERVICE_PACKAGE_NAME=your.package.name
VITE_MOBILESERVICE_API_KEY=YOUR_MOBILE_SERVICE_API_KEY

# Google Cloud Run container URLs
VITE_CONTAINER_IMAGE=africa-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:5c17a017781479f9a428e897b914a637ea1a2e92ece21c8d834600d00bb1bbe6
VITE_CLOUD_RUN_URL=https://maps-250085264089.africa-south1.run.app
VITE_CLOUD_RUN_URL_ALTERNATIVE=https://maps-3ongv2xd5a-bq.a.run.app

# --------------------------------------
# WAILON FUNCTION
# --------------------------------------
VITE_WIALON_SESSION_TOKEN=YOUR_WIALON_SESSION_TOKEN_HERE
VITE_WIALON_API_URL=https://hst-api.wialon.com
VITE_WIALON_LOGIN_URL=https://hosting.wialon.com/?token=YOUR_WIALON_TOKEN_HERE&lang=en
# --------------------------------------
# GOOGLE MAPS CONFIGURATION
# --------------------------------------
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
VITE_MAPS_SERVICE_URL=https://your-maps-service-url.run.app
VITE_MAPS_DOCKER_SERVICE_URL=https://your-maps-service-url.run.app
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
VITE__GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY_HERE

# Firebase Service Account Configuration
# IMPORTANT: Replace with your own Firebase service account credentials
VITE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

VITE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="YOUR_PRIVATE_KEY_ID"
VITE_CLIENT_EMAIL="your-service-account@your-project-id.iam.gserviceaccount.com"
VITE_CLIENT_ID="YOUR_CLIENT_ID"
VITE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
VITE_TOKEN_URI="https://oauth2.googleapis.com/token"
VITE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
VITE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mat1-9e6b3.iam.gserviceaccount.com"
VITE_UNIVERSE_DOMAIN="googleapis.com"


VITE_MAP_ID=YOUR_MAP_ID
VITE_MAPS_SERVICE_URL="https://your-maps-service.run.app"
# REMOVED: API keys and database secrets
// REMOVED: Sensitive API credentials and OAuth secrets
// NOTE: If you need to set up OAuth credentials, please create your own in the Google Cloud Console.
// Do not commit real credentials to the repository.

// Example OAuth credentials structure (with placeholder values):
{
  "web": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["https://your-app-domain.com"],
    "javascript_origins": ["https://your-app-domain.com"]
  }
}
# ============================================
# ENVIRONMENT
# ============================================
VITE_ENV_MODE=development

# ============================================
# GOOGLE OAUTH CONFIGURATION
# ============================================
VITE_GOOGLE_OAUTH_CLIENT_ID=250085264089-tsqf0br8rq5qt7c24ntj1ohmb4ehhffo.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_CLIENT_SECRET=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
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://matanuskatransportt.netlify.app
VITE_GOOGLE_OAUTH_AUTH_URI=https://accounts.google.com/o/oauth2/auth
VITE_GOOGLE_OAUTH_TOKEN_URI=https://oauth2.googleapis.com/token
VITE_GOOGLE_OAUTH_CERT_URL=https://www.googleapis.com/oauth2/v1/certs

# ============================================
# FIREBASE CONFIGURATION (Frontend/Browser)
# ============================================
VITE_FIREBASE_API_KEY=AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g
VITE_FIREBASE_AUTH_DOMAIN=mat1-9e6b3.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mat1-9e6b3-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mat1-9e6b3
VITE_FIREBASE_STORAGE_BUCKET=mat1-9e6b3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=250085264089
VITE_FIREBASE_APP_ID=1:250085264089:web:51c2b209e0265e7d04ccc8
VITE_FIREBASE_MEASUREMENT_ID=G-YHQHSJN5CQ

# ============================================
# FIREBASE MOBILE SERVICE CONFIG (if applicable)
# ============================================
VITE_MOBILESERVICE_APP_ID=1:250085264089:android:eddb5bd08de0b1b604ccc8
VITE_MOBILESERVICE_PACKAGE_NAME=matmobile.com
VITE_MOBILESERVICE_API_KEY=AIzaSyDNk9iW1PTGM9hvcjJ0utBABs7ZiWCj3Xc

# ============================================
# FIREBASE SERVICE ACCOUNT (Backend/Server Only)
# NEVER expose these in a public repo or Vite frontend.
# Use these **only** in secure Node.js server scripts.
# ============================================
SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n2c1d3949...YOUR-KEY...\n-----END PRIVATE KEY-----\n"
SERVICE_ACCOUNT_PRIVATE_KEY_ID=036a90e4691c595a348aabbe6515d8291acd6574
SERVICE_ACCOUNT_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mat1-9e6b3.iam.gserviceaccount.com
SERVICE_ACCOUNT_CLIENT_ID=101330162184304566760
SERVICE_ACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
SERVICE_ACCOUNT_TOKEN_URI=https://oauth2.googleapis.com/token
SERVICE_ACCOUNT_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
SERVICE_ACCOUNT_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mat1-9e6b3.iam.gserviceaccount.com

# ============================================
# GOOGLE MAPS CONFIGURATION
# ============================================
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
VITE_GOOGLE_MAPS_IFRAME_URL=https://www.google.com/maps/embed/v1/place?key=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg

# ============================================
# WIALON GPS/TELEMATICS INTEGRATION
# ============================================
VITE_WIALON_SESSION_TOKEN=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053
VITE_WIALON_API_URL=https://hst-api.wialon.com
VITE_WIALON_LOGIN_URL=https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en

# ============================================
# ADDITIONAL CLOUD / SAGE / OTHER INTEGRATIONS
# ============================================
# VITE_SAGE_API_KEY=
# VITE_SAGE_CLIENT_ID=
# VITE_SAGE_CLIENT_SECRET=
# VITE_CONTAINER_IMAGE=
# VITE_CLOUD_RUN_URL=
# VITE_CLOUD_RUN_URL_ALTERNATIVE=

# ============================================
# NODE/EXPRESS SERVER PORT (if needed)
# ============================================
PORT=3000

# ============================================
# SECURITY & DEPLOYMENT WARNINGS
# ============================================
# - Never commit real secrets to version control
# - .env should always be in .gitignore
# - Only commit .env.example with placeholder values

