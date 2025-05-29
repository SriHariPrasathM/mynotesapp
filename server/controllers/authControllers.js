const db = require('../db');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try{
        // Validate request body
        const { username, password, email, contact } = req.body;
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null; // Default to null if no file is uploaded
         
        if(!username || !password || !email) {
            return res.status(400).json({
                message: 'Username, password and email fields are required'
            });
        }

        // Check if the user already exists
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Username or email already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert the new user into the database
        const  [result] = await db.query(
            'INSERT INTO users (username, password, email, contact, profile_picture) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, contact, profile_image]
        );
        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = {
    register
};