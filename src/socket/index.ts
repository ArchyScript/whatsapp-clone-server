import { Server as HttpServer } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { ORIGIN } from '../constants/envExport';
import { isTokenValid } from '../middleware';
import { activeUsers } from '../common/temp-db';
// import { updateUserStatus } from '../utils/userUtils';
import type { TokenPayload } from '../middleware/auth';
import { findUserById } from '../controller/auth/utils';
interface LoginData {
  token: string;
  sockeId: string;
}

export const socketConnection = (httpServer: HttpServer) => {
  const io = new SocketIoServer(httpServer, {
    cors: {
      origin: ORIGIN,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
    },
  });

  // Middleware for authentication
  // io.use(async (socket: Socket, next) => {
  //   console.log(
  //     'socket from iio middleware',
  //     socket.handshake.headers.authorization?.split(' ')[1],
  //   );

  //   try {
  //     const token = socket.handshake.headers.authorization?.split(' ')[1];
  //     if (!token) {
  //       return next(new Error('Authentication error: No token provided'));
  //     }

  //     const response = isTokenValid(token);
  //     const { valid, payload } = response;

  //     if (valid && payload) {
  //       const tokenPayload: TokenPayload = payload;
  //       const user = findUserById(tokenPayload.userId);

  //       if (!user) {
  //         return next(new Error('Authentication error: User not found'));
  //       } else {
  //         // Attach user data to socket
  //         socket.data.userId = tokenPayload.userId.toString();
  //         next();
  //       }
  //     }
  //   } catch (err) {
  //     next(new Error('Authentication error'));
  //   }
  // });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.data}`);

    socket.on('login', async (data: LoginData) => {
      console.log('data from login', data);

      // if (valid && payload) {
      //   const tokenPayload: TokenPayload = payload;
      //   activeUsers.set(socket.id, tokenPayload);
      //   // Emit success to the client
      //   socket.emit('loginSuccess', {
      //     message: 'Login successful',
      //     userId: tokenPayload.userId,
      //   });
      //   // Optionally notify others of the new active user
      //   io.emit('userStatusUpdated', {
      //     userId: tokenPayload.userId,
      //     isActive: true,
      //   });
      // } else {
      //   return socket.emit('loginError', 'Invalid token');
      // }
    });

    socket.on('sendMessage', (messageData: any) => {
      const { username, text } = messageData;
      // io.to(message.receiver)

      console.log('messageData', messageData);

      io.emit('receiveMessage', text);
    });

    // Handle disconnection, mark user as inactive
    socket.on('disconnect', async () => {
      const user = activeUsers.get(socket.id);

      // if (user) {
      //   console.log(`User disconnected: ${user.userId}`);
      //   activeUsers.delete(socket.id);

      //   // Optionally notify others of the user's offline status
      //   io.emit('userStatusUpdated', {
      //     userId: user.userId,
      //     isActive: false,
      //   });
      // }
    });
  });

  return io;
};
// const io = new SocketIoServer(server, {
//   cors: {
//     origin: ORIGIN,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
//   pingTimeout: 60000,
//   pingInterval: 25000,
// });

// const userSocketMap = new Map();

// const connectSocket = (socket: any) => {
//   const userId = socket.handshake.query.userId;
//   console.log('userId::', userId);
//   console.log('socket::', socket);
//   console.log('socket::', socket);

//   if (userId) {
//     userSocketMap.set(userId, socket.id);
//   } else {
//     console.log('User if not provided during connection');
//   }
// };

// const disconnectSocket = (socket: any) => {
//   console.log('Client disconnected');
//   console.log('User Entries', userSocketMap.entries());

//   for (const [userId, socketId] of userSocketMap.entries()) {
//     if (socketId === socket.id) {
//       userSocketMap.delete(userId);
//       break;
//     }
//   }
// };}
// };
