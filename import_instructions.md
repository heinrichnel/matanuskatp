# Firestore Data Import Instructions

This document provides instructions for configuring two instances of the `firestore-importer` Firebase Extension to import `driver_behaviors` and `trips` data into Firestore. It also includes a shell script to automate the file upload process.

## 1. Sample Data Files

The following CSV files have been generated and are ready for import:

- `driver_behaviors.csv`: Contains sample driver behavior events.
- `trips.csv`: Contains sample trip records.

## 2. Configuration Guidance

You will need to install the `firestore-importer` extension twice, once for each data type.

### Instance 1: Importing Driver Behaviors

Follow the Firebase console instructions to install the `firestore-importer` extension. When prompted for the parameters, use the following values:

- **Instance ID:** `import-driver-behaviors` (or another unique ID)
- **Cloud Storage bucket for imports:** Select your project's default Cloud Storage bucket.
- **Folder path for imports (`IMPORT_FOLDER`):** `imports/driver_behaviors`
- **Target Firestore collection path (`TARGET_COLLECTION`):** `driver_behaviors`
- **Import data format:** `csv`
- Other parameters can be left at their default values or configured as needed.

### Instance 2: Importing Trips

Install a second instance of the `firestore-importer` extension. Use the following values for the parameters:

- **Instance ID:** `import-trips` (or another unique ID)
- **Cloud Storage bucket for imports:** Select your project's default Cloud Storage bucket.
- **Folder path for imports (`IMPORT_FOLDER`):** `imports/trips`
- **Target Firestore collection path (`TARGET_COLLECTION`):** `trips`
- **Import data format:** `csv`
- Other parameters can be left at their default values or configured as needed.

## 3. Automation Script

This shell script uses `gcloud storage cp` to upload the local CSV files to their designated folders in your Cloud Storage bucket. This action will automatically trigger the respective Firebase Extension instances to begin the import process.

**Before running the script, replace `[YOUR_GCLOUD_PROJECT_ID]` with your actual Google Cloud project ID.** Your default storage bucket is typically named `[YOUR_GCLOUD_PROJECT_ID].appspot.com`.

```bash
#!/bin/bash

# =================================================================
# Firebase Data Import Automation Script
#
# This script uploads CSV data files to the correct Cloud Storage
# folders, triggering the firestore-importer extensions.
# =================================================================

# --- Configuration ---
GCLOUD_PROJECT_ID="[YOUR_GCLOUD_PROJECT_ID]"
BUCKET_NAME="${GCLOUD_PROJECT_ID}.appspot.com"

# --- File and Folder Definitions ---
# Source: a local CSV file
# Destination: the target folder in the Cloud Storage bucket
declare -A UPLOAD_CONFIG
UPLOAD_CONFIG=(
  ["driver_behaviors.csv"]="imports/driver_behaviors/"
  ["trips.csv"]="imports/trips/"
)

# --- Main Upload Logic ---
echo "Starting upload process..."

for FILE in "${!UPLOAD_CONFIG[@]}"; do
  DESTINATION_FOLDER=${UPLOAD_CONFIG[$FILE]}
  
  if [ ! -f "$FILE" ]; then
    echo "ERROR: Source file '$FILE' not found. Skipping."
    continue
  fi

  echo "Uploading '$FILE' to 'gs://${BUCKET_NAME}/${DESTINATION_FOLDER}'..."
  
  # Execute the upload command
  gcloud storage cp "$FILE" "gs://${BUCKET_NAME}/${DESTINATION_FOLDER}"
  
  if [ $? -eq 0 ]; then
    echo "SUCCESS: '$FILE' uploaded successfully."
  else
    echo "FAILURE: Failed to upload '$FILE'."
  fi
done

echo "Upload process completed."

```

### How to Run the Script

1.  **Save the script:** Save the code above as a shell script file (e.g., `upload_data.sh`).
2.  **Make it executable:** Open your terminal and run `chmod +x upload_data.sh`.
3.  **Run the script:** Execute the script from your terminal with `./upload_data.sh`.

Once the files are uploaded, you can monitor the Firebase console to see the two extension instances start their execution and populate the `driver_behaviors` and `trips` collections in Firestore.