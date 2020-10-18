const userService = require('./user.service')

async function getUser(req, res) {
    const user = await userService.getById(req.params.id)
    res.send(user)
}

async function getUsers(req, res) {
    const users = await userService.query(req.query)
    if (req.query.count) res.json(users)
    else res.send(users)
}

async function deleteUser(req, res) {
    res.end()
}

async function updateUser(req, res) {
    const user = req.body;
    const updatedUser = await userService.update(user)
    res.send(updatedUser)
}
async function updateImgAtContacts(req, res) {
    const { userId, imgUrl } = req.body;
    const user = await userService.updateImgAtContacts(userId, imgUrl)
    res.send(user)
}

async function toggleStarredNote(req, res) {
    const { userId, roomId, noteId } = req.body;
    const user = await userService.toggleStarredNote(userId, roomId, noteId)
    res.send(user)
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    updateImgAtContacts,
    toggleStarredNote
}