require('dotenv').config({ path : '../.env' });
const express = require('express');
const db = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

async function start() {
    try{
        await db.query('SELECT 1');
        console.log('Database connection successful');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err){
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the process with failure
    }
}

start();