const express = require('express');
const { register } = require('../controllers/authControllers');
const router = express.Router();
const upload = require('../middleware/fileUpload');

router.route('/register').post(upload.single("profile_image"), register);

module.exports = router;