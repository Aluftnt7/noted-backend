const roomService = require("./room.service");

async function getById(req, res) {
    const room = await roomService.getById(req.query);
    res.json(room);
}


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
    const savedRoom = await roomService.add(room);
    res.json(savedRoom);
}

async function checkIsValidUser(req, res) {
    const { userId, roomId } = req.body;
    const isValid = await roomService.checkIsValidUser(userId, roomId);
    res.json(isValid);
}


module.exports = {
    getById,
    query,
    remove,
    update,
    add,
    checkIsValidUser,
};
