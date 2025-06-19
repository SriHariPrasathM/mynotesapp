import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const handleUpdateOrCreateNote = async () => {
    try {
      if(editingNoteId) {
        // Update existing note
        const response = await axios.put(`http://localhost:5000/api/v1/notes/${editingNoteId}`, { note }, { withCredentials: true });
        setEditingNoteId(null);
      }
      else {
        // Create new note
        const response = await axios.post('http://localhost:5000/api/v1/notes', { note }, { withCredentials: true });
      }
      setNote("");
      fetchNotes(); // Refresh notes after creating or updating
    } catch (error) {
      setError("Error creating or updating note");
    }
  }

  const handleEditNote = (note) => {
    setNote(note.note);
    setEditingNoteId(note.note_id);
  }

  const handleDeleteNote = async (note) => {
    try {
      if(confirm("Are you sure you want to delete this note?")) {
        const response = await axios.delete(`http://localhost:5000/api/v1/notes/${note.note_id}`, { withCredentials: true });
        fetchNotes(); // Refresh notes after deletion
      }
    } catch (error) {
      setError("Error deleting note");
    }
  }

  const handleCancelNote = () => {
    setNote("");
    setEditingNoteId(null);
  }

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/notes', { withCredentials: true });
      setNotes(response.data.notes);
    } catch (error) {
      if(error.response && error.response.status === 404) {
        setNotes([]);
        setError("");
      }
      else{
        setError("Error fetching notes");
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className='dashboard-container'>
      <h2 className="dashboard-title">My Notes</h2>
      {error && <p className='error'>{error}</p>}
      <div className="note-input-container">
        <textarea className='note-textarea' rows={4} value={note} onChange={(e) => setNote(e.target.value)}></textarea>
        <div className="notes-actions">
          <button className='create-btn' onClick={handleUpdateOrCreateNote}>
          {editingNoteId ? "Update Note" : "Create Note"}
          </button>
          <button className="cancel-btn" onClick={handleCancelNote}>Cancel</button>
        </div>
      </div>
      <div className='notes-grid'>
        {notes.length > 0 ? (notes.map((note) => {
          const date = new Date(note.date).toLocaleDateString('en-CA');
          return (
            <div className='notes-card' key={note.note_id}>
            <p className='notes-text'>{note.note}</p>
            <p className='notes-date'>{date}</p>
            <div className='notes-actions'>
              <button className='edit-btn' onClick={() => handleEditNote(note)}>Edit</button>
              <button className='delete-btn' onClick={() => handleDeleteNote(note)}>Delete</button>
            </div>
          </div>)
          })) : (<p className='no-notes'>No notes available. Create a new note!</p>)
        }
      </div>
    </div>
  )
}

export default Dashboard;