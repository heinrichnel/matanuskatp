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


VITE_FIREBASE_API_KEY=AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g
VITE_FIREBASE_AUTH_DOMAIN=mat1-9e6b3.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mat1-9e6b3-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mat1-9e6b3
VITE_FIREBASE_STORAGE_BUCKET=mat1-9e6b3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=250085264089
VITE_FIREBASE_APP_ID=1:250085264089:web:51c2b209e0265e7d04ccc8
VITE_FIREBASE_MEASUREMENT_ID=G-YHQHSJN5CQ
VITE_MOBILESERVICE_APP_ID=1:250085264089:android:eddb5bd08de0b1b604ccc8
VITE_MOBILESERVICE_PACKAGE_NAME=matmobile.com
VITE_MOBILESERVICE_API_KEY=AIzaSyDNk9iW1PTGM9hvcjJ0utBABs7ZiWCj3Xc

# Google Cloud Run container URLs
VITE_CONTAINER_IMAGE=africa-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:5c17a017781479f9a428e897b914a637ea1a2e92ece21c8d834600d00bb1bbe6
VITE_CLOUD_RUN_URL=https://maps-250085264089.africa-south1.run.app
VITE_CLOUD_RUN_URL_ALTERNATIVE=https://maps-3ongv2xd5a-bq.a.run.app

# --------------------------------------
# WAILON FUNCTION
# --------------------------------------
VITE_WIALON_SESSION_TOKEN=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053
VITE_WIALON_API_URL=https://hst-api.wialon.com
VITE_WIALON_LOGIN_URL=https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en
# --------------------------------------
# GOOGLE MAPS CONFIGURATION
# --------------------------------------
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app//=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
VITE_MAPS_DOCKER_SERVICE_URL=https://maps-250085264089.africa-south1.run.appafrica-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:994cecbac15d657e4e1401132b32970bafaa64d6b923294f629636543b551a2c
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
VITE__GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed/v1/place?key=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg

# Firebase Service Account Configuration
VITE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSftyXJgpaQ0Ji\nZ/k1xTjKhcTwgOxmnCpIPx3rST/zlwCdf3Gf8Gdzkf68C5rYg7fhg8IwicrmU4+q\n5DNwqIvwybaQbUV+IX+oCq44fYluLurDq5+ZLm7PxjYEyLBF+kVn5rbmjeI+1tWH\nkAqpMpAdX7+CgJr3Ue85c47Vi5k1OBEeHLRNqiv0Ms0EeEJ5FaZxl1SyUjl6LlBL\nS/nx8C5mR9fta0LiQCmfgYNFLUNlC8uS/vaGHdvMJPl45PzBItH+o5zOAaL5Swl0\ns0h1LAd+CBBhzA4IeQURhuaeWsiH8oW6R56bjx0C5onyoTzqzCFDOz2xRW7Zb8N9\nH2s4xcg5AgMBAAECggEACxaFyv1uuWn/lWvt94FJ1P9Wuobhjbsqcp0vXiqFSAJB\nAkq9/odvRxaw54n/0n02vt+OhEa7qB8BP+OllpR1Qhh8ZFZW9Q7jRwRm7yDmVOQB\nciW0bt9ONRT5K/fGKsfAdtamN5Fb41p2nzv6aJfKg2SmvcGO6SMHFqu9zwExy46p\nU4QiE2o+4rdnFRKaIrsuzPxwYzLrKByB0mWj/y9kY07S2J/9ftV283hPq3hTD2H4\n78dpeaNXODM/6HHrIUUiGLM1jQSLS4jakbonNq42BaZ5e31KbWrir3MuQvoStBGY\nU62aoJqDHrbvLjO5YrAhvoQRMPxbBvwzWNumLLxqgQKBgQDNvHRzQKIYAYyH6N+V\nN9TjBDVK7d5RkIPM7M3W0dmrjQSMyxUWRQiyNvRVN95TThxU3sr4k6wgYQsV7iFH\nU5WBGo/jf6L3VpUo9VzCjEHbXBvSCcvucDe4aE6qFrLO8/stCjeKqQVel71B6oqP\n2n+sVhNSAEeyFcB0ueG7MeLYgQKBgQC2SUSD1JmRSelxaLDTUzw1Dhz/j6DH64qV\nYra0xmJir5p96eDcXWDeMpMEdBnS/aOMul2C3rGoPlae32ffgV6DdP4ECYMVdK4x\n2tXxO52X8cWU3+LDHrm8lWiigEwo3s2el0f5W6ozZ41h6A6ldLP85uvFyCX1nrOe\nhXcWiOXTuQKBgQCTJgk8LaxB80mqI5tWxLoVLPtY/k0WlYBPX8fRsAI5uwDYGqCY\nbwPLQ5b6JJ11g9artTYDGMvx1LbzFoDi3Rt/XZowoyfSNDE3PFb+Jwcrd/PGBI/B\nmK2hzakF6no1nze1fStAl6dpgqowrSoxvZu3jVEAQ4cEDp66XgDfvMx9AQKBgQCb\nzeQSChV4aYRuutzow6wibP28MjdqqZi6NrWTrj1JvG6AUPcxY174jKG8nL+157Vz\nA5gJ0+5lr2K6SJmwIBN4qPa03Kx+Gk0Jr9JNbnc0+CG5LePUgt6eodXdj2uJQ2bc\nttF+ASto5ImjtYVPRoDRGU9MrdZEKnG8fLddO4W1gQKBgG6ITERMZjBrgo7AHkHm\nKOL99I2/+g5+9S/Ss+qD7ivIKFMbBmzFk4tnW//XB0+ATLmLSkpxcLBEVD9l/Flq\n3iP7whqO3LrxuEN7C5C/KmQZjbgeg5ylzMaqxG6BbDdnjGDWSFWgWzkO7FFFVEmc\nxeMDJh9JowhnRh/6MBOIuBfT\n-----END PRIVATE KEY-----\n"


VITE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="036a90e4691c595a348aabbe6515d8291acd6574"
VITE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@mat1-9e6b3.iam.gserviceaccount.com"
VITE_CLIENT_ID="101330162184304566760"
VITE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
VITE_TOKEN_URI="https://oauth2.googleapis.com/token"
VITE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
VITE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mat1-9e6b3.iam.gserviceaccount.com"
VITE_UNIVERSE_DOMAIN="googleapis.com"


VITE_MAP_ID=d35f5614ad4e1438af0aca58
VITE_MAPS_SERVICE_URL="https://maps-250085264089.africa-south1.run.app"
AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
Database secretsmat1-9e6b3-default-rtdb	0MpRyYXn67xayFt4C8uNcXMII2IJWlXISzbwDQ3C
j7p2x0nwjjkuVOSn1xN7nkF3gt_OaZKxuNxRJ7j2w74
https://www.google.com/search?q=250085264089-compute%40developer.gserviceaccount.com&rlz=1C1ONGR_enZA1072ZA1072&oq=250085264089-compute%40developer.gserviceaccount.com&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDrSAQgxODcyajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8
Firebase Cloud Messaging API (V1)
