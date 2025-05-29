const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get the file extension
        const uniqueFilename = Date.now() + ext; // Create a unique filename
        cb(null, uniqueFilename); // Set the filename
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png/; // Allowed file types

        // Check the file extension and MIME type
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype); 
        
        if(extname && mimetype) {
            return cb(null, true); // Accept the file
        }
        else{
            cb(new Error('Only jpg, jpeg, png images are allowed'), false); // Reject the file
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    }
});

//Multer adds the `file` object to the request, which contains information about the 
//uploaded file
module.exports = upload;