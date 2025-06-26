# Data Integration and Transformation Plan

This document outlines the analysis, conflicts, and step-by-step transformation plan for integrating the `Trips` and `Driver Behavior` source data into the target application.

---

## **Part 1: Data Schema Definitions**

### **1. Source Data Schema: Trips**
- **Source File:** `trips.csv`
- **Column Headers:** `tripId`, `driverId`, `startTime`, `endTime`, `startLocation_geopoint`, `endLocation_geopoint`, `distance_km`
- **Example Data Row:** `t101`, `d001`, `2023-10-27T09:00:00Z`, `2023-10-27T11:00:00Z`, `"40.7128,-74.0060"`, `"40.8128,-74.1060"`, `50.5`

### **2. Source Data Schema: Driver Behavior**
- **Source File:** `driver_behaviors.csv`
- **Column Headers:** `driverId`, `timestamp`, `eventType`, `speed_kmh`, `location_geopoint`
- **Example Data Row:** `d001`, `2023-10-27T10:00:00Z`, `hard_braking`, `85`, `40.7128,-74.0060`

### **3. Target Application Requirements**
- **Required 'Trips' Fields:** `tripID` (Integer), `driverName` (String), `tripDate` (Date, format YYYY-MM-DD), `distanceMiles` (Number), `durationHours` (Number)
- **Required 'Driver Behavior' Fields:** `driverID` (String), `eventType` (Enum: 'SPEEDING', 'BRAKING', 'ACCELERATION'), `eventTimestamp` (ISO 8601 Timestamp), `severity` (Integer, from 1 to 5)

---

## **Part 2: Analysis**

### **1. Field Mapping**

**Trips Data**
| Source Column (`trips.csv`) | Target Field (Application) | Notes |
| :-------------------------- | :------------------------- | :---- |
| `tripId`                    | `tripID`                   | Name casing mismatch, type conflict |
| `driverId`                  | `driverName`               | **Conflict:** Needs a lookup to get name |
| `startTime`                 | `tripDate`                 | Format and content mismatch |
| `startTime`, `endTime`      | `durationHours`            | **New Field:** Must be calculated |
| `distance_km`               | `distanceMiles`            | Unit of measurement conflict |
| *(None)*                    | -                          | `startLocation`, `endLocation` not required by target |

**Driver Behavior Data**
| Source Column (`driver_behaviors.csv`) | Target Field (Application) | Notes |
| :----------------------- | :------------------------- | :---- |
| `driverId`               | `driverID`                 | Name casing mismatch |
| `eventType`              | `eventType`                | Value mapping required (Enum) |
| `timestamp`              | `eventTimestamp`           | Name mismatch |
| *(None)*                 | `severity`                 | **New Field:** Missing from source |
| `speed_kmh`              | *(Not Required)*           | - |
| `location_geopoint`      | *(Not Required)*           | - |

### **2. Conflict Identification**

**Trips Data Conflicts:**
1.  **Mismatched Names:**
    - `tripId` vs. `tripID`
    - `distance_km` vs. `distanceMiles`
2.  **Data Type Conflicts:**
    - `tripId` is a string (e.g., "t101"), but `tripID` must be an **Integer**.
3.  **Data Format Inconsistencies:**
    - `startTime` is an ISO 8601 timestamp (`YYYY-MM-DDTHH:mm:ssZ`), but `tripDate` requires a simple date format (`YYYY-MM-DD`).
4.  **Unit of Measurement Differences:**
    - `distance_km` is in kilometers, but `distanceMiles` must be in **miles**.
    - Duration must be calculated from `startTime` and `endTime` and converted from minutes/seconds to **hours**.
5.  **Missing Fields:**
    - `driverName` is required, but only `driverId` is available. This requires an external data source or lookup table (e.g., a Drivers table) to resolve.
    - `durationHours` must be created.

**Driver Behavior Data Conflicts:**
1.  **Mismatched Names:**
    - `driverId` vs. `driverID`
    - `timestamp` vs. `eventTimestamp`
2.  **Data Format Inconsistencies (Enum Mismatch):**
    - `eventType` contains values like "hard_braking" and "rapid_acceleration", which must be mapped to the required Enum values: 'BRAKING', 'ACCELERATION'. A new 'SPEEDING' category would need a definition.
3.  **Missing Fields:**
    - `severity` (Integer, 1-5) is required by the application but is completely missing from the source data. This field must be created, likely based on conditional logic.

---

## **Part 3: Transformation Plan**

Here is a step-by-step plan to transform the source CSV files into an application-compatible format.

### **Step 1: Transform `trips.csv`**
1.  **Rename `tripId` to `tripID`:** Change the column header.
2.  **Transform `tripID` Data Type:** Remove the "t" prefix and convert the column values to integers. (e.g., "t101" -> `101`).
3.  **Replace `driverId` with `driverName`:**
    - **Instruction:** This requires an external lookup. For this plan, we'll use a hardcoded mapping as an example: `d001` -> `John Doe`, `d002` -> `Jane Smith`, `d003` -> `Peter Jones`.
    - Create a new column named `driverName` and populate it based on this lookup. Then, delete the original `driverId` column.
4.  **Create `tripDate` Column:**
    - Create a new column `tripDate`.
    - Populate it by taking the `startTime` value and extracting only the date portion (the first 10 characters). (e.g., `2023-10-27T09:00:00Z` -> `2023-10-27`).
5.  **Create `distanceMiles` Column:**
    - Create a new column `distanceMiles`.
    - Calculate its value by multiplying the `distance_km` column by **0.621371**.
6.  **Create `durationHours` Column:**
    - Create a new column `durationHours`.
    - For each row, calculate the difference between `endTime` and `startTime` in seconds.
    - Convert the result to hours by dividing by 3600.
7.  **Finalize `Trips` columns:** The final spreadsheet should have the headers: `tripID`, `driverName`, `tripDate`, `distanceMiles`, `durationHours`. All other original columns should be removed.

### **Step 2: Transform `driver_behaviors.csv`**
1.  **Rename `driverId` to `driverID`:** Change the column header.
2.  **Rename `timestamp` to `eventTimestamp`:** Change the column header.
3.  **Transform `eventType` Values:**
    - Apply a mapping to the `eventType` column:
        - "hard_braking" -> `BRAKING`
        - "rapid_acceleration" -> `ACCELERATION`
    - **Action:** Any other event types would need a corresponding mapping or be flagged as invalid. Assume for now that `speed_kmh` > 120 can be mapped to a new `SPEEDING` event.
4.  **Create `severity` Column:**
    - Create a new column `severity`.
    - Populate it using conditional logic. For instance:
        - If `eventType` is `BRAKING`, set `severity` based on `speed_kmh`: `5` if speed > 100, `4` if speed > 80, else `3`.
        - If `eventType` is `ACCELERATION`, set `severity` to `4`.
        - If `eventType` is `SPEEDING`, set `severity` to `5`.
        - This logic should be refined based on business rules.
5.  **Finalize `Driver Behavior` columns:** The final spreadsheet should have the headers: `driverID`, `eventType`, `eventTimestamp`, `severity`. The `speed_kmh` and `location_geopoint` columns should be removed.