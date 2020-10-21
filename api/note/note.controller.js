const noteService = require("./note.service");

async function addNote(req, res) {
    const { userId, roomId, note } = req.body;
    const savedRoom = await noteService.addNote(userId, roomId, note);
    res.json(savedRoom);
}


async function removeNote(req, res) {
    const { roomId, noteId } = req.body;
    const updatedRoom = await noteService.removeNote(roomId, noteId);
    res.json(updatedRoom);
}

async function changeNoteColor(req, res) {
    const { roomId, noteId, color } = req.body;
    const updatedRoom = await noteService.changeNoteColor(roomId, noteId, color);
    res.json(updatedRoom);
}

async function toggleNotePin(req, res) {
    const { roomId, noteId } = req.body;
    const updatedRoom = await noteService.toggleNotePin(roomId, noteId);
    res.json(updatedRoom);
}

async function updateNote(req, res) {
    const { roomId, note } = req.body;
    const updatedRoom = await noteService.updateNote(roomId, note);
    res.json(updatedRoom);
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
