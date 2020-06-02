const dbService = require('../../services/DbService');
// const reviewService = require('');
// const projService = require('../proj/projService');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const collection = await dbService.getCollection('user')
    try {
        const criteria = await _buildCriteria(filterBy)
            return filterBy.limit
            ? await collection.find(criteria).skip( +filterBy.skip > 0 ? ( ( +filterBy.skip) * +filterBy.limit ) + 8 : 0 ).limit(+filterBy.limit).toArray()
            : await collection.find(criteria).toArray();
    } catch (err) {
        console.log('ERROR: cannot find projs', err)
        throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err;
    }
}
async function getByUsername(userName) {
    
    const collection = await dbService.getCollection('user')
    
    try {
        const user = await collection.findOne({userName})
        
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userName}`)
        throw err;
    }
}

async function remove(userId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.deleteOne({ "_id": ObjectId(userId) })
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw err;
    }
}

async function update(user, isSocket = false) {
    const collection = await dbService.getCollection('user')
    const filterByForUser = {byId: user._id}
    const filterByForProj = {id: user._id}
    user._id = ObjectId(user._id);
    try {
        await collection.replaceOne({ "_id": user._id }, { $set: user })
        if (!isSocket) {
            const reviewsByUser = await reviewService.query(filterByForUser)
            reviewsByUser.forEach(async review=>{
                review.by = {
                        _id:  user._id,
                        fullName: user.fullName,
                        imgUrl: user.imgUrl
                }
                await reviewService.update(review)
                } 
            )
            const projsByUser = await projService.query(filterByForProj)
            projsByUser.forEach(async proj=>{
                proj.createdBy = {
                        _id: user._id,
                        fullName: user.fullName,
                        imgUrl: user.imgUrl,
                        joinAt: user.joinAt
                }
                await projService.update(proj)
                } 
            )
        }
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}
async function add(user) {
    user._id = ObjectId(user._id); 
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    // ('filter in back service', filterBy);


    var criteria = {};
    if (filterBy.term) {
        criteria.$or = [{ userName: { $regex: filterBy.term, $options: "i" } }, { fullName: { $regex: filterBy.term, $options: "i" } }]
    }
    // if (filterBy.id) {
    //     criteria['createdBy._id'] = { $in: [filterBy.id, ObjectId(filterBy.id)] } 
    //     // criteria['createdBy._id'] = filterBy.id; 
    // }
    return criteria;
}