const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const { 
    BadRequestError, NotFoundError, ConflictingRequestError, UnauthenticatedError
    } = require('../errors');

//If you're on Express 5, you don't need express-async-errors anymore!
//Express 5 supports async/await error propagation natively 
//(AsyncWrapper / try catch block not needed)

const register = async (req, res) => {
    // Validate request body
    const { username, password, email, contact } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : `/uploads/default.png`; // Default to null if no file is uploaded
    
    if(!username || !password || !email) {
        throw new BadRequestError('Username, password and email fields are required');
    }

    // Check if the user already exists
    const [existingUser] = await db.query(
        'SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
        throw new ConflictingRequestError('Email already exists');
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
};

const login = async (req, res) => {
    const { username, password } = req.body;
    // Validate request body
    if (!username || !password) {
        throw new BadRequestError('Username and password are required');
    }

    // Check if the user exists
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
        throw new NotFoundError('User not found, please register first');
    }

    // Compare the provided password with the hashed password in the database
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthenticatedError('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Set the token in a cookie
    // Native cookie support in Express
    res.cookie('token', token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: new Date(Date.now() + process.env.COOKIE_EXPIRATION * 1000), // Set cookie expiration
    });

    res.status(200).json({
        message: 'Login successful'
    });
};

const logout = async (req, res) => {
    //Native cookie support in Express
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logout successful'
    })
};

const getCurrentUser = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is stored in req.user by the auth middleware
    const [users] = await db.query(
        "SELECT id, username, email, contact, profile_picture FROM users WHERE id = ?", [userId]
    );
    res.status(200).json({
        user: users[0]
    });
};

const updateProfilePicture = async (req, res) => {
    const userId = req.user.id; 
    const newFilename = req.file ? req.file.filename : null;

    const [users] = await db.query(
        'SELECT profile_picture FROM users WHERE id = ?', [userId]
    );
    const oldProfilePicture = users[0]?.profile_picture; // Get the old profile picture path from the database
    
    const profile_image = newFilename ? `/uploads/${newFilename}` : `/uploads/default.png`;
    await db.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?', 
        [profile_image, userId]
    );

    if(oldProfilePicture && oldProfilePicture !== '/uploads/default.png'){
        // Delete the old profile picture file if it exists and is not the default image
        const oldFilePath = path.join(__dirname, '..', oldProfilePicture);
        await fs.unlink(oldFilePath); // Delete the old file
    }
    res.status(200).json({
        message: 'Profile picture updated successfully',
        profile_picture: profile_image
    });
}

module.exports = {
    register, login, logout, getCurrentUser, updateProfilePicture
};