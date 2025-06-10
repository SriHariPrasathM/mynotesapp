require('dotenv').config({ path : '../.env' });
const express = require('express');
const db = require('./db');
const path = require('path');
const notFoundHandler = require('./middleware/not-found');
const authRoute = require('./routes/authRoutes'); 
const noteRoute = require('./routes/notesRoutes');
const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/error-handler');
const cors = require('cors');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the client URL
    credentials: true, // Allow cookies to be sent with requests
    })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/notes', noteRoute);

app.use(notFoundHandler); // Middleware for handling 404 errors
app.use(errorHandlerMiddleware); // Middleware for handling errors

const PORT = process.env.PORT || 3000;

// Start the server and connect to the database
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