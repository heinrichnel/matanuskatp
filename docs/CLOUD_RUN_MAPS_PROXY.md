# Cloud Run Maps Proxy Service

This document provides technical details about the Google Maps proxy service running on Cloud Run, which serves as a secure intermediary between the Matanuska Transport Platform and the Google Maps API.

## Table of Contents

1. [Overview](#overview)
2. [Service Details](#service-details)
3. [Architecture](#architecture)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Security](#security)
9. [Maintenance](#maintenance)

## Overview

The Maps Proxy Service is a Cloud Run service that proxies requests to the Google Maps API. This provides several benefits:

- **API Key Security**: Keeps your Google Maps API key secure by storing it on the server
- **Usage Monitoring**: Centralized monitoring of API usage and costs
- **Request Filtering**: Validates requests before forwarding to Google
- **Caching**: Implements caching to reduce API calls and costs
- **Rate Limiting**: Prevents excessive API usage

## Service Details

| Property | Value |
|----------|-------|
| Service Name | maps |
| Region | africa-south1 |
| URL | https://maps-250085264089.africa-south1.run.app |
| Alternative URL | https://maps-3ongv2xd5a-bq.a.run.app |
| Build ID | 80b4b7b0-51a7-4f68-90cd-3a95bfd5aa89 |
| Container Image | africa-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:5c17a017781479f9a428e897b914a637ea1a2e92ece21c8d834600d00bb1bbe6 |
| Source Location | gs://run-sources-mat1-9e6b3-africa-south1/services/maps/1752488742.699906-d04300141e8c46748c4ee71dfaecec5f.zip#1752488745524279 |
| Service Account | firebase-adminsdk-fbsvc@mat1-9e6b3.iam.gserviceaccount.com |
| Health Check | TCP on port 8080 every 240s |
| Cloud SQL Connection | mat1-9e6b3:us-central1:mat1-9e6b3-instance |

## Architecture

The Maps Proxy Service acts as a middleware between your frontend application and the Google Maps API:

```
┌─────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                 │      │                   │      │                   │
│  Frontend App   │─────▶│  Maps Proxy       │─────▶│  Google Maps API  │
│                 │      │  (Cloud Run)      │      │                   │
└─────────────────┘      └───────────────────┘      └───────────────────┘
```

The service handles the following API endpoints:

- `/maps/api/js` - Google Maps JavaScript API
- `/maps/api/place` - Places API
- `/maps/api/geocode` - Geocoding API
- `/maps/api/directions` - Directions API
- `/maps/api/distancematrix` - Distance Matrix API
- `/health` - Health check endpoint

## Configuration

### Environment Variables

The Cloud Run service is configured with the following environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g
VITE_FIREBASE_AUTH_DOMAIN=mat1-9e6b3.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://mat1-9e6b3-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=mat1-9e6b3
VITE_FIREBASE_STORAGE_BUCKET=mat1-9e6b3.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=250085264089
VITE_FIREBASE_APP_ID=1:250085264089:web:51c2b209e0265e7d04ccc8
VITE_FIREBASE_MEASUREMENT_ID=G-YHQHSJN5CQ
VITE_WIALON_SESSION_TOKEN=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053
VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
VITE_ENV_MODE=production
VITE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
```

### Frontend Configuration

To use the Maps Proxy Service in the frontend application, set the following environment variable:

```
VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
```

When this variable is set, the application will route Google Maps API requests through the proxy instead of making direct API calls.

### Fallback Mechanism

If the proxy service is unavailable, the application can fall back to direct Google Maps API calls using the API key configured in:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
```

This fallback is implemented in `src/utils/googleMapsLoader.ts`.

## Deployment

The service is deployed using Google Cloud Build and Cloud Run.

### Build Process

1. Source code is uploaded to Cloud Storage
2. Cloud Build builds a Docker container
3. Container is pushed to Artifact Registry
4. Cloud Run deploys the container

### Latest Deployment

The latest deployment was built on July 14, 2025:

```
Build ID: 80b4b7b0-51a7-4f68-90cd-3a95bfd5aa89
Builder: Cloud Build
Provenance: SLSA v0.1
Status: Completed
Date: 14 Jul 2025
```

### Container Image

```
africa-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:5c17a017781479f9a428e897b914a637ea1a2e92ece21c8d834600d00bb1bbe6
```

## Monitoring

### Health Checks

The service implements a health check endpoint at `/health` that returns a 200 OK response when the service is healthy. Cloud Run performs a TCP health check on port 8080 every 240 seconds.

### Logs

Logs can be viewed in the Google Cloud Console:

1. Go to Cloud Run in the Google Cloud Console
2. Select the `maps` service
3. Click on the "Logs" tab

### Metrics

The following metrics should be monitored:

- **Request count**: Number of requests to the service
- **Error rate**: Percentage of requests that result in errors
- **Latency**: Time taken to process requests
- **Instance count**: Number of instances running
- **CPU and memory usage**: Resource utilization

## Troubleshooting

### Common Issues

#### "Maps service proxy is unavailable" Warning

This warning appears in the frontend application when:

1. The Cloud Run proxy service is not reachable
2. The `VITE_MAPS_SERVICE_URL` environment variable is empty

**Solution**:
- Check if the Cloud Run service is running
- Verify the service URL is correct
- Check Cloud Run logs for errors
- Ensure the service account has necessary permissions

#### Service Unavailable (503) Errors

If the service returns 503 errors:

1. Check if the service is being overloaded
2. Verify that the instance count is sufficient
3. Check if the service is hitting resource limits

#### API Key Issues

If the service returns errors related to the API key:

1. Verify the API key is valid
2. Check if the API key has the necessary APIs enabled
3. Ensure the API key has sufficient quota

## Security

### API Key Protection

The Maps API key is stored securely as an environment variable in Cloud Run and is never exposed to clients.

### Access Control

The service is configured with the following access controls:

- **Ingress**: All (allows requests from any source)
- **Authentication**: Disabled (no authentication required)

For production environments, consider implementing:

1. **IAM Authentication**: Require authentication for service access
2. **VPC Service Controls**: Restrict access to the service from specific networks
3. **Ingress Controls**: Limit access to specific IP ranges or services

### Request Validation

The service validates incoming requests to prevent abuse:

1. **Origin Checking**: Verifies requests come from allowed origins
2. **Rate Limiting**: Limits the number of requests from a single client
3. **Parameter Validation**: Validates request parameters before forwarding

## Maintenance

### Regular Tasks

1. **API Key Rotation**: Rotate the Google Maps API key periodically
2. **Dependency Updates**: Keep dependencies updated to patch security vulnerabilities
3. **Performance Monitoring**: Review performance metrics and optimize as needed
4. **Cost Analysis**: Monitor API usage and costs

### Scaling Considerations

The service is configured to scale automatically based on load. Consider the following:

1. **Minimum Instances**: Set minimum instances to ensure availability
2. **Maximum Instances**: Set maximum instances to control costs
3. **CPU Allocation**: Adjust CPU allocation based on performance requirements
4. **Memory Allocation**: Adjust memory allocation based on caching needs

### Backup and Recovery

1. **Container Image**: The container image is stored in Artifact Registry
2. **Source Code**: The source code is stored in Cloud Storage
3. **Configuration**: The service configuration is stored in Cloud Run

---

*This documentation was last updated on August 1, 2025*
