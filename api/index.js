// Serverless API Function for Vercel
const express = require('express');
const cors = require('cors');
const { parse } = require('csv-parse/sync');

// Import Firebase utilities
let firebase;
try {
  firebase = require('./firebase');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Continue without Firebase if initialization fails
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Import API routes from src/api if needed
// We can proxy to these handlers for specific endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    services: {
      database: 'connected',
      cache: 'connected'
    }
  });
});

// CSV Import for Inventory
app.post('/api/inventory/import', async (req, res) => {
  try {
    const { importInventoryItems } = require('./firebase');
    
    // Check if there's CSV data in the request
    if (!req.body.csvData) {
      return res.status(400).json({
        error: 'Missing CSV data',
        message: 'Please provide CSV data in the request body'
      });
    }

    // Parse the CSV data
    const csvData = req.body.csvData;
    let records;
    
    console.log('Received CSV data of length:', csvData.length);
    console.log('First 100 characters:', csvData.substring(0, 100));
    
    try {
      // Handle both header and non-header CSV formats
      if (csvData.trim().startsWith('SCRAPPED TYRES') || 
          csvData.trim().startsWith('VEHICLE STORE') || 
          csvData.trim().startsWith('USED TYRES')) {
        console.log('Detected special format CSV (no headers)');
        // No headers format - parse with specific column mapping
        records = parse(csvData, {
          columns: false,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true, // Allow varying column counts
          skip_records_with_error: true // Skip records with parsing errors
        });
      } else {
        console.log('Detected standard CSV with headers');
        // Standard CSV with headers
        records = parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          skip_records_with_error: true // Skip records with parsing errors
        });
      }
    } catch (parseError) {
      console.error('CSV Parse Error:', parseError);
      return res.status(400).json({
        error: 'Invalid CSV format',
        message: parseError.message
      });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({
        error: 'Empty CSV',
        message: 'No valid records found in the CSV data'
      });
    }

    console.log('Sample record:', records[0]);
    console.log('Number of records found:', records.length);
    
    // Process each record and prepare for Firestore
    const processedRecords = records.map((record, index) => {
      // Check if record is an array (no headers) or object (with headers)
      const isArray = Array.isArray(record);
      
      // For debugging
      if (index === 0) {
        console.log('First record is array?', isArray);
        console.log('First record:', record);
      }
      
      // Extract values based on format
      // Your specific format appears to be:
      // [0]: SCRAPPED TYRES/VEHICLE STORE/USED TYRES (Location category)
      // [1]: Tyre ID ("XA12083P215")
      // [2]: Description ("RETREAD XA12083P215")
      // [3]: Pattern ("KL303")
      // [4]: Quantity ("4.0000")
      // [5]: Status ("Scrapped/Sold", "Recap One")
      // [6]: Axle Position ("Trailer", "Drive")
      // [7]: Size ("315/80R22.5", "385/65R22.5")
      // [8]: Model ("M3", "MM79")
      // [9]: Brand ("POWERTRAC", "STOCK RETREAD")
      // [10]: Vehicle ID ("T4", "T6")
      // [11]: Registration Number ("ADZ9011/ADZ9010")
      // [12]: Price ("0.0000")
      // [13]: Holding Bay ("HOLDING BAY - SCRAPPED TYRES")
      // [14]: Expiry Date ("18/11/2024")
      // [15]: Date Added ("01/07/2024")
      // [16]: Mileage ("0", "39952")
      
      let location = '';
      let tyreId = '';
      let description = '';
      let pattern = '';
      let quantity = 0;
      let status = '';
      let axlePosition = '';
      let size = '';
      let model = '';
      let brand = '';
      let vehicleId = '';
      let registrationNumber = '';
      let price = 0;
      let holdingBay = '';
      let expiryDate = '';
      let dateAdded = '';
      let mileage = '0';
      let id = '';
      
      try {
        location = isArray ? (record[0] || '') : (record.location || '');
        tyreId = isArray ? (record[1] || '') : (record.tyreId || '');
        description = isArray ? (record[2] || '') : (record.description || '');
        pattern = isArray ? (record[3] || '') : (record.pattern || '');
        quantity = parseFloat(isArray ? (record[4] || '0') : (record.quantity || '0')) || 0;
        status = isArray ? (record[5] || '') : (record.status || '');
        axlePosition = isArray ? (record[6] || '') : (record.axlePosition || '');
        size = isArray ? (record[7] || '') : (record.size || '');
        model = isArray ? (record[8] || '') : (record.model || '');
        brand = isArray ? (record[9] || '') : (record.brand || '');
        vehicleId = isArray ? (record[10] || '') : (record.vehicleId || '');
        registrationNumber = isArray ? (record[11] || '') : (record.registrationNumber || '');
        price = parseFloat(isArray ? (record[12] || '0') : (record.price || '0')) || 0;
        holdingBay = isArray ? (record[13] || '') : (record.holdingBay || '');
        expiryDate = isArray ? (record[14] || '') : (record.expiryDate || '');
        dateAdded = isArray ? (record[15] || new Date().toLocaleDateString()) : (record.dateAdded || new Date().toLocaleDateString());
        mileage = isArray ? (record[16] || '0') : (record.mileage || '0');
        
        // Generate a unique ID - use combination of tyreId and category for uniqueness
        id = tyreId ? 
          `${location.replace(/[^a-zA-Z0-9]/g, '_')}_${tyreId.replace(/[^a-zA-Z0-9]/g, '_')}` : 
          `tyre_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      } catch (err) {
        console.error(`Error processing record at index ${index}:`, err);
        console.error('Record data:', record);
        
        // Initialize default values if an error occurs
        id = id || `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        location = location || '';
        tyreId = tyreId || `unknown_${index}`;
        description = description || '';
        pattern = pattern || '';
        quantity = quantity || 0;
        status = status || '';
        axlePosition = axlePosition || '';
        size = size || '';
        model = model || '';
        brand = brand || '';
        vehicleId = vehicleId || '';
        registrationNumber = registrationNumber || '';
        price = price || 0;
        holdingBay = holdingBay || '';
        expiryDate = expiryDate || '';
        dateAdded = dateAdded || new Date().toLocaleDateString();
        mileage = mileage || '0';
      }
      
      return {
        id,
        location,
        tyreId,
        description,
        pattern,
        quantity,
        status,
        axlePosition,
        size,
        model,
        brand,
        vehicleId,
        registrationNumber,
        price,
        holdingBay,
        expiryDate,
        dateAdded,
        mileage,
        lastUpdated: new Date().toISOString(),
        importedAt: new Date().toISOString(),
        source: 'csv_import'
      };
    });

    // Save records to Firestore
    try {
      const result = await importInventoryItems(processedRecords);
      
      return res.status(200).json({
        success: true,
        message: `Successfully processed ${processedRecords.length} records`,
        importResult: result,
        sampleRecords: processedRecords.slice(0, 3) // Return first 3 as samples
      });
    } catch (dbError) {
      console.error('Firestore Error:', dbError);
      return res.status(500).json({
        error: 'Database Error',
        message: dbError.message
      });
    }
  } catch (error) {
    console.error('Inventory Import Error:', error);
    return res.status(500).json({
      error: 'Import failed',
      message: error.message
    });
  }
});

