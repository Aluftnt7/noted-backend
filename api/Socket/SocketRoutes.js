module.exports = connectSockets
// const userService = require('../user/user.service')
// const projService = require('../proj/projService')
// const utilService = require('../../services/util.service')

function connectSockets(io) {
    io.on('connection', socket => {
        // socket.on('applyToProj', request => {
        //     userService.getById(request.to._id)
        //         .then(async user => {
        //             user.notifications.push(request)
        //             const updatedUser = await userService.update(user, true)
                    // io.emit(`updatedUser ${user._id}`, updatedUser)
        //         })
        // })
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