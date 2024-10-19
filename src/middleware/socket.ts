// import { Server } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import http from 'http';
// import express from 'express';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   // Enable CORS if needed
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//   },
// });

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your actual secret
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     return next(new Error('Authentication error'));
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return next(new Error('Authentication error'));
//     }

//     // Store the decoded user info in the socket object
//     socket.data.user = decoded;
//     next(); // Continue with the connection
//   });
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.data.user);

//   // Private messaging event
//   socket.on('privateMessage', async (data) => {
//     const { senderId, recipientId, message } = data;

//     // Logic to save the message and emit it to the recipient
//     io.to(recipientId).emit('receiveMessage', { senderId, message });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.data.user);
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });
