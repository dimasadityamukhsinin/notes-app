// Utility functions to handle logic
export const loadNotes = () => {
  return JSON.parse(localStorage.getItem('notes')) || []
}

export const saveNotes = (notes) => {
  localStorage.setItem('notes', JSON.stringify(notes))
}

export const createOrUpdateNote = (notes, noteTitle, noteContent, editId) => {
  const newNote = {
    id: Date.now().toString(),
    title: noteTitle,
    content: noteContent,
    timestamp: Date.now(),
  }

  if (editId) {
    return notes.map((note) =>
      note.id === editId
        ? { ...note, title: noteTitle, content: noteContent }
        : note,
    )
  } else {
    return [...notes, newNote]
  }
}

export const deleteNote = (notes, id) => {
  return notes.filter((note) => note.id !== id)
}

export const timeAgo = (timestamp) => {
  const now = new Date()
  const diffInMs = now - new Date(timestamp)
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return '1 day ago'
  } else {
    return `${diffInDays} days ago`
  }
}
