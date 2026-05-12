// frontend/src/components/DataManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DataManager() {
    const [records, setRecords] = useState([]);

    // 1. Fetch data from Neon (You will need a GET route on your backend for this)
    const fetchRecords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/metrics');
            setRecords(response.data);
        } catch (error) {
            console.error("Failed to fetch records", error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    // 2. Handle the Delete action
    const handleDelete = async (dateStr) => {
        // Format the date so Postgres understands it
        const formattedDate = new Date(dateStr).toISOString().split('T')[0];
        
        if (window.confirm(`Are you sure you want to delete data for ${formattedDate}?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/upload/${formattedDate}`);
                alert("Data removed!");
                fetchRecords(); // Refresh the table
            } catch (error) {
                alert("Failed to delete.");
            }
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h3>Manage Uploaded Data</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                        <th>Date</th>
                        <th>Followers</th>
                        <th>Visits</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.recorded_date} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{new Date(record.recorded_date).toLocaleDateString()}</td>
                            <td>{record.followers || '-'}</td>
                            <td>{record.visits || '-'}</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(record.recorded_date)}
                                    style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}