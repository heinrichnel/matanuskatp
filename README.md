# Fleet Management System

A comprehensive fleet management system built with React, TypeScript, and Firebase.

## Features

- Trip Management
- Driver Behavior Monitoring
- Vehicle Maintenance
- Fuel Consumption Tracking
- Client Management
- Workshop Management
- Tyre Management
- Reporting & Analytics

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Firebase (Firestore, Functions, Storage)
- **Hosting**: Netlify (Frontend), Firebase (Backend)

## Prerequisites

- Node.js 16+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore, Functions, and Storage enabled

## Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/fleet-management.git
   cd fleet-management
   ```

2. Install dependencies
   ```bash
   npm install
   cd functions
   npm install
   cd ..
   ```

3. Set up environment variables
   Create a `.env` file in the project root with your Firebase configuration:
   ```
   VITE_FIREBASE_API=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Run the application locally
   ```bash
   npm run dev
   ```

## Deployment

### Frontend Deployment (Netlify)

1. Ensure you have the correct `netlify.toml` configuration in the root directory:

```toml
[build]
  base = "/"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.x"

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 5173
```

2. Deploy to Netlify:

```bash
npx netlify-cli deploy --prod
```

### Common Deployment Issues

- **Incorrect build command**: Make sure the build command is set to `npm run build` and not `remix vite:build` or similar.
- **Multiple `netlify.toml` files**: Check there are no conflicting Netlify configuration files in subdirectories like `/functions/.netlify/netlify.toml`.
- **Wrong base directory**: Ensure the base directory is set to the root (`/`) where your `package.json` is located.

### Backend Deployment (Firebase)

1. Build the Firebase functions:

```bash
cd functions
npm run build
```

2. Deploy to Firebase:

```bash
firebase deploy --only functions,firestore,storage,database
```

## CI/CD

This project is set up with GitHub Actions for continuous integration and deployment. When you push to the `main` branch, it will automatically:

1. Build the frontend
2. Deploy to Netlify
3. Deploy Firebase Functions, Firestore rules, and Storage rules

Make sure to set up the following secrets in your GitHub repository:
- NETLIFY_AUTH_TOKEN
- NETLIFY_SITE_ID
- FIREBASE_TOKEN
- VITE_FIREBASE_API
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_DATABASE_URL
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

## Local Development with Firebase Emulators

For local development, you can use Firebase emulators:

1. Start the emulators:
   ```bash
   firebase emulators:start --only firestore,functions,storage
   ```

2. Run the frontend with emulator configuration:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License.
