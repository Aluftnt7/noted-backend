module.exports = connectSockets;
const userService = require("../user/user.service");
const ObjectId = require("mongodb").ObjectId;
const UtilService = require("../../services/UtilService");
const RoomService = require("../room/room.service");
const { add } = require("../user/user.service");

function connectSockets(io) {
  io.on("connection", (socket) => {

    socket.on("Add Friend", async ({ notification, userId, friendId }) => {
      notification._id = ObjectId(UtilService.makeId());
      notification.userId = ObjectId(userId);
      notification.createdAt = Date.now();
      let user = await userService.getById(friendId);
      user.notifications.unshift(notification);
      const updatedUser = await userService.update(user);
      io.emit(`updateUser ${updatedUser._id}`, updatedUser);
    });
////////FRIEND REQ DECLINE
    socket.on("decline", async ({ notification, user }) => {
      let sendingUser = await userService.getById(notification.userId);
      let newNotification = {
        _id: ObjectId(UtilService.makeId()),
        userId: user._id,
        createdAt: Date.now(),
        userName: user.userName,
        fullName: user.fullName,
        imgUrl: user.imgUrl,
        type: "NotificationResponse",
        isApproved: false,
      };
      sendingUser.notifications.unshift(newNotification);
      await userService.update(sendingUser);
      io.emit(`updateUser ${sendingUser._id}`, sendingUser);
      const idx = user.notifications.findIndex(
        (currNotification) => currNotification._id === notification._id,
      );
      user.notifications.splice(idx, 1);
      const updatedReciveingUser = await userService.update(user);
      io.emit(`updateUserWithoutAudio ${user._id}`, updatedReciveingUser);
    });
////////FRIEND REQ APPROVE
    socket.on("approve", async ({ notification, user }) => {
      const roomId = ObjectId(UtilService.makeId());
      user.friends.push({
        roomId,
        _id: ObjectId(notification.userId),
        userName: notification.userName,
        fullName: notification.fullName,
        imgUrl: notification.imgUrl,
      });
      user.rooms.push(roomId)//NEW
      const updatedReciveingUser = await userService.update(user);
      io.emit(`updateUserWithoutAudio ${user._id}`, updatedReciveingUser);

      let newNotification = {
        _id: ObjectId(UtilService.makeId()),
        userId: ObjectId(user._id),
        createdAt: Date.now(),
        userName: user.userName,
        fullName: user.fullName,
        imgUrl: user.imgUrl,
        type: "NotificationResponse",
        isApproved: true,
      };

      const sendingUser = await userService.getById(notification.userId);

      sendingUser.friends.push({
        roomId,
        _id: ObjectId(user._id),
        userName: user.userName,
        fullName: user.fullName,
        imgUrl: user.imgUrl,
      });
      sendingUser.notifications.unshift(newNotification);
      sendingUser.rooms.push(roomId)//NEW
      await userService.update(sendingUser);
      io.emit(`updateUser ${sendingUser._id}`, sendingUser);

      let room = {
        _id: roomId,
        notes: [],
        members: [user._id, sendingUser._id],
      };
      RoomService.add(room);
    });
////////NOTE ADDED
    socket.on("added note", async ({ room, user, friendId }) => {
      const friend = await userService.getById(friendId);
      const notification = {
        _id: ObjectId(UtilService.makeId()),
        roomId: room._id,
        userName: user.userName,
        createdAt: Date.now(),
        imgUrl: user.imgUrl,
        type: "NotificationNote",
      };
      friend.notifications.unshift(notification);
      const updatedSendingUser = await userService.update(friend);
      io.emit(`updateRoom ${room._id}`, {
        updatedRoom: room,
        userId: user._id,
      });
      io.emit(`updateUser ${friend._id}`, updatedSendingUser);
    });


////////ROOM UPDATED
    socket.on("roomUpdated", ({ room, userId }) => {
      io.emit(`updateRoom ${room._id}`, { updatedRoom: room, userId });
    });


  });
}
