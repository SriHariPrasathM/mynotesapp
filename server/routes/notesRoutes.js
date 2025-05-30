const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createNote, getAllNotes, updateNote, deleteNote
} = require('../controllers/notesControllers');

router.route('/').post(authMiddleware, createNote)
    .get(authMiddleware, getAllNotes);
router.route('/:id').put(authMiddleware, updateNote)
    .delete(authMiddleware, deleteNote);

module.exports = router;