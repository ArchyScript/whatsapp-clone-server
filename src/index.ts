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

const io = new SocketIoServer(server);

// routes
app.use(`${baseUrl}/auth`, authRoute);

// Custom Error Handling Middleware (catch all errors)
app.use(errorHandler);

 
// Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on PORT: ${PORT}`);
// });

socketConnection(io);

server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`); 
});
