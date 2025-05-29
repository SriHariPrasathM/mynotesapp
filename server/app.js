require('dotenv').config({ path : '../.env' });
const express = require('express');
const db = require('./db');
const path = require('path');
const authRoute = require('./routes/authRoutes'); 
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

app.use('/api/v1/auth', authRoute);

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