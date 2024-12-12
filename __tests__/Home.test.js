import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

// Mock localStorage to avoid actual localStorage interactions during tests
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

// Mock initializeApp and getFirestore (Firebase dependencies)
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  Timestamp: jest.fn(),
}));

describe("Home Component", () => {
  afterEach(cleanup);

  it('should load notes from database', () => {
    const savedNotes = [
      { id: '1', title: 'Stored Note', content: 'This note is stored in localStorage', timestamp: Date.now() },
    ]
    localStorage.setItem('notes', JSON.stringify(savedNotes))

    render(<Home />)

    // The saved note should be displayed
    expect(screen.getByText('Stored Note')).toBeInTheDocument()
    expect(screen.getByText('This note is stored in localStorage')).toBeInTheDocument()
  })

  it("should add a new note", () => {
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Note" },
    });
    fireEvent.change(screen.getByPlaceholderText("Take a note..."), {
      target: { value: "This is a new note." },
    });

    fireEvent.submit(screen.getByTestId("note-form"));

    // After submission, the new note should be in the notes list
    expect(screen.getByText("New Note")).toBeInTheDocument();
    expect(screen.getByText("This is a new note.")).toBeInTheDocument();

    // Check that localStorage has the note
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    expect(savedNotes).toHaveLength(1);
    expect(savedNotes[0].title).toBe("New Note");
  });

  it("should update an existing note", async () => {
    // Initial setup: Add a note in localStorage
    const initialNotes = [
      {
        id: "1",
        title: "Old Note",
        content: "This is the old content.",
        timestamp: Date.now(),
      },
    ];
    localStorage.setItem("notes", JSON.stringify(initialNotes));

    // Render the component
    render(<Home />);

    // Find and click the "Edit" button (assuming there's a button with 'Edit' text or a specific test ID for it)
    fireEvent.click(screen.getByTestId("edit")); // or use getByTestId('edit-button')

    // Simulate editing the note by changing the form fields
    fireEvent.change(screen.getByTestId("note-title"), {
      target: { value: "Updated Note" },
    });
    fireEvent.change(screen.getByTestId("note-content"), {
      target: { value: "This is the updated content." },
    });

    // Submit the form to save the updated note
    fireEvent.click(screen.getByText("Submit"));

    // Wait for the component and localStorage to update
    await waitFor(() => {
      const savedNotes = JSON.parse(localStorage.getItem("notes"));
      expect(savedNotes[0].title).toBe("Updated Note");
      expect(savedNotes[0].content).toBe("This is the updated content.");
    });
  });

  it('should delete a note', () => {
    const initialNotes = [
      { id: '1', title: 'Note to delete', content: 'This note will be deleted', timestamp: Date.now() },
    ]
    localStorage.setItem('notes', JSON.stringify(initialNotes))

    render(<Home />)

    fireEvent.click(screen.getByText('Note to delete'))
    
    fireEvent.click(screen.getByTestId('delete'))

    // The note should be removed from the list after deletion
    expect(screen.queryByText('Note to delete')).not.toBeInTheDocument()

    // Check that the note is deleted from localStorage
    const savedNotes = JSON.parse(localStorage.getItem('notes'))
    expect(savedNotes).toHaveLength(0)
  })
});
