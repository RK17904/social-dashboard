const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Existing Upload Routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// --- ADD THESE TWO LINES FOR USER MANAGEMENT ---
const userRoutes = require('./routes/UserRouters');
app.use('/api/users', userRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is running and ready for data!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});