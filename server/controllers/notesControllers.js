const db = require('../db');
const {
    BadRequestError,
    NotFoundError
    } = require('../errors');

const createNote = async (req, res) => {
    const { note } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user by auth middleware   
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const [result] = await db.query(
        'INSERT INTO notes (user_id, note, date) VALUES (?, ?, ?)', 
        [userId, note, date]
    );
    // Check if the note was created successfully
    if (result.affectedRows === 0) {
        throw new BadRequestError('Failed to create note');
    }
    res.status(201).json({
        message: 'Note created successfully',
        noteId: result.insertId
    });
};

const getAllNotes = async (req, res) => {
    const userId = req.user.id;
    const [notes] = await db.query(
        'SELECT * FROM notes WHERE user_id = ? ORDER BY date DESC', 
        [userId]
    );
    // Check if notes were found
    if(notes.length === 0) {
        throw new NotFoundError('No notes found for this user');
    }
    res.status(200).json({
        notes: notes
    });
}

const updateNote = async (req, res) => {
    const userId = req.user.id;
    const { note } = req.body;
    const noteId = req.params.id; // Get note ID from request parameters
    const [result] = await db.query(
        'UPDATE notes SET note = ? WHERE user_id = ? AND note_id = ?',
        [note, userId, noteId]
    );
    if(result.affectedRows === 0) {
        throw new NotFoundError('Note not found');
    }
    res.status(200).json({
        message: 'Note updated successfully'
    });
};

const deleteNote = async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const [result] = await db.query(
        'DELETE FROM notes WHERE user_id = ? AND note_id = ?',
        [userId, noteId]
    );
    if(result.affectedRows === 0) {
        throw new NotFoundError('Note not found');
    }
    res.status(200).json({
        message: 'Note deleted successfully'
    });
}

const deleteAllNotes = async (req, res) => {
    const userId = req.user.id;
    const [result] = await db.query(
        'DELETE FROM notes WHERE user_id = ?',
        [userId]
    );
    if(result.affectedRows === 0) {
        throw new NotFoundError('No notes found for this user');
    }
    res.status(200).json({
        message: 'All notes deleted successfully'
    });
}

const deleteSelectedNotes = async (req, res) => {
    const userId = req.user.id;
    const noteIds = req.body.noteIds; // Expecting an array of note IDs to delete
    if (!Array.isArray(noteIds) || noteIds.length === 0){
        throw new BadRequestError('No note IDs provided');
    }
    const placeholders = noteIds.map(() => '?').join(',');
    const [result] = await db.query(
        'DELETE FROM notes WHERE user_id = ? AND note_id IN (' + placeholders + ')',
        [userId, ...noteIds]
    );
    if(result.affectedRows === 0) {
        throw new NotFoundError('No notes found for the provided IDs');
    }
    res.status(200).json({
        message: 'Selected notes deleted successfully'
    });
}

module.exports = {
    createNote, getAllNotes, updateNote, deleteNote, deleteAllNotes, deleteSelectedNotes
};