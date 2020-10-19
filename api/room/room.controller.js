const roomService = require("./room.service");

async function getById(req, res) {
    const room = await roomService.getById(req.query);
    res.json(room);
}

// async function getById(req, res) {
//     const room = await roomService.getById(req.params.id)
//     res.json(room)
// }

async function query(req, res) {
    const filterBy = req.query;
    const rooms = await roomService.query(filterBy);
    res.json(rooms);
}

async function remove(req, res) {
    await roomService.remove(req.params.id);
    res.end();
}

async function update(req, res) {
    const room = req.body;
    await roomService.update(room);
    res.json(room);
}

async function add(req, res) {
    const room = req.body;
    // const user = req.session.user;
    // if (user) {
    //     room.owners = { _id: user._id, userName: user.userName, fullName: user.fullName } //MAYBE LATER
    // }
    const savedRoom = await roomService.add(room);
    res.json(savedRoom);
}

async function checkIsValidUser(req, res) {
    const { userId, roomId } = req.body;
    const isValid = await roomService.checkIsValidUser(userId, roomId);
    res.json(isValid);
}

async function removeNote(req, res) {
    const { roomId, noteId } = req.body;
    const updatedRoom = await roomService.removeNote(roomId, noteId);
    res.json(updatedRoom);
}

async function changeNoteColor(req, res) {
    const { roomId, noteId, color } = req.body;
    const updatedRoom = await roomService.changeNoteColor(roomId, noteId, color);
    res.json(updatedRoom);
}

async function toggleNotePin(req, res) {
    const { roomId, noteId } = req.body;
    const updatedRoom = await roomService.toggleNotePin(roomId, noteId);
    res.json(updatedRoom);
}

async function updateNote(req, res) {
    const { roomId, note } = req.body;
    const updatedRoom = await roomService.updateNote(roomId, note);
    res.json(updatedRoom);
}

async function getStarredNotes(req, res) {
    const user = req.query;
    const notes = await roomService.getStarredNotes(JSON.parse(user.starredNotes));
    console.log("notes in controlllerrrr", notes);
    res.json(notes);
}

// getStarredNotes
module.exports = {
    getById,
    query,
    remove,
    update,
    add,
    checkIsValidUser,
    removeNote,
    changeNoteColor,
    toggleNotePin,
    updateNote,
    getStarredNotes,
};
