const db = require('../db');

const createNote = async (req, res) => {
    try {
        const { note } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user by auth middleware   
        const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const [result] = await db.query(
            'INSERT INTO notes (user_id, note, date) VALUES (?, ?, ?)', 
            [userId, note, date]
        );
        // Check if the note was created successfully
        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: 'Failed to create note'
            });
        }
        res.status(201).json({
            message: 'Note created successfully',
            noteId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });   
    }
};

const getAllNotes = async (req, res) => {
    try{
        const userId = req.user.id;
        const [notes] = await db.query(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY date DESC', 
            [userId]
        );
        // Check if notes were found
        if(notes.length === 0) {
            return res.status(404).json({
                message: 'No notes found for this user'
            });
        }
        res.status(200).json({
            notes: notes
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { note } = req.body;
        const noteId = req.params.id; // Get note ID from request parameters
        const [result] = await db.query(
            'UPDATE notes SET note = ? WHERE user_id = ? AND note_id = ?',
            [note, userId, noteId]
        );
        if(result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }
        res.status(200).json({
            message: 'Note updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const [result] = await db.query(
            'DELETE FROM notes WHERE user_id = ? AND note_id = ?',
            [userId, noteId]
        );
        if(result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }
        res.status(200).json({
            message: 'Note deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });        
    }
}

module.exports = {
    createNote, getAllNotes, updateNote, deleteNote
};