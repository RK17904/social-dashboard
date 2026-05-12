const { Pool } = require('pg');
require('dotenv').config();

// This securely connects your Node backend to your Neon PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon connections
    }
});

module.exports = pool;