module.exports = connectSockets
const userService = require('../user/user.service')
const ObjectId = require('mongodb').ObjectId
const UtilService = require('../../services/UtilService')
const RoomService = require('../room/room.service')


function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('Add Friend', ({ friendId, _id, type, userName, fullName, imgUrl }) => {
            let notification = {
                _id: ObjectId(UtilService.makeId()),
                userId: ObjectId(_id),
                createdAt: Date.now(),
                userName,
                fullName,
                imgUrl,
                type
            }
            userService.getById(friendId)
                .then(async user => {
                    user.notifications.push(notification)
                    // const updatedUser = await userService.update(user)
                    io.emit(`updateUser ${friendId}`, user)
                })
        })
        socket.on('decline', async ({ notification, user }) => {
            let sendingUser = await userService.getById(notification.userId)
            let newNotification = {
                _id: ObjectId(UtilService.makeId()),
                userId: user._id,
                createdAt: Date.now(),
                userName: user.userName,
                fullName: user.fullName,
                imgUrl: user.imgUrl,
                type: 'NotificationResponse',
                isApproved: false
            }
            sendingUser.notifications.unshift(newNotification)
            // const updatedUser = await userService.update(sendingUser)
            io.emit(`updateUser ${sendingUser._id}`, sendingUser)
            const idx = user.notifications.findIndex(
                currNotification => currNotification._id === notification._id
            );
            user.notifications.splice(idx, 1);
            // const updatedReciveingUser = await userService.update(receviengUser)
            io.emit(`updateUserWithoutAudio ${user._id}`, { user })
        })
        socket.on('approve', async ({ notification, user }) => {
            const roomId = ObjectId(UtilService.makeId())
            user.friends.push({
                roomId,
                _id: ObjectId(notification.userId),
                userName: notification.userName,
                fullName: notification.fullName,
                imgUrl: notification.imgUrl,
            })
            const idx = user.notifications.findIndex(
                currNotification => currNotification._id === notification._id
            );
            user.notifications.splice(idx, 1);
            // const updatedReciveingUser = await userService.update(reciveingUser)
            io.emit(`updateUserWithoutAudio ${user._id}`, { user })

            let newNotification = {
                _id: ObjectId(UtilService.makeId()),
                userId: ObjectId(user._id),
                // roomId:ObjectId(UtilService.makeId()),
                createdAt: Date.now(),
                userName: user.userName,
                fullName: user.fullName,
                imgUrl: user.imgUrl,
                type: 'NotificationResponse',
                isApproved: true
            }

            const sendingUser = await userService.getById(notification.userId)
            console.log('sendingUser', sendingUser);

            sendingUser.friends.push({
                roomId,
                _id: ObjectId(user._id),
                userName: user.userName,
                fullName: user.fullName,
                imgUrl: user.imgUrl,
            })
            sendingUser.notifications.push(newNotification)
            // const updatedSendingUser = await userService.update(sendingUser)
            io.emit(`updateUser ${sendingUser._id}`, sendingUser)

            let room = {
                _id: roomId,
                notes: [],
                createdAt: Date.now()
            }
            RoomService.add(room)

        })
        socket.on('added note', async ({ room, user, friendId }) => {
            const friend = await userService.getById(friendId)
            const notification = {
                _id: ObjectId(UtilService.makeId()),
                roomId: room._id,
                userName: user.userName,
                createdAt: Date.now(),
                imgUrl: user.imgUrl,
                type: 'NotificationNote',
            }
            friend.notifications.unshift(notification)
            io.emit(`updateRoom ${room._id}`, { updatedRoom: room })
            io.emit(`updateUser ${friend._id}`, friend)

        })
        socket.on('roomUpdated', ({ room , userId  }) => {                 
            io.emit(`updateRoom ${room._id}`, { updatedRoom: room , userId })
        })
    })
}