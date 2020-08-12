
const dbService = require('../../services/DbService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    checkIsValidUser
}

async function query(filterBy = {}) {
    const critirea = _buildCriteria(filterBy);
    const collection = await dbService.getCollection('room');
    try {
        const rooms = await collection.find(critirea.query).sort(critirea.sortBy).toArray();
        return rooms;
    } catch (err) {
        console.log('ERROR: cannot find Rooms')
        throw err;
    }
}

async function getById(filterBy) {
<<<<<<< HEAD
    console.log('FILTER BYYYYYYYYYYY', filterBy);

    const collection = await dbService.getCollection('room')
    try {
        const room = await collection.findOne({ "_id": ObjectId(filterBy.roomId) })
        console.log('rooooooom', room);
        console.log('notes before', room.notes.length)
        room.notes = (filterBy.term) ? room.notes.filter(note => { return note.header.includes(filterBy.term) || note.data.includes(filterBy.term) }) : room.notes
=======
    console.log('filterBy IS:', filterBy);
    const collection = await dbService.getCollection('room')
    try {
        const room = await collection.findOne({ "_id": ObjectId(filterBy.roomId) })
        if (filterBy.term) {
            let term = filterBy.term.toLowerCase()
            room.notes = room.notes.filter(note => {
                if (note.header.includes(filterBy.term)) return note
                else switch (note.type) {
                    case 'NoteLoc':
                        return note.data.name.toLowerCase().includes(term)
                    case 'NoteTodo':
                        return note.data.some(todo => todo.text.toLowerCase().includes(term));
                    default:
                        return note.data.toLowerCase().includes(term)
                }
            })
        }
>>>>>>> 75ef28017e8830bc6c8ef2c3f29e23843c962fa1
        room.notes = (filterBy.type) ? room.notes.filter(note => note.type === filterBy.type) : room.notes
        return room
    } catch (err) {
        console.log(`ERROR: while finding room ${filterBy.roomId}`)
        throw err;
    }
}


async function remove(roomId) {
    const collection = await dbService.getCollection('room')
    try {
        await collection.deleteOne({ "_id": ObjectId(roomId) })
    } catch (err) {
        console.log(`ERROR: cannot remove room ${roomId}`)
        throw err;
    }
}

async function update(room) {
    const collection = await dbService.getCollection('room')
    room._id = ObjectId(room._id);
    try {
        await collection.replaceOne({ "_id": room._id }, { $set: room })
        return room;
    } catch (err) {
        console.log(`ERROR: cannot update room ${room._id}`)
        throw err;
    }
}

async function add(room) {
    room.createdAt = Date.now();
    const collection = await dbService.getCollection('room');
    try {
        await collection.insertOne(room);
        console.log('backend room returned', room);

        return room;
    } catch (err) {
        console.log(`ERROR: cannot insert room`)
        throw err;
    }
}

async function checkIsValidUser(userId, roomId) {
    const room = await getById({ roomId })
    return room.members.some(memberId => memberId.toString() === userId)
}

function _buildCriteria(filterBy) {
    const critirea = {
        query: {},
        sortBy: {}
    };
    // if (filterBy.boardId) {
    //     if (filterBy.searchIn === 'genres') critirea.query.boardId = { $in: [filterBy.boardId] };
    // else critirea.query.title = { $regex: filterBy.txt, $options: 'i' };
    // } 
    if (filterBy.sortBy === 'date') critirea.sortBy.createdAt = -1;
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