// const moment = require("moment");

// const botName = 'admin'

// const users = []


// const broadcastMessage = (username) => {
//     return `${username} has joined the chat`
// }
// // join chat
// const userJoin = (user) => {
//     users.push(user)
//     return user
// }

// //
// const formatMessage = (username, text) => {
//     return {
//         username,
//         text,
//         time: moment().format('h:mm:ss a')
//     }
// }

// //
// const getRoomUsers = (room) => {
//     return users.filter(user => user.room === room)
// }


// //
// const userLeave = (id) => {
//     const index = users.findIndex(user => user.id === id)
//     if (index !== -1) return users.splice(index, 1)[0]
// }

// const getCurrentUser = (id) => {
//    return users.find(user => user.id ===id)
// }

// module.exports = {
//     userLeave, getRoomUsers, formatMessage, userJoin, broadcastMessage, botName, getCurrentUser
// }