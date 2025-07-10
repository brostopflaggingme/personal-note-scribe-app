
// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const welcomeScreen = document.getElementById('welcomeScreen');
const appContent = document.getElementById('appContent');
const notesCount = document.getElementById('notesCount');
const emptyState = document.getElementById('emptyState');

// Global Variables
let currentUser = null;
let notes = [];
let editingNoteId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initialized');
    await checkUserAuthentication();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    noteForm.addEventListener('submit', handleNoteSubmit);
}

// Authentication Functions
async function checkUserAuthentication() {
    try {
        console.log('Checking user authentication...');
        
        // Simulate user authentication check
        // In a real app, this would check with lovable.user.get()
        currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            currentUser = JSON.parse(currentUser);
            console.log('User is logged in:', currentUser);
            showAppContent();
            await loadNotes();
        } else {
            console.log('User is not logged in');
            showWelcomeScreen();
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        showWelcomeScreen();
    }
}

async function handleLogin() {
    try {
        console.log('Attempting to log in...');
        
        // Simulate login with lovable.auth.login()
        // In a real app, this would use the actual Lovable auth
        const mockUser = {
            id: 'user_' + Date.now(),
            email: 'user@example.com',
            name: 'Demo User'
        };
        
        currentUser = mockUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log('Login successful:', currentUser);
        showAppContent();
        await loadNotes();
        
        // Show success message
        showNotification('Welcome back! You are now logged in.', 'success');
        
    } catch (error) {
        console.error('Login failed:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleLogout() {
    try {
        console.log('Attempting to log out...');
        
        // Simulate logout with lovable.auth.logout()
        currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('notes_' + (currentUser?.id || ''));
        
        console.log('Logout successful');
        showWelcomeScreen();
        
        // Clear form and notes
        noteForm.reset();
        notes = [];
        renderNotes();
        
        // Show success message
        showNotification('You have been logged out successfully.', 'success');
        
    } catch (error) {
        console.error('Logout failed:', error);
        showNotification('Logout failed. Please try again.', 'error');
    }
}

// UI Functions
function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    appContent.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
}

function showAppContent() {
    welcomeScreen.classList.add('hidden');
    appContent.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
}

// Notes Functions
async function loadNotes() {
    try {
        console.log('Loading notes for user:', currentUser.id);
        
        // Simulate loading from lovable.db("notes")
        // In a real app, this would use: lovable.db("notes").find({ user: currentUser.id })
        const savedNotes = localStorage.getItem('notes_' + currentUser.id);
        notes = savedNotes ? JSON.parse(savedNotes) : [];
        
        console.log('Loaded notes:', notes);
        renderNotes();
        
    } catch (error) {
        console.error('Error loading notes:', error);
        showNotification('Failed to load notes.', 'error');
    }
}

async function saveNote(noteData) {
    try {
        console.log('Saving note:', noteData);
        
        const note = {
            id: editingNoteId || 'note_' + Date.now(),
            title: noteData.title,
            content: noteData.content,
            user: currentUser.id,
            createdAt: editingNoteId ? 
                notes.find(n => n.id === editingNoteId)?.createdAt || new Date().toISOString() : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (editingNoteId) {
            // Update existing note
            const index = notes.findIndex(n => n.id === editingNoteId);
            if (index !== -1) {
                notes[index] = note;
                console.log('Note updated:', note);
                showNotification('Note updated successfully!', 'success');
            }
            editingNoteId = null;
            document.querySelector('#noteForm button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add Note';
        } else {
            // Create new note
            notes.push(note);
            console.log('Note created:', note);
            showNotification('Note created successfully!', 'success');
        }
        
        // Simulate saving to lovable.db("notes")
        localStorage.setItem('notes_' + currentUser.id, JSON.stringify(notes));
        
        renderNotes();
        noteForm.reset();
        
    } catch (error) {
        console.error('Error saving note:', error);
        showNotification('Failed to save note.', 'error');
    }
}

async function deleteNote(noteId) {
    try {
        console.log('Deleting note:', noteId);
        
        if (confirm('Are you sure you want to delete this note?')) {
            // Simulate deletion from lovable.db("notes")
            notes = notes.filter(note => note.id !== noteId);
            localStorage.setItem('notes_' + currentUser.id, JSON.stringify(notes));
            
            console.log('Note deleted:', noteId);
            renderNotes();
            showNotification('Note deleted successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Error deleting note:', error);
        showNotification('Failed to delete note.', 'error');
    }
}

async function editNote(noteId) {
    try {
        console.log('Editing note:', noteId);
        
        const note = notes.find(n => n.id === noteId);
        if (!note) {
            throw new Error('Note not found');
        }
        
        // Populate form with note data
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        
        // Set editing mode
        editingNoteId = noteId;
        document.querySelector('#noteForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Note';
        
        // Scroll to form
        document.querySelector('.note-form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Focus on title input
        document.getElementById('noteTitle').focus();
        
        showNotification('Edit mode activated. Make your changes and click Update.', 'info');
        
    } catch (error) {
        console.error('Error editing note:', error);
        showNotification('Failed to load note for editing.', 'error');
    }
}

function renderNotes() {
    console.log('Rendering notes:', notes.length);
    
    // Update notes count
    const count = notes.length;
    notesCount.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
    
    // Show/hide empty state
    if (count === 0) {
        emptyState.classList.remove('hidden');
        notesList.innerHTML = '';
        return;
    } else {
        emptyState.classList.add('hidden');
    }
    
    // Render notes (newest first)
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    notesList.innerHTML = sortedNotes.map(note => `
        <li class="note-item" data-note-id="${note.id}">
            <div class="note-title">
                <i class="fas fa-sticky-note"></i>
                ${escapeHtml(note.title)}
            </div>
            <div class="note-content">
                ${escapeHtml(note.content).replace(/\n/g, '<br>')}
            </div>
            <div class="note-meta">
                <small style="color: #888; font-style: italic;">
                    ${note.createdAt !== note.updatedAt ? 'Updated' : 'Created'}: 
                    ${formatDate(note.updatedAt)}
                </small>
            </div>
            <div class="note-actions">
                <button class="btn btn-edit" onclick="editNote('${note.id}')">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-delete" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </li>
    `).join('');
}

// Event Handlers
async function handleNoteSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const noteData = {
        title: formData.get('title').trim(),
        content: formData.get('content').trim()
    };
    
    if (!noteData.title || !noteData.content) {
        showNotification('Please fill in both title and content.', 'warning');
        return;
    }
    
    await saveNote(noteData);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 2) {
        return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
        return diffDays + ' days ago';
    } else {
        return date.toLocaleDateString();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(45deg, #28a745, #20c997)';
        case 'error': return 'linear-gradient(45deg, #dc3545, #c82333)';
        case 'warning': return 'linear-gradient(45deg, #ffc107, #fd7e14)';
        default: return 'linear-gradient(45deg, #007bff, #6610f2)';
    }
}

// Make functions available globally
window.editNote = editNote;
window.deleteNote = deleteNote;

console.log('Personal Notes App loaded successfully!');
