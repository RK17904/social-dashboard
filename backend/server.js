const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// --- THIS IS THE MISSING LINK ---
// We tell the server to route any request hitting '/api/upload' to your routes file
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is running and ready for data!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});