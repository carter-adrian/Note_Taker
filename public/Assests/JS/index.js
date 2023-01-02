let noteTitle;
 let noteText;
 let saveNoteBtn;
 let newNoteBtn;
 let noteList;

 if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    noteList = document.querySelector('.list-container .list-group');
 }

//  Show an Element

const show = (elem) => {
    elem.style.display = 'inline';
};

//  Hide an Element

const hide = (elem) => {
    elem.style.display = 'none';
};

//activeNote is used to keep track of the active note
let activeNote = {};

// Get the note data from the db
const getNote = () => 
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

// Post a request
const saveNote = (note) => 
    fetch('/api/notes', {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    });

// Delete a request
const deleteNote = (id) => 
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

// Hide the save button
const renderActiveNote = () => {
    hide(saveNoteBtn);
    if (activeNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
} else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
}
};

// Save the note
const handleNoteSave = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value
    };

    saveNote(newNote).then(() => {
        gitAndRenderNote();
        renderActiveNote();
    });
};

// Delete the note
const handleNoteDelete = (e) => {
    e.stopPropagation();

const note = e.target;
const noteId =JSON.parse(note.parentElement.getAttribute('date-note')).id;

if (activeNote.id === noteId) {
    activeNote = {};
}

 deleteNote(noteId).then(() => {
    gitAndRenderNote();
    renderActiveNote();
    });
};

// Display the note
const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('date-note'));
    renderActiveNote();
};

// Empties the note and allows for a new note to be created
const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
};

const handleRenderSaveBtn = () => {
    if (!noteTitles.value.trim() || !noteTitles.value.trim()) {
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
    };

// Render the list of note titles
const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListTitles = [];

    // Render the HTML 
const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNewNoteView);

    liEl.append(spanEl);
    if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note'
        );
        delBtnEl.addEventListener('click', handleNoteDelete);
        liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListTitles.push(createLi('No saved notes', false));
    }
    
    jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListTitles.push(li);
    });

if (window.location.pathname === '/notes') {
    noteListTitles.forEach((note) => noteList[0].append(note));
}
 };

// Render to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();