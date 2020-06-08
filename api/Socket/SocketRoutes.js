module.exports = connectSockets
const userService = require('../user/user.service')
const ObjectId = require('mongodb').ObjectId
const UtilService = require('../../services/UtilService')

// const projService = require('../proj/projService')
// const utilService = require('../../services/util.service')

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('Add Friend', ({friendId, _id, type, userName, fullName, imgUrl}) => {
            
            const notification = {
                _id:ObjectId(UtilService.makeId()),
                userId:ObjectId(_id),
                // roomId:ObjectId(UtilService.makeId()),
                createdAt:Date.now(),
                userName,
                fullName,
                imgUrl,
                type
            }
            console.log('nofitifiaifasdasjjasjasjjasjjasjas444',notification);
            
            
            userService.getById(friendId)
                .then(async user => {
                    console.log(user);
                    user.notifications.push(notification)
                    const updatedUser = await userService.update(user, true)
                    io.emit(`updateUser ${friendId}`, updatedUser)
                })
        })
        // socket.on('decline', notification => {
        //     userService.getById(notification.to._id)
        //         .then(async user => {
        //             user.notifications.push(notification)
        //             const updatedUser = await userService.update(user, true)
        //             io.emit(`updatedUser ${user._id}`, updatedUser)
        //         })
        //     userService.getById(notification.from._id)
        //         .then(async user => {
        //             const idx = user.notifications.findIndex(
        //                 currProj => currProj._id === notification._id
        //               );
        //             user.notifications.splice(idx, 1);
        //             await userService.update(user, true)
        //         })
        // })
        // socket.on('approve', notification => {
        //     userService.getById(notification.to._id)
        //     .then(async user => {
        //         user.notifications.push(notification)
        //         const updatedUser = await userService.update(user, true)
        //         io.emit(`updatedUser ${user._id}`, updatedUser)
        //     })
        //     userService.getById(notification.from._id)
        //         .then(async user => {
        //             const proj = await projService.getById(notification.proj._id);
        //             proj.membersApplyed.push(notification.from);
        //             console.log('notification', notification);
                    
        //             proj.membersNeeded -= notification.memebersApllied;
        //             await projService.update(proj);
        //             const idx = user.notifications.findIndex(
        //                 currProj => currProj._id === notification._id
        //             );
        //             user.notifications.splice(idx, 1);
        //             await userService.update(user, true)
        //         })
        // })  
    })
}