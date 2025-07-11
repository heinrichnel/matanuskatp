# MATANUSKA TRANSPORT Dashboard

A comprehensive fleet management and transportation operations dashboard built with React, TypeScript, and Firebase, designed for MATANUSKA TRANSPORT.

## Features

- **Trip Management**: Track active and completed trips, optimize routes, and monitor delivery confirmations
- **Driver Behavior Monitoring**: Real-time driver behavior events tracking and safety analysis
- **Vehicle Maintenance**: Workshop management with job cards, inspections, and fault tracking
- **Diesel Management**: Fuel consumption tracking, theft detection, and carbon footprint analysis
- **Client Management**: Customer acquisition, retention metrics, and relationship visualization
- **Invoice Management**: Create, track, and manage customer invoices with approval workflows
- **Tyre Management**: Track tyre inventory, wear patterns, and performance analytics
- **Fleet Analytics**: KPI dashboards, predictive maintenance, and ROI reporting
- **Inventory & Purchasing**: Stock management, vendor scorecards, and indirect cost analysis

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Firebase (Firestore, Functions, Storage)
- **Hosting**: Netlify (Frontend), Firebase (Backend)
- **Maps Services**: Google Cloud Run microservice (Maps API proxy)

## System Architecture

### Maps Integration

The application uses a secure microservice architecture for maps integration:

- **Cloud Run Maps Service**: A dedicated service running on Google Cloud Run that proxies requests to Google Maps APIs
- **Service URL**: https://maps-250085264089.africa-south1.run.app (configurable via environment variables)
- **Security Benefits**: 
  - API keys are kept secure on the server side
  - Reduced risk of API key abuse/theft
  - Centralized usage tracking and quota management
  
The Maps components connect to this service instead of directly using the Google Maps JavaScript API with a client-side key.

#### Configuration

1. Set the Maps service URL in your `.env` file:
   ```
   VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
   VITE_MAPS_SERVICE_PORT=8081
   ```

2. The Maps components will automatically connect to this service for all maps-related functionality.

3. If you need to troubleshoot connection issues:
   - Check the browser console for connection errors
   - Verify the Cloud Run service is running and accessible
   - Test the service's health endpoint directly (e.g., https://maps-250085264089.africa-south1.run.app/health)

### Core Contexts

#### TripContext

The TripContext provides real-time synchronization with the trips collection in Firestore.

**Core Responsibilities:**
- Real-time syncing of trips via `onSnapshot()`
- Filtering logic:
  - `activeTrips`: Trips where status is not "completed"
  - `completedTrips`: Trips where status is "completed"
- Loading and error state management

**Usage:**
```tsx
const { trips, activeTrips, completedTrips, loading, error } = useTrips();
```

#### DriverBehaviorContext

The DriverBehaviorContext manages driver behavior events synchronization with Firestore.

**Core Responsibilities:**
- Real-time syncing of driverBehavior collection via `onSnapshot()`
- Filtering logic based on:
  - `fleetNumber`
  - `eventDate`
  - `eventType`
  - `severity`
- Loading and error state management

**Usage:**
```tsx
const { events, loading, error } = useDriverBehavior();
```

### Component Organization

The dashboard is organized into modular sections, each with its own set of components:

1. **Trip Management**
   - TripOverviewPanel
   - OptimizedRouteSuggestion
   - FleetUtilizationHeatmap
   - DeliveryConfirmationPanel
   - TripTemplateManager

2. **Diesel Management**
   - DieselDashboardComponent
   - FuelLogs
   - FuelCardManager
   - FuelEfficiencyReport
   - FuelTheftDetection
   - CarbonFootprintCalc
   - DriverFuelBehavior

3. **Customer Management**
   - CustomerDashboard
   - CustomerReports
   - RetentionMetrics
   - ClientNetworkMap

4. **Invoice Management**
   - InvoiceDashboard
   - InvoiceBuilder
   - InvoiceApprovalFlow
   - InvoiceTemplateStore
   - TaxReportExport

