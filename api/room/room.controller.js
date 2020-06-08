const roomService = require('./room.service')

async function getById(req, res) {
    console.log('roomController', req.params.id);
    const room = await roomService.getById(req.params.id)
    res.json(room)
}

async function query(req, res) {
    const filterBy = req.query;
    const rooms = await roomService.query(filterBy)
    res.json(rooms)
}

async function remove(req, res) {
    await roomService.remove(req.params.id)
    res.end()
}


async function update(req, res) {
    const room = req.body;
    await roomService.update(room)
    res.json(room)
}


async function add(req, res) {
    const room = req.body;
    room.createdAt = Date.now();
    // const user = req.session.user;
    // if (user) {
    //     room.owners = { _id: user._id, userName: user.userName, fullName: user.fullName } //MAYBE LATER
    // }
    const savedRoom = await roomService.add(room);
    res.json(savedRoom);
}



module.exports = {
    getById,
    query,
    remove,
    update,
    add,
}