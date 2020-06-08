module.exports = connectSockets
const userService = require('../user/user.service')
const ObjectId = require('mongodb').ObjectId
const UtilService = require('../../services/UtilService')

// const projService = require('../proj/projService')
// const utilService = require('../../services/util.service')

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('Add Friend', ({ friendId, _id, type, userName, fullName, imgUrl }) => {            
            const notification = {
                _id:ObjectId(UtilService.makeId()),
                userId:ObjectId(_id),
                // roomId:ObjectId(UtilService.makeId()),
                createdAt: Date.now(),
                userName,
                fullName,
                imgUrl,
                type
            }

            userService.getById(friendId)
                .then(async user => {
                    console.log(user);
                    user.notifications.push(notification)
                    const updatedUser = await userService.update(user, true)                    
                    io.emit(`updateUser ${friendId}`, updatedUser)
                })
        })
        socket.on('decline', notification => {
            userService.getById(notification.userId)
                .then(async user => {
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
                })
        })
        socket.on('approve', async ({notification, _id}) => {  
            
            const reciveingUser = await userService.getById(_id)               
            
                  const roomId = ObjectId(UtilService.makeId())
                  reciveingUser.friends.push({
                      roomId,
                 _id:ObjectId(notification.userId),
                 userName:notification.userName,
                 fullName:notification.fullName,
                 imgUrl:notification.imgUrl,
                  })
                  const idx = reciveingUser.notifications.findIndex(
                        currNotification => currNotification._id === notification._id
                      );
                      reciveingUser.notifications.splice(idx, 1);
                userService.update(reciveingUser, true)
            
                const sendingUser = await userService.getById(notification.userId)
                
                //    
                // user.notifications.push({})
                sendingUser.friends.push({
                    roomId,
                    _id:ObjectId(_id),
                    userName:reciveingUser.userName,
                    fullName:reciveingUser.fullName,
                    imgUrl:reciveingUser.imgUrl,
                })
                userService.update(sendingUser, true)
                console.log('notification',sendingUser);
                
                
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