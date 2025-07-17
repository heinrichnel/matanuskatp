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
