// index.cjs - Basiese Express backend met health endpoint

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// CORS middleware (opsioneel, maar help vir frontend toegang)
app.use(cors());

// Root endpoint vir basiese toets
app.get('/', (req, res) => {
  res.send('Hello from Node.js and Express!');
});

// Health check endpoint vir jou Maps proxy frontend
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// (Opsioneel) Status endpoint, as jy wil konsistent wees
app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Start die server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
