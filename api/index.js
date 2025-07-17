// Serverless API Function for Vercel
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
