const userService = require("../user/user.service");
const roomService = require("../room/room.service");
const UtilService = require("../../services/UtilService");

async function addNote(userId, roomId, note) {
  const user = await userService.getById(userId);
  const room = await roomService.getById({ roomId })
  note._id = UtilService.makeId(8)
  note.createdAt = Date.now()
  let { _id, imgUrl } = user
  note.createdBy = { _id, imgUrl }
  let idx = room.notes.findIndex(currNote => !currNote.isPinned);
  (idx === -1) ? room.notes.push(note) : room.notes.splice(idx, 0, note)
  await roomService.update(room);
  return note
}

async function removeNote(roomId, noteId) {
  const room = await roomService.getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  room.notes.splice(idx, 1);
  const updatedRoom = await roomService.update(room);
  _removeNoteFromStarred(updatedRoom, noteId)
}


async function changeNoteColor(roomId, noteId, color) {
  const room = await roomService.getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  room.notes[idx].bgColor = color;
  await roomService.update(room);
  return room.notes[idx];
}



async function toggleNotePin(roomId, noteId) {
  let room = await roomService.getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  const note = room.notes.splice(idx, 1)[0]; //splice defalt behavior returns array
  note.isPinned = !note.isPinned;
  room = note.isPinned ? _handleNotePin(room, note) : _handleNoteUnpin(room, note);
  await roomService.update(room);
  return note;
}


async function updateNote(roomId, note) {
  const room = await roomService.getById({ roomId });
  const idx = room.notes.findIndex((currNote) => note._id === currNote._id);
  room.notes.splice(idx, 1, note);
  await roomService.update(room);
  return note;
}

async function getStarredNotes(starredNotesPointers) {
  try {
    let notesToReturn = starredNotesPointers.map(async (currPointer) => {
      const { roomId, noteId } = currPointer;
      let room = await roomService.getById({ roomId });
      let starredNote = room.notes.filter((note) => note._id === noteId)[0];
      starredNote.roomId = roomId;
      return starredNote;
    });
    return Promise.all(notesToReturn);
  } catch (err) {
    console.log(`ERROR: could not find starred notes`);
    throw err;
  }
}

async function toggleStarredNote(userId, roomId, noteId) {
  try {
    const user = await userService.getById(userId);
    let idx = user.starredNotes.findIndex(currNote => noteId === currNote.noteId);
    (idx === -1) ? user.starredNotes.unshift({ roomId, noteId }) : user.starredNotes.splice(idx, 1);
    let updatedUser = await userService.update(JSON.parse(JSON.stringify(user)),);
    return updatedUser;
  } catch (err) {
    console.log(`Something went wrong ${userId}`);
    throw err;
  }
}

async function _removeNoteFromStarred(room, noteId) {
  let members = room.members;
  members.forEach(async (memberId) => {
    let member = await userService.getById(memberId);
    member.starredNotes = member.starredNotes.filter(
      (starredNote) => starredNote.noteId !== noteId,
    );
    userService.update(JSON.parse(JSON.stringify(member)));
  });
}

function _handleNotePin(room, note) {
  room.notes.unshift(note);
  return room;
}

function _handleNoteUnpin(room, note) {
  let idx = room.notes.findIndex(
    (currNote) => !currNote.isPinned && currNote.createdAt <= note.createdAt,
  );
  idx === -1 ? room.notes.push(note) : room.notes.splice(idx, 0, note);
  return room;
}

module.exports = {
  addNote,
  removeNote,
  changeNoteColor,
  toggleNotePin,
  updateNote,
  getStarredNotes,
  toggleStarredNote,
};
