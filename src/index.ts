import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config';
import { errorHandler } from './middleware';
import { createServer } from 'http';
import { PORT } from './constants';
import type { Server } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import cors from 'cors';

dotenv.config();

// route import
import authRoute from './routes/auth';

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

const server: Server = createServer(app);

const baseUrl: string = '/api/v1';

// routes
app.use(`${baseUrl}/auth`, authRoute);

// Custom Error Handling Middleware (catch all errors)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
