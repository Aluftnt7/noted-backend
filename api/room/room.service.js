
const dbService = require('../../services/DbService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
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

async function getById(roomId) {
    const collection = await dbService.getCollection('room')
    try {
        const room = await collection.findOne({ "_id": ObjectId(roomId) })
        return room;
    } catch (err) {
        console.log(`ERROR: while finding room ${roomId}`)
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
    const collection = await dbService.getCollection('room');
    try {
        await collection.insertOne(room);  
        return room;
    } catch (err) {
        console.log(`ERROR: cannot insert room`)
        throw err;
    }
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