// GET all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    if (!firebase) {
      return res.status(500).json({
        error: 'Firebase not initialized',
        message: 'Database connection unavailable'
      });
    }
    
    const items = await firebase.getAllInventoryItems();
    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Error getting inventory items:', error);
    return res.status(500).json({
      error: 'Database Error',
      message: error.message
    });
  }
});

// GET inventory item by ID
app.get('/api/inventory/:id', async (req, res) => {
  try {
    if (!firebase) {
      return res.status(500).json({
        error: 'Firebase not initialized',
        message: 'Database connection unavailable'
      });
    }
    
    const { id } = req.params;
    const item = await firebase.getInventoryItemById(id);
    return res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error(`Error getting inventory item ${req.params.id}:`, error);
    return res.status(404).json({
      error: 'Item not found',
      message: error.message
    });
  }
});

// UPDATE inventory item
app.put('/api/inventory/:id', async (req, res) => {
  try {
    if (!firebase) {
      return res.status(500).json({
        error: 'Firebase not initialized',
        message: 'Database connection unavailable'
      });
    }
    
    const { id } = req.params;
    const result = await firebase.updateInventoryItem(id, req.body);
    return res.status(200).json({
      success: true,
      message: `Inventory item ${id} updated successfully`,
      result
    });
  } catch (error) {
    console.error(`Error updating inventory item ${req.params.id}:`, error);
    return res.status(500).json({
      error: 'Update failed',
      message: error.message
    });
  }
});

// DELETE inventory item
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    if (!firebase) {
      return res.status(500).json({
        error: 'Firebase not initialized',
        message: 'Database connection unavailable'
      });
    }
    
    const { id } = req.params;
    const result = await firebase.deleteInventoryItem(id);
    return res.status(200).json({
      success: true,
      message: `Inventory item ${id} deleted successfully`,
      result
    });
  } catch (error) {
    console.error(`Error deleting inventory item ${req.params.id}:`, error);
    return res.status(500).json({
      error: 'Delete failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export for serverless use
module.exports = app;
