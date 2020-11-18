const noteService = require("./note.service");

async function addNote(req, res) {
    const { userId, roomId, note } = req.body;
    const newNote = await noteService.addNote(userId, roomId, note);
    res.json(newNote);
}


async function removeNote(req, res) {
    const { roomId, noteId } = req.body;
    await noteService.removeNote(roomId, noteId);
    res.end();
}

async function changeNoteColor(req, res) {
    const { roomId, noteId, color } = req.body;
    const updatedNote = await noteService.changeNoteColor(roomId, noteId, color);
    res.json(updatedNote);
}


async function toggleNotePin(req, res) {
    const { roomId, noteId } = req.body;
    const updatedNote = await noteService.toggleNotePin(roomId, noteId);
    res.json(updatedNote);
}

async function updateNote(req, res) {
    const { roomId, note } = req.body;
    const updatedNote = await noteService.updateNote(roomId, note);
    res.json(updatedNote);
}

async function getStarredNotes(req, res) {
    const user = req.query;
    const notes = await noteService.getStarredNotes(JSON.parse(user.starredNotes));
    res.json(notes);
}

async function toggleStarredNote(req, res) {
    const { userId, roomId, noteId } = req.body;
    const user = await noteService.toggleStarredNote(userId, roomId, noteId)
    res.send(user)
}


module.exports = {
    addNote,
    removeNote,
    changeNoteColor,
    toggleNotePin,
    updateNote,
    getStarredNotes,
    toggleStarredNote
};
