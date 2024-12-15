import { loadNotes, saveNotes, createOrUpdateNote, deleteNote, timeAgo } from '../utils/noteUtils'

describe('Unit test', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Harus memuat catatan dari localStorage', () => {
    const mockNotes = [{ id: '1', title: 'Test', content: 'Test content' }]
    localStorage.setItem('notes', JSON.stringify(mockNotes))

    const notes = loadNotes()
    expect(notes).toEqual(mockNotes)
  })

  test('should save notes to localStorage', () => {
    const mockNotes = [{ id: '1', title: 'Test', content: 'Test content' }]
    saveNotes(mockNotes)

    const savedNotes = JSON.parse(localStorage.getItem('notes'))
    expect(savedNotes).toEqual(mockNotes)
  })

  test('should create a new note', () => {
    const notes = [{ id: '1', title: 'Old Note', content: 'Old content' }]
    const newNote = createOrUpdateNote(notes, 'New Note', 'New content', null)

    expect(newNote.length).toBe(2)
    expect(newNote[1].title).toBe('New Note')
  })

  test('should update an existing note', () => {
    const notes = [{ id: '1', title: 'Old Note', content: 'Old content' }]
    const updatedNotes = createOrUpdateNote(notes, 'Updated Note', 'Updated content', '1')

    expect(updatedNotes.length).toBe(1)
    expect(updatedNotes[0].title).toBe('Updated Note')
  })

  test('should delete a note', () => {
    const notes = [{ id: '1', title: 'Note to delete', content: 'Content' }]
    const updatedNotes = deleteNote(notes, '1')

    expect(updatedNotes.length).toBe(0)
  })

  test('should calculate time ago correctly', () => {
    const timestamp = new Date().getTime() - 1000 * 60 * 60 * 24
    const time = timeAgo(timestamp)
    expect(time).toBe('1 day ago')
  })
})
