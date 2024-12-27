import type { Server } from 'http';
import { createServer } from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config';
import { errorHandler } from './middleware';
import { PORT } from './constants';
import { Server as SocketIoServer } from 'socket.io';
import cors from 'cors';
import {socketConnection}  from './socket';
import { validateToken } from './middleware/auth';

// 
const baseUrl: string = '/api/v1';

dotenv.config();   

// route import
import authRoute from './routes/auth';

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

const server: Server = createServer(app); 

// const io = new SocketIoServer(server);

// routes
app.use(`${baseUrl}/auth`, authRoute);

// Custom Error Handling Middleware (catch all errors)
app.use(errorHandler);

  

// const io =  socketConnection(server);
// io.use((socket, next) => {
//   const token = socket.handshake.headers.authorization?.split(' ')[1]; // Extract token
//   if (validateToken(token)) {
//     // Token is valid; attach user info to the socket
//     const userId = decodeToken(token).userId;
//     socket.userId = userId; // Save userId for later use
//     next();
//   } else {
//     next(new Error('Authentication error'));
//   }
// });
// // console.log('io', io);


server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`); 
});
