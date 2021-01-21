const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const roomService = require('../room/room.service')
const logger = require('../../services/LoggerService')

const saltRounds = 10

async function login(username, password) {
    console.log('%%%%%loged in%%%%%%');
    logger.debug(`auth.service - login with username: ${username}`)
    if (!username || !password) return Promise.reject('username and password are required!')

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('USER Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('MATCH Invalid username or password')

    delete user.password;
    return user;
}


async function signup(userName, password, fullName, friends, imgUrl, notifications, joinedAt, starredNotes) {
    console.log('$$$$$$$userName', userName, 'fullName', fullName);
    if (!fullName || !password || !userName) return Promise.reject('fullName, username and password are required!')
    logger.debug(`auth.service - signup with username: ${userName}`)
    const hash = await bcrypt.hash(password, saltRounds)
    const user = await userService.add({ fullName, password: hash, userName, friends, imgUrl, notifications, joinedAt, starredNotes })
    await userService.update({ ...user, rooms: [user._id] })
    const room = {
        _id: user._id,
        notes: [],
        members: [user._id]
    }
    await roomService.add(room)
    return user
}

module.exports = {
    signup,
    login,
}