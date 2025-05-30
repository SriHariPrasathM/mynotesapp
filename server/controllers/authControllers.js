const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/fileUpload');
const { BadRequestError } = require('../errors');

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
            return res.status(409).json({
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

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate request body
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        // Check if the user exists
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Compare the provided password with the hashed password in the database
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id },
             process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Set the token in a cookie
        // Note: Ensure that the 'cookie-parser' middleware is used in your app
        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            maxAge: new Date(Date.now() + process.env.COOKIE_EXPIRATION * 1000), // Set cookie expiration
        });

        res.status(200).json({
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
        
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in req.user by the auth middleware
        const [users] = await db.query(
            "SELECT id, username, email, contact, profile_picture FROM users WHERE id = ?", [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            user: users[0]
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; 
    
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null;
        const [result] = await db.query(
            'UPDATE users SET profile_picture = ? WHERE id = ?', 
            [profile_image, userId]
        );
        if(result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found, unable to update profile picture'
            });
        }
        res.status(200).json({
            message: 'Profile picture updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    register, login, getCurrentUser, updateProfilePicture
};