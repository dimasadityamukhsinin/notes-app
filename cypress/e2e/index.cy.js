describe('Home Component', () => {
  beforeEach(() => {
    // Set up the initial notes in localStorage before each test
    const initialNotes = [
      { id: '1', title: 'Old Note', content: 'This is the old content.', timestamp: Date.now() },
    ]
    cy.window().then((win) => {
      win.localStorage.setItem('notes', JSON.stringify(initialNotes))
    })

    // Visit the Home page (adjust the URL as necessary)
    cy.visit('http://localhost:3000/')
  })

  it('should render the add note form', () => {
    // Ensure the Add Note form is rendered
    cy.get('[data-testid="note-title"]').should('exist')
    cy.get('[data-testid="note-content"]').should('exist')
    cy.contains('Submit').should('exist') // Check for the submit button
  })

  it('should add a new note', () => {
    // Find the input fields and type in the new note details
    cy.get('[data-testid="note-title"]').type('New Note')
    cy.get('[data-testid="note-content"]').type('This is the content of the new note.')

    // Submit the form
    cy.contains('Submit').click()

    // Check that the note is added to the localStorage
    cy.window().then((win) => {
      const savedNotes = JSON.parse(win.localStorage.getItem('notes'))
      expect(savedNotes.length).to.eq(2) // Check if the new note is added
      expect(savedNotes[1].title).to.eq('New Note')
      expect(savedNotes[1].content).to.eq('This is the content of the new note.')
    })

    // Check that the new note appears in the UI
    cy.contains('New Note').should('exist')
    cy.contains('This is the content of the new note.').should('exist')
  })

  it('should update an existing note', () => {
    // Find and click the "Edit" button for the existing note
    cy.contains('Old Note').parent().find('[data-testid="edit"]').click()

    // Ensure the title and content are correctly populated in the form
    cy.get('[data-testid="note-title"]').should('have.value', 'Old Note')
    cy.get('[data-testid="note-content"]').should('have.value', 'This is the old content.')

    // Simulate editing the note
    cy.get('[data-testid="note-title"]').clear().type('Updated Note')
    cy.get('[data-testid="note-content"]').clear().type('This is the updated content.')

    // Click the "Submit" button to save the updated note
    cy.contains('Submit').click()

    // Check that the updated note is saved in localStorage
    cy.window().then((win) => {
      const savedNotes = JSON.parse(win.localStorage.getItem('notes'))
      expect(savedNotes[0].title).to.eq('Updated Note')
      expect(savedNotes[0].content).to.eq('This is the updated content.')
    })

    // Check that the updated note appears in the UI
    cy.contains('Updated Note').should('exist')
    cy.contains('This is the updated content.').should('exist')
  })

  it('should delete an existing note', () => {
    // Ensure the "Old Note" is rendered
    cy.contains('Old Note').should('exist')

    // Click the "Delete" button for the existing note
    cy.contains('Old Note').parent().find('[data-testid="delete"]').click()

    // Check that the note is removed from localStorage
    cy.window().then((win) => {
      const savedNotes = JSON.parse(win.localStorage.getItem('notes'))
      expect(savedNotes.length).to.eq(0) // No notes should be left
    })

    // Check that the note is removed from the UI
    cy.contains('Old Note').should('not.exist')
    cy.contains('This is the old content.').should('not.exist')
  })
})
