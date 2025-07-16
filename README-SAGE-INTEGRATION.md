# Sage Integration Setup

This document provides instructions for setting up the Sage integration with your TransportMat system.

## Required API Credentials

You need the following credentials from your Sage account:

1. **Sage API Key**: This is your unique identifier for API access
2. **Sage API Endpoint URL**: The base URL for all API requests
3. **Sage Company ID**: Your company identifier in Sage

## Where to Get These Credentials

1. Log in to your Sage Business Cloud account
2. Navigate to Settings → API Access
3. Create an API integration if you don't already have one
4. Copy the API key, endpoint URL, and company ID

## Configuration Steps

1. Add your Sage credentials to your `.env` file:
   ```
   VITE_SAGE_API_KEY=your_api_key_here
   VITE_SAGE_API_ENDPOINT=your_endpoint_url_here
   VITE_SAGE_COMPANY_ID=your_company_id_here
   VITE_SAGE_ENVIRONMENT=production  # or 'sandbox' for testing
   ```

2. Restart your application to load the new environment variables

## Data Mapping Information

The Sage integration maps data between your system and Sage in the following ways:

### Purchase Orders

| TransportMat Field | Sage Field |
|-------------------|------------|
| poNumber | number |
| vendor | supplier_name |
| orderDate | order_date |
| expectedDelivery | expected_delivery_date |
| status | status |
| totalAmount | total_amount |
| paymentStatus | payment_status |
| items | items |

### Inventory Items

| TransportMat Field | Sage Field |
|-------------------|------------|
| code | code |
| name | description |
| quantity | stock_on_hand |
| unitPrice | unit_price |
| category | category_name |
| reorderLevel | reorder_level |

### Vendors

| TransportMat Field | Sage Field |
|-------------------|------------|
| name | name |
| contactPerson | contact_name |
| email | email |
| mobile | phone |
| address | address.line1 |
| city | address.city |

## Integration Features

The integration provides the following capabilities:

1. **Bidirectional Sync**:
   - Import vendors, inventory, and purchase orders from Sage
   - Export purchase orders and inventory updates to Sage

2. **Manual or Automated Sync Options**:
   - On-demand synchronization from the UI
   - Background sync capabilities (configurable intervals)

3. **Error Handling and Logging**:
   - All sync errors are logged and displayed
   - Retry mechanisms for failed operations

## Integration Pages

1. **Sage Integration** (`/integration/sage`):
   - Main dashboard for Sage connection status
   - Configure sync settings
   - View sync history and logs

2. **Purchase Order Sync** (`/integration/purchase-orders`):
   - Sync purchase orders between systems
   - View sync status for each PO
   - Manually push or pull PO data

3. **Inventory Sync** (`/integration/inventory`):
   - Sync inventory items between systems
   - Update quantities and other attributes
   - View sync status for each item

## Troubleshooting

If you encounter issues with the Sage integration:

1. Check your API credentials in the `.env` file
2. Verify network connectivity to Sage servers
3. Check the console logs for detailed error messages
4. Review the integration logs in the admin interface

## Support

For help with Sage integration issues:
- Contact your Sage account representative
- Email support@transportmat.com with details of your issue
- Check the Sage API documentation for error code explanations



API Integration Layer (src/api/sageIntegration.ts):

Functions to sync purchase orders, import vendors, import inventory items, and update inventory in Sage
Error handling for all API operations
Data Mapping Utilities (src/utils/sageDataMapping.ts):

Mapping functions to convert between your app's data format and Sage's format
Type definitions for Sage API responses
Authentication Configuration (src/config/sageAuth.ts):

Configuration for Sage API authentication using environment variables
Support for both API key and OAuth authentication methods
Integration Pages:

Main integration dashboard (SageIntegration.tsx)
Purchase order sync page (PurchaseOrderSync.tsx)
Inventory sync page (InventorySageSync.tsx)
Setup Documentation (README-SAGE-INTEGRATION.md):

Detailed instructions for obtaining and configuring Sage API credentials
Data mapping reference for understanding how your data maps to Sage
Troubleshooting guide
The integration requires the following environment variables that you'll need to add to your .env file:


VITE_SAGE_API_KEY=your_api_key_here
VITE_SAGE_API_ENDPOINT=your_endpoint_url_here
VITE_SAGE_COMPANY_ID=your_company_id_here
VITE_SAGE_ENVIRONMENT=production  # or 'sandbox' for testing
To obtain these credentials, you'll need to:

Log in to your Sage Business Cloud account
Navigate to Settings → API Access
Create an API integration if you don't have one
Copy your API key, endpoint URL, and company ID
I've also installed all the necessary dependencies for the integration to work properly.

The app is now running and you can access the integration pages at:

/integration/sage - Main integration dashboard
/integration/purchase-orders - Purchase order sync
/integration/inventory - Inventory sync