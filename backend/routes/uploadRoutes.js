const express = require('express');
const router = express.Router();
const pool = require('../config/db');
// 1. POST: Upload Data with Company & Platform
router.post('/', async (req, res) => {
    const { metricType, company, platform, data } = req.body; 
    let rowsProcessed = 0; // Let's track if we actually do any work!

    try {
        await pool.query('BEGIN');
        
        for (const row of data) {
            // SMARTER PARSING: Look for variations of the word Date
            const dateStr = row['Date'] || row['date'] || row['Date '] || row['Day']; 
            
            if (!dateStr) {
                // Log what the row ACTUALLY looks like so you can debug it in your terminal
                console.log("Skipped a row. Headers found:", Object.keys(row));
                continue; 
            }

            // SMARTER PARSING: Look for the metric value
            // We added row['Primary'] here! pre-proccessor
            const valueStr = row['Value'] || row['value'] || row[metricType] || row['Profile Visits'] || row['Primary'];            const value = parseInt(valueStr) || 0; 

            const query = `
                INSERT INTO account_stats (company, platform, recorded_date, ${metricType}) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (company, platform, recorded_date) 
                DO UPDATE SET ${metricType} = EXCLUDED.${metricType};
            `;
            await pool.query(query, [company, platform, dateStr, value]);
            rowsProcessed++; // Successfully queued a row!
        }

        // If we finished the loop but did 0 work, throw an error!
        if (rowsProcessed === 0) {
            await pool.query('ROLLBACK');
            console.error("Upload Failed: No valid 'Date' columns found in the CSV.");
            return res.status(400).json({ error: "CSV Format Error: Make sure your first column is named 'Date'" });
        }

        await pool.query('COMMIT');
        console.log(`Success! Inserted/Updated ${rowsProcessed} rows.`);
        res.status(200).json({ message: `Successfully saved ${rowsProcessed} rows of data!` });
        
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// 2. GET: Dashboard Totals (FILTERED)
router.get('/totals', async (req, res) => {
    const { company, platform } = req.query; // Catch the filters from the frontend
    try {
        const query = `
            SELECT 
                COALESCE(SUM(views), 0) as total_views,
                COALESCE(SUM(visits), 0) as total_visits,
                COALESCE(SUM(viewers), 0) as total_viewers,
                COALESCE(MAX(followers), 0) as followers,
                COALESCE(SUM(interactions), 0) as interactions
            FROM account_stats
            WHERE company = $1 AND platform = $2
        `;
        const result = await pool.query(query, [company, platform]);
        res.status(200).json(result.rows[0] || { total_views: 0, total_visits: 0, total_viewers: 0, followers: 0, interactions: 0 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch totals" });
    }
});

// 3. GET: Time-Series Data for the Graphs (FILTERED)
router.get('/charts', async (req, res) => {
    const { company, platform } = req.query;
    try {
        const query = `
            SELECT 
                to_char(recorded_date, 'Mon DD') as week, 
                MAX(followers) as followers, 
                SUM(interactions) as likes, 
                SUM(visits) as comments 
            FROM account_stats 
            WHERE company = $1 AND platform = $2
            GROUP BY recorded_date 
            ORDER BY recorded_date ASC 
            LIMIT 30
        `;
        const result = await pool.query(query, [company, platform]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
});

// 4. GET: Pie Chart Breakdown (Dynamic Demo Data)
router.get('/pie', async (req, res) => {
    const { company, platform } = req.query;
    try {
        // First, check if this account even has data
        const check = await pool.query('SELECT COUNT(*) FROM account_stats WHERE company = $1 AND platform = $2', [company, platform]);
        if (parseInt(check.rows[0].count) === 0) return res.status(200).json([]); // Return empty if no data!

        // If it has data, return a cool platform-specific breakdown for the demo
        let pieData = [];
        if (platform === 'Instagram') pieData = [{ name: 'Reels', value: 45 }, { name: 'Static Posts', value: 25 }, { name: 'Carousels', value: 30 }];
        else if (platform === 'Facebook') pieData = [{ name: 'Videos', value: 50 }, { name: 'Static Posts', value: 30 }, { name: 'Links', value: 20 }];
        else pieData = [{ name: 'Articles', value: 60 }, { name: 'Static Posts', value: 40 }];
        
        res.status(200).json(pieData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pie data" });
    }
});

module.exports = router;