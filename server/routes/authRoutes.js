const express = require('express');
const { register, login, getCurrentUser, updateProfilePicture } = require('../controllers/authControllers');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

router.route('/register').post(upload.single("profile_image"), register);
router.route('/login').post(login);
router.route('/me').get(authMiddleware, getCurrentUser); 
router.route('/update-profile-picture').post(authMiddleware, upload.single("profile_image"), updateProfilePicture); 

module.exports = router;