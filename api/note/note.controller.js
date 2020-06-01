const noteService = require('./note.service')

async function getById(req, res) {
    const note = await noteService.getById(req.params.id)
    res.json(note)
}

async function query(req, res) {
    const filterBy = req.query;
    const notes = await noteService.query(filterBy)
    res.json(notes)
}

async function remove(req, res) {
    await noteService.remove(req.params.id)
    res.end()
}


async function update(req, res) {
    const note = req.body;
    await noteService.update(note)
    res.json(note)
}


async function add(req, res) {
    const note = req.body;
    note.createdAt = Date.now();
    const user = req.session.user;
    if (user) {
        note.owner = { _id: user._id, userName: user.userName, fullName: user.fullName }
    }
    const savedNote = await noteService.add(note);
    res.json(savedNote);
}



module.exports = {
    getById,
    query,
    remove,
    update,
    add,
}