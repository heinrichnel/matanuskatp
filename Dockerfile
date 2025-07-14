FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source files
COPY index.js ./
COPY dist ./dist

# Set environment variables from Cloud Run configuration
ENV VITE_FIREBASE_API_KEY="AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g"
ENV VITE_FIREBASE_AUTH_DOMAIN="mat1-9e6b3.firebaseapp.com"
ENV VITE_FIREBASE_DATABASE_URL="https://mat1-9e6b3-default-rtdb.firebaseio.com"
ENV VITE_FIREBASE_PROJECT_ID="mat1-9e6b3"
ENV VITE_FIREBASE_STORAGE_BUCKET="mat1-9e6b3.firebasestorage.app"
ENV VITE_FIREBASE_MESSAGING_SENDER_ID="250085264089"
ENV VITE_FIREBASE_APP_ID="1:250085264089:web:51c2b209e0265e7d04ccc8"
ENV VITE_FIREBASE_MEASUREMENT_ID="G-YHQHSJN5CQ"
ENV VITE_WIALON_SESSION_TOKEN="c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053"
ENV VITE_WIALON_API_URL="https://hst-api.wialon.com"
ENV VITE_WIALON_LOGIN_URL="https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
ENV VITE_MAPS_API_KEY="AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg"
ENV VITE_GOOGLE_MAPS_API_KEY="AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg"
ENV VITE_MAPS_SERVICE_URL="https://maps-250085264089.africa-south1.run.app"
ENV VITE_CLOUD_RUN_URL="https://maps-250085264089.africa-south1.run.app"
ENV VITE_CLOUD_RUN_URL_ALTERNATIVE="https://maps-3ongv2xd5a-bq.a.run.app"
ENV VITE_GCP_CONSOLE_URL="https://console.cloud.google.com/active-assist/details/projects/250085264089/locations/africa-south1/recommenders/google.run.service.IdentityRecommender/recommendations/cd47b685-bcb9-4979-b908-4b56948bdef1;source=webSplitButton?project=250085264089"
ENV VITE_ENV_MODE="production"

# Expose the port the app will run on
EXPOSE 8080

CMD [ "node", "index.js" ]
