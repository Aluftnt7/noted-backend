module.exports = connectSockets
const userService = require('../user/user.service')
const ObjectId = require('mongodb').ObjectId
const UtilService = require('../../services/UtilService')

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
        socket.on('decline', async ({ notification, _id }) => {
            let sendingUser = await userService.getById(notification.userId)
            let receviengUser = await userService.getById(_id)
            let newNotification = {
                _id: ObjectId(UtilService.makeId()),
                userId: receviengUser._id,
                createdAt: Date.now(),
                userName:receviengUser.userName,
                fullName:receviengUser.fullName,
                imgUrl:receviengUser.imgUrl,
                type:'NotificationResponse',
                isApproved:false
            }  
            sendingUser.notifications.push(newNotification)
            // const updatedUser = await userService.update(sendingUser)
            io.emit(`updateUser ${sendingUser._id}`, sendingUser)
            const idx = receviengUser.notifications.findIndex(
                currNotification => currNotification._id === notification._id
            );
            receviengUser.notifications.splice(idx, 1);
            // const updatedReciveingUser = await userService.update(receviengUser)
            io.emit(`updateUserWithoutAudio ${receviengUser._id}`, { receviengUser })
        })
        socket.on('approve', async({ notification, _id }) => {

            const reciveingUser = await userService.getById(_id)
            const roomId = ObjectId(UtilService.makeId())
            reciveingUser.friends.push({
                roomId,
                _id: ObjectId(notification.userId),
                userName: notification.userName,
                fullName: notification.fullName,
                imgUrl: notification.imgUrl,
            })
            const idx = reciveingUser.notifications.findIndex(
                currNotification => currNotification._id === notification._id
            );
            reciveingUser.notifications.splice(idx, 1);
            // const updatedReciveingUser = await userService.update(reciveingUser)
            io.emit(`updateUserWithoutAudio ${reciveingUser._id}`, { user:reciveingUser })

            let newNotification = {
                _id: ObjectId(UtilService.makeId()),
                userId: ObjectId(reciveingUser.userI),
                // roomId:ObjectId(UtilService.makeId()),
                createdAt: Date.now(),
                userName: reciveingUser.userName,
                fullName: reciveingUser.fullName,
                imgUrl: reciveingUser.imgUrl,
                type: 'NotificationResponse',
                isApproved: true
            }

            const sendingUser = await userService.getById(notification.userId)
              console.log('sendingUser', sendingUser);
              
            sendingUser.friends.push({
                roomId,
                _id: ObjectId(_id),
                userName: reciveingUser.userName,
                fullName: reciveingUser.fullName,
                imgUrl: reciveingUser.imgUrl,
            })
            sendingUser.notifications.push(newNotification)
            // const updatedSendingUser = await userService.update(sendingUser)
            io.emit(`updateUser ${sendingUser._id}`, sendingUser)



            //  })

            //         await projService.update(proj);
            //         const idx = user.notifications.findIndex(
            //             currProj => currProj._id === notification._id
            //         );
            //         user.notifications.splice(idx, 1);
            //         await userService.update(user, true)
            // })
        })
    })
}