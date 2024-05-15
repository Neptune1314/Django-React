import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted!");
          getNotes();
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created!");
          getNotes();
          setContent("");
          setTitle("");
        } else {
          alert("Failed to create note.");
        }
      })
      .catch((err) => alert(err));
  };

  const editNote = (id) => {
    // Here you can implement the logic to fetch the note data by its ID
    // and set the content and title state accordingly.
    // For example:
    api
      .get(`/api/notes/${id}/`)
      .then((res) => {
        setContent(res.data.content);
        setTitle(res.data.title);
        setEditId(id);
      })
      .catch((error) => alert(error));
  };

  const updateNote = (e) => {
    e.preventDefault();
    api
      .put(`/api/notes/${editId}/`, { content, title })
      .then((res) => {
        if (res.status === 200) {
          alert("Note updated!");
          getNotes();
          setContent("");
          setTitle("");
          setEditId(null);
        } else {
          alert("Failed to update note.");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note
            note={note}
            onDelete={deleteNote}
            onEdit={editNote}
            key={note.id}
          />
        ))}
      </div>
      <h2>{editId ? "Edit Note" : "Create a Note"}</h2>
      <form onSubmit={editId ? updateNote : createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value={editId ? "Update" : "Submit"} />
      </form>
    </div>
  );
}

export default Home;