5. **Fleet Analytics**
   - AnalyticsDashboard
   - KPIOverview
   - PredictiveModels
   - ROIReportView
   - AdHocReportBuilder

6. **Workshop Management**
   - FaultTracker
   - WorkshopAnalytics
   - FleetVisualSetup

7. **Tyre Management**
   - TyreInventoryManager
   - TyrePerformanceReport

8. **Inventory & Purchasing**
   - InventoryDashboard
   - StockManager
   - PurchaseOrderTracker
   - VendorScorecard
   - IndirectCostBreakdown

### Integration Points

- **Webhooks**: External systems push data to Firestore via webhook endpoints
- **Real-time UI**: Components consume context data and automatically update when Firestore changes
- **Firestore Backend**: All data is stored and synchronized through Firebase Firestore
- **UI Feedback**: Sync indicators and error handling are implemented across all components

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
   Create a `.env` file in the project root with your Firebase and Maps configuration:
   ```
   VITE_FIREBASE_API=your-api-key
   VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
   VITE_MAPS_SERVICE_PORT=8081
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

## Dashboard Workflows

### Trip Management Workflow

1. **Create Trip**: Use TripTemplateManager or TripForm to create a new trip
2. **Plan Route**: Use the OptimizedRouteSuggestion to get optimal routing
3. **Monitor Active Trips**: Track trips in real-time through ActiveTrips
4. **Confirm Delivery**: Use DeliveryConfirmationPanel to confirm trip completion
5. **Analyze Performance**: View fleet utilization through FleetUtilizationHeatmap

### Driver Behavior Workflow

1. **Monitor Events**: View real-time driver behavior events through DriverBehaviorEvents
2. **Analyze Patterns**: Identify problem areas through Driver Performance Analytics
3. **Take Action**: Create action items and follow-up through ActionLog
4. **Track Improvement**: Monitor driver improvement over time with trend analysis

### Invoice Management Workflow

1. **Create Invoice**: Use InvoiceBuilder with trip data to generate invoices
2. **Approval Process**: Send through InvoiceApprovalFlow for multi-step approval
3. **Payment Tracking**: Track payment status and follow up on overdue invoices
4. **Reporting**: Generate tax reports and financial analytics with TaxReportExport

### Workshop Management Workflow

1. **Vehicle Inspection**: Schedule and perform vehicle inspections
2. **Issue Identification**: Track vehicle faults with FaultTracker
3. **Job Card Creation**: Create workshop job cards for maintenance
4. **Parts Management**: Order and track parts through inventory system
5. **Analytics**: Monitor workshop performance through WorkshopAnalytics

## Authentication & Authorization

The system uses Firebase Authentication with role-based access control:

- **Admin**: Full access to all dashboard features
- **Operations Manager**: Access to trip management and analytics
- **Fleet Manager**: Access to vehicle maintenance and driver management
- **Finance**: Access to invoicing and financial reporting
- **Workshop Manager**: Access to workshop components only
- **Driver**: Limited access to their own trips and performance data

## System Requirements

- **Browser**: Chrome 80+, Firefox 72+, Safari 13+, Edge 80+
- **Screen Resolution**: Minimum 1280x720, recommended 1920x1080
- **Internet Connection**: Minimum 2 Mbps for real-time data syncing
- **Devices**: Responsive design works on desktop, tablet, and mobile devices

## Future Enhancements

1. **Mobile App**: Native mobile application for drivers
2. **AI Integration**: Predictive analytics for maintenance and fuel consumption
3. **IoT Integration**: Direct integration with vehicle telematics systems
4. **Advanced Reporting**: Customizable report builder with export capabilities
5. **Client Portal**: External portal for customers to track their shipments

## Support & Documentation

For technical support and detailed documentation, please contact the system administrator or refer to the internal documentation portal.

## License

This project is licensed under the MIT License.
