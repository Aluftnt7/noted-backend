
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
    const collection = await dbService.getCollection('note');
    try {
        const notes = await collection.find(critirea.query).sort(critirea.sortBy).toArray();
        return notes;
    } catch (err) {
        console.log('ERROR: cannot find Notes')
        throw err;
    }
}

async function getById(noteId) {
    const collection = await dbService.getCollection('note')
    try {
        const note = await collection.findOne({ "_id": ObjectId(noteId) })
        return note;
    } catch (err) {
        console.log(`ERROR: while finding note ${noteId}`)
        throw err;
    }
}


async function remove(noteId) {
    const collection = await dbService.getCollection('note')
    try {
        await collection.deleteOne({ "_id": ObjectId(noteId) })
    } catch (err) {
        console.log(`ERROR: cannot remove note ${noteId}`)
        throw err;
    }
}

async function update(note) {
    const collection = await dbService.getCollection('note')
    note._id = ObjectId(note._id);
    
    try {
        await collection.replaceOne({ "_id": note._id }, { $set: note })
        return note;
    } catch (err) {
        console.log(`ERROR: cannot update note ${note._id}`)
        throw err;
    }
}

async function add(note) {
    const collection = await dbService.getCollection('note');
    try {
        await collection.insertOne(note);  
        return note;
    } catch (err) {
        console.log(`ERROR: cannot insert note`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const critirea = {
        query: {},
        sortBy: {}
    };
    if (filterBy.boardId) {
        if (filterBy.searchIn === 'genres') critirea.query.boardId = { $in: [filterBy.boardId] };
        // else critirea.query.title = { $regex: filterBy.txt, $options: 'i' };
    } 
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