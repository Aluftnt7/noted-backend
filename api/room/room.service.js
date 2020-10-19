const dbService = require("../../services/DbService");
const ObjectId = require("mongodb").ObjectId;
// const { getById } = require('../user/user.service')
const userService = require("../user/user.service");

module.exports = {
  query,
  getById,
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

async function query(filterBy = {}) {
  const critirea = _buildCriteria(filterBy);
  const collection = await dbService.getCollection("room");
  try {
    const rooms = await collection
      .find(critirea.query)
      .sort(critirea.sortBy)
      .toArray();
    return rooms;
  } catch (err) {
    console.log("ERROR: cannot find Rooms");
    throw err;
  }
}

async function getById(filterBy) {
  const collection = await dbService.getCollection("room");
  try {
    const room = await collection.findOne({ _id: ObjectId(filterBy.roomId) });
    if (filterBy.term) {
      let term = filterBy.term.toLowerCase();
      room.notes = room.notes.filter((note) => {
        if (note.header.includes(filterBy.term)) return note;
        else
          switch (note.type) {
            case "NoteLoc":
              return note.data.name.toLowerCase().includes(term);
            case "NoteTodo":
              return note.data.some((todo) =>
                todo.text.toLowerCase().includes(term),
              );
            default:
              return note.data.toLowerCase().includes(term);
          }
      });
    }
    room.notes = filterBy.type
      ? room.notes.filter((note) => note.type === filterBy.type)
      : room.notes;
    return room;
  } catch (err) {
    console.log(`ERROR: while finding room ${filterBy.roomId}`);
    throw err;
  }
}

async function getStarredNotes(starredNotesPointers) {
  console.log("inside service starred pointers:", starredNotesPointers);
  try {
    let notesToReturn = starredNotesPointers.map(async (currPointer) => {
      const { roomId, noteId } = currPointer;
      let room = await getById({ roomId });
      let starredNote = room.notes.filter((note) => note._id === noteId)[0];
      starredNote.roomId = roomId;
      return starredNote;
    });
    console.log("notesToReturn", notesToReturn);
    return Promise.all(notesToReturn);
  } catch (err) {
    console.log(`ERROR: could not find starred notes`);
    throw err;
  }
}

async function remove(roomId) {
  const collection = await dbService.getCollection("room");
  try {
    await collection.deleteOne({ _id: ObjectId(roomId) });
  } catch (err) {
    console.log(`ERROR: cannot remove room ${roomId}`);
    throw err;
  }
}

async function update(room) {
  const collection = await dbService.getCollection("room");
  room._id = ObjectId(room._id);
  try {
    await collection.replaceOne({ _id: room._id }, { $set: room });
    return room;
  } catch (err) {
    console.log(`ERROR: cannot update room ${room._id}`);
    throw err;
  }
}

async function add(room) {
  room.createdAt = Date.now();
  const collection = await dbService.getCollection("room");
  try {
    await collection.insertOne(room);
    console.log("backend room returned", room);
    return room;
  } catch (err) {
    console.log(`ERROR: cannot insert room`);
    throw err;
  }
}

async function checkIsValidUser(userId, roomId) {
  const room = await getById({ roomId });
  return room.members.some((memberId) => memberId.toString() === userId);
}

//from room get members
//load members
//check if noteId appears in member.starredNotes
//DELETE

async function removeNote(roomId, noteId) {
  const room = await getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  room.notes.splice(idx, 1);
  const updatedRoom = await update(room);
  _removeNoteFromStarred(updatedRoom);
  return updatedRoom;
}

async function changeNoteColor(roomId, noteId, color) {
  const room = await getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  room.notes[idx].bgColor = color;
  const updatedRoom = await update(room);
  return updatedRoom;
}

async function toggleNotePin(roomId, noteId) {
  let room = await getById({ roomId });
  const idx = room.notes.findIndex((note) => note._id === noteId);
  const note = room.notes.splice(idx, 1)[0]; //splice defalt behavior returns array
  note.isPinned = !note.isPinned;
  room = note.isPinned
    ? _handleNotePin(room, note)
    : _handleNoteUnpin(room, note);
  const updatedRoom = await update(room);
  return updatedRoom;
}

async function updateNote(roomId, note) {
  const room = await getById({ roomId });
  const idx = room.notes.findIndex((currNote) => note._id !== currNote._id);
  room.notes.splice(idx, 1, note);
  const updatedRoom = await update(room);
  return updatedRoom;
}

function _removeNoteFromStarred(room) {
  let members = room.members;
  members.forEach(async (memberId) => {
    let member = await userService.getById(memberId);
    member.starredNotes = member.starredNotes.filter(
      (starredNote) => starredNote.noteId === noteId,
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

function _buildCriteria(filterBy) {
  const critirea = {
    query: {},
    sortBy: {},
  };
  // if (filterBy.boardId) {
  //     if (filterBy.searchIn === 'genres') critirea.query.boardId = { $in: [filterBy.boardId] };
  // else critirea.query.title = { $regex: filterBy.txt, $options: 'i' };
  // }
  if (filterBy.sortBy === "date") critirea.sortBy.createdAt = -1;
  else critirea.sortBy.title = 1;
  return critirea;
}

// function _buildCriteria(filterBy) {
//     const critirea = {
//         query: {},
//         sortBy: {}
//     };
//     if (filterBy.txt) {
//         if (filterBy.searchIn === 'genres') critirea.query.labels = { $in: [filterBy.txt] };
//         else critirea.query.title = { $regex: filterBy.txt, $options: 'i' };
//     }

//     if (filterBy.sortBy === 'date') critirea.sortBy.createdAt = -1;
//     else critirea.sortBy.title = 1;

//     return critirea;
// }

// NOTE JSON MODEL:
// {
//     "header":"3",
//     "data":"3",
//     "type":"NoteText",
//     "bgColor":"#fff59d",
//     "isPinned":false,
//     "_id":"2c8JKrlbr9Dmtz9q56tIcQ5B",
//     "createdAt":1601986949152,
//     "createdBy": {
//         "_id": "5f16f434f18a3832d8ab3ae8",
//         "imgUrl": "https://res.cloudinary.com/tamir/image/upload/v1597846244/15978462202777382514642915071513_lzmbdn.jpg"
//     }
//  }
