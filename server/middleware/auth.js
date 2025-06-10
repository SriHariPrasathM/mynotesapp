const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.cookies.token; //Requires cookie-parser middleware to parse cookies
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    } 
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the user information to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;