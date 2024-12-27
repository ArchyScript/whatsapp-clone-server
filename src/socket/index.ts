

import { Server as HttpServer } from "http"; 
import { Server as SocketIoServer,Socket } from 'socket.io';
import { ORIGIN } from '../constants/envExport';
// import { updateUserStatus } from '../utils/userUtils';

export const socketConnection  = (httpServer: HttpServer) => {  
  const io = new SocketIoServer(httpServer, {
    cors: {
      origin: ORIGIN  , 
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket: Socket) => { 
    const userId = socket.handshake.query.userId;
    console.log('userId::', userId);  
    console.log('server',new Date().toLocaleString());
  console.log("server milli", new Date().getMilliseconds())

    // Listen for 'login' event and mark user as active
    socket.on('login', async (userId: string) => {
    console.log('server login',new Date().toLocaleString());
  console.log("server login milli", new Date().getMilliseconds())

      try {
        // Update user status to active in the database
        // await updateUserStatus(userId, true);
        console.log(`User ${userId} is now active`);
        
        // Emit active status to other clients if needed
        // io.emit('userStatusUpdated', { userId, isActive: true });
      } catch (err) {
        console.error('Error updating user status:', err);
      }
    });

    // Handle disconnection, mark user as inactive
    socket.on('disconnect', async () => {
      try {
        // You could also use socket.userId if you've stored it on connection
        const userId = socket.handshake.query.userId as string;
        // await updateUserStatus(userId, false);
        console.log(`User ${userId} disconnected `);

        // Emit updated status to other clients
        
        // io.emit('userStatusUpdated', { userId, isActive: false });
        socket.on('logout', (userId) => {
  // activeUsers.delete(userId);
  console.log(`${userId} logged out`);
  
  // Notify others
  // io.emit('userStatusUpdated', { userId, isActive: false });
});
      } catch (err) {
        console.error('Error setting user inactive:', err);
      }
    }); 
    }); 

    return io
  } 
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
  // }; 
 
