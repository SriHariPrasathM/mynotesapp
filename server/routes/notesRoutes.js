const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createNote, getAllNotes, updateNote, deleteNote, deleteAllNotes, deleteSelectedNotes
} = require('../controllers/notesControllers');

router.route('/').post(authMiddleware, createNote)
    .get(authMiddleware, getAllNotes);

//Route should be above /:id to avoid conflicts with the dynamic route
router.route('/delete-selected').delete(authMiddleware, deleteSelectedNotes);
router.route('/delete-all').delete(authMiddleware, deleteAllNotes);

router.route('/:id').put(authMiddleware, updateNote)
    .delete(authMiddleware, deleteNote);


module.exports = router;