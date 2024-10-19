import { Server as SocketIoServer } from 'socket.io';

const setupSocket = (server: any) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const userSocketMap = new Map();

  const connectSocket = (socket: any) => {
    const userId = socket.handshake.query.userId;
    console.log('userId::', userId);
    console.log('socket::', socket);
    console.log('socket::', socket);

    if (userId) {
      userSocketMap.set(userId, socket.id);
    } else {
      console.log('User if not provided during connection');
    }
  };

  const disconnectSocket = (socket: any) => {
    console.log('Client disconnected');
    console.log('User Entries', userSocketMap.entries());

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.userId;
    console.log('userId::', userId);
    console.log('socket::', socket);
    console.log('socket::', socket);

    if (userId) {
      userSocketMap.set(userId, socket.id);
    } else {
      console.log('User if not provided during connection');
    }

    io.on('disconnect', () => disconnectSocket(socket));
  });
};

module.exports = { setupSocket };
