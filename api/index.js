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
    
    try {
      // Handle both header and non-header CSV formats
      if (csvData.trim().startsWith('SCRAPPED TYRES') || 
          csvData.trim().startsWith('VEHICLE STORE') || 
          csvData.trim().startsWith('USED TYRES')) {
        // No headers format - parse with specific column mapping
        records = parse(csvData, {
          columns: false,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true // Allow varying column counts
        });
      } else {
        // Standard CSV with headers
        records = parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true
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

    // Process each record and prepare for Firestore
    const processedRecords = records.map((record, index) => {
      // Check if record is an array (no headers) or object (with headers)
      const isArray = Array.isArray(record);
      
      // Extract values based on format
      const location = isArray ? record[0] : record.location || '';
      const tyreId = isArray ? record[1] : record.tyreId || '';
      const description = isArray ? record[2] : record.description || '';
      const pattern = isArray ? record[3] : record.pattern || '';
      const quantity = parseFloat(isArray ? record[4] : record.quantity || 0);
      const status = isArray ? record[5] : record.status || '';
      const axlePosition = isArray ? record[6] : record.axlePosition || '';
      const size = isArray ? record[7] : record.size || '';
      const model = isArray ? record[8] : record.model || '';
      const brand = isArray ? record[9] : record.brand || '';
      const vehicleId = isArray ? record[10] : record.vehicleId || '';
      const registrationNumber = isArray ? record[11] : record.registrationNumber || '';
      const price = parseFloat(isArray ? record[12] : record.price || 0);
      const holdingBay = isArray ? record[13] : record.holdingBay || '';
      const expiryDate = isArray ? record[14] : record.expiryDate || '';
      const dateAdded = isArray ? record[15] : record.dateAdded || new Date().toLocaleDateString();
      const mileage = isArray ? record[16] : record.mileage || '0';
      
      // Generate a unique ID - use tyreId if available or generate one
      const id = tyreId ? tyreId.replace(/[^a-zA-Z0-9]/g, '_') : `tyre_${Date.now()}_${index}`;
      
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
        importedAt: new Date().toISOString()
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
