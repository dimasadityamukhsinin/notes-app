'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [notes, setNotes] = useState([])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [editId, setEditId] = useState(null)

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || []
    setNotes(savedNotes)
  }, [])

  // Save notes to localStorage whenever notes state changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Handle form submission to add or update a note
  const handleSubmit = (e) => {
    e.preventDefault()

    const newNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      timestamp: Date.now(), // Add timestamp to the note
    }

    if (editId) {
      // Update existing note
      const updatedNotes = notes.map((note) =>
        note.id === editId
          ? { ...note, title: noteTitle, content: noteContent }
          : note,
      )
      setNotes(updatedNotes)
    } else {
      // Add new note
      setNotes([...notes, newNote])
    }

    setNoteTitle('')
    setNoteContent('')
    setEditId(null)
  }

  // Handle editing a note
  const editNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id)
    setNoteTitle(noteToEdit.title)
    setNoteContent(noteToEdit.content)
    setEditId(id)
  }

  // Handle deleting a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
  }

  // Helper function to calculate "x days ago"
  const timeAgo = (timestamp) => {
    const now = new Date()
    const diffInMs = now - new Date(timestamp)
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) // Convert milliseconds to days

    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return '1 day ago'
    } else {
      return `${diffInDays} days ago`
    }
  }

  return (
    <main>
      <section>
        <span id="title">{editId ? 'Edit a Note' : 'Add a Note'}</span>
        <form id="note-form" data-testid="note-form" onSubmit={handleSubmit}>
          <input
            id="note-title"
            data-testid="note-title"
            type="text"
            placeholder="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
          <textarea
            id="note-content"
            data-testid="note-content"
            type="text"
            rows="5"
            placeholder="Take a note..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
      <section>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <mask
              id="mask0_206_12"
              style={{
                maskType: 'alpha',
              }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="32"
              height="32"
            >
              <rect width="32" height="32" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_206_12)">
              <path
                d="M10.6667 24H21.3333V21.3333H10.6667V24ZM10.6667 18.6667H21.3333V16H10.6667V18.6667ZM8.00001 29.3333C7.26668 29.3333 6.6389 29.0722 6.11668 28.55C5.59445 28.0278 5.33334 27.4 5.33334 26.6667V5.33333C5.33334 4.6 5.59445 3.97222 6.11668 3.45C6.6389 2.92778 7.26668 2.66667 8.00001 2.66667H18.6667L26.6667 10.6667V26.6667C26.6667 27.4 26.4056 28.0278 25.8833 28.55C25.3611 29.0722 24.7333 29.3333 24 29.3333H8.00001ZM17.3333 12V5.33333H8.00001V26.6667H24V12H17.3333Z"
                fill="#203562"
              />
            </g>
          </svg>
          <span>My Notes</span>
        </div>
        <div id="notes-container">
          {notes.map((note) => (
            <div key={note.id} className="note">
              <div>
                <span>{note.title}</span>
                <div>
                  <button data-testid="edit" onClick={() => editNote(note.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <mask
                        id="mask0_206_47"
                        style={{
                          maskType: 'alpha',
                        }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_206_47)">
                        <path
                          d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                          fill="#203562"
                        />
                      </g>
                    </svg>
                  </button>
                  <button data-testid="delete" onClick={() => deleteNote(note.id)}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_206_50"
                        style={{
                          maskType: 'alpha',
                        }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      >
                        <rect width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_206_50)">
                        <path
                          d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                          fill="#203562"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
              <p>{note.content}</p>
              <span>{timeAgo(note.timestamp)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
