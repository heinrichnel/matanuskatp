#!/bin/bash

# Script to ensure driver management components are properly implemented

# Function to check if file needs to be copied
check_and_copy() {
  local source="$1"
  local destination="$2"
  
  # Check if both files exist
  if [[ -f "$source" && -f "$destination" ]]; then
    local source_size=$(stat -c%s "$source")
    local dest_size=$(stat -c%s "$destination")
    
    # If the component file is significantly larger, copy it to the page
    if (( source_size > (dest_size + 100) )); then
      echo "Copying $source to $destination (source: $source_size bytes, destination: $dest_size bytes)"
      cp "$source" "$destination"
    else
      echo "No need to copy $source ($source_size bytes) to $destination ($dest_size bytes)"
    fi
  elif [[ -f "$source" && ! -f "$destination" ]]; then
    echo "Creating $destination from $source"
    cp "$source" "$destination"
  else
    echo "Source file $source doesn't exist"
  fi
}

# List of components to check
components=(
  "LicenseManagement"
  "TrainingRecords"
  "PerformanceAnalytics"
  "DriverScheduling" 
  "HoursOfService"
  "DriverRewards"
  "DriverViolations"
  "SafetyScores"
  "DriverFuelBehavior"
)

# Loop through each component and ensure it's properly implemented
for comp in "${components[@]}"; do
  source_file="./src/components/DriverManagement/${comp}.tsx"
  dest_file="./src/pages/drivers/${comp}.tsx"
  
  check_and_copy "$source_file" "$dest_file"
done

echo "Done!"
