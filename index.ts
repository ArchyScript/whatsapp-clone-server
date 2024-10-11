// const express = require('express');
// const cors = require('cors');
// require('dotenv/config');
// const { createServer } = require('http')
// const { Server: SocketIoServer } = require('socket.io')
// const { userLeave, getRoomUsers, formatMessage, userJoin, getCurrentUser, botName } = require('./utils') 
// const app = express()
// // app.use(cors({
// //     origin: [process.env.ORIGIN], methods: ['GET', "POST", 'PUT', 'PATCH', "DELETE"], credentials: true
// // }))

// // API port
// const PORT = process.env.PORT || 5000

// // listen to port
// const server = createServer(app)

// // const io = new SocketIoServer(server, {
// //     cors: {
// //         origin: process.env.ORIGIN,
// //         methods: ["GET", "POST"],
// //         credentials: true
// //     },
// //     // pingTimeout: 60000,
// //     // pingInterval: 25000,

// // });

// // io.on('connection', (socket) => {
// //     socket.on('joinRoom', (payload) => {
// //         const user = userJoin({ ...payload, id: socket.id })
// //         const { username, room } = user
// //         socket.join(room)
// //         console.log('user in join room', user)
// //         socket.broadcast.to(room).emit('message', formatMessage(botName, `${username} joined the chat`))

// //         io.to(room).emit('roomUsers', {
// //             room,
// //             users: getRoomUsers(room)
// //         })
// //     })

// //     socket.on('chatMessage', (message) => {
// //         const user = getCurrentUser(socket.id)
// //         if (user) {
// //             const { username, room } = user
// //             // socket.to(room).emit('message', formatMessage(username, message))

// //             io.to(room).emit('message', formatMessage(username, message))
// //         }
// //     })

// //     socket.on('disconnect', () => {
// //         const user = userLeave(socket.id)
// //         if (user) {
// //             const { username, room } = user
// //             socket.to(room).emit('message', formatMessage(botName, `${username}  left the chat`))

// //             io.to(room).emit('roomUsers', {
// //                 room,
// //                 users: getRoomUsers(room)
// //             })
// //         }

// //     })
// // })

// app.get('/api/:test', (req, res) => {
//     console.log('id', req.query)
//     res.send('req.query')
// })

// server.listen(PORT, () => {
//     console.log(`server litening on port: ${PORT}`)
// })

// index.ts

console.log('World rerer');
