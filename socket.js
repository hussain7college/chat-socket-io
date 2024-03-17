
import { Server } from 'socket.io';
import { pushNotifi } from './notification.js';

const init = (server) => {

  // Create a new instance of Socket.io and pass the server instance
  const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

  listenToSockets(io);
};


const listenToSockets = (io) => {
  const usersSockets = [];
  // Socket.io event handling
  io.on('connection', (socket) => {
    console.log('A user connected', socket?.id);
    // Handle events from the client
    socket.on('setUsername', (data) => {
      console.log('Received setUsername:', data);
      usersSockets?.push({
        username: data.username,
        socket_id: socket?.id
      });
      // return socketID to the user
      io.in(socket?.id).emit('setUsername', socket?.id);
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      // send message to specific user
      const fromUser = usersSockets.find(user => user.socket_id === socket?.id);
      const toUsers = usersSockets.filter(user => user.username === data.to);
      for (const toUser of toUsers) { // each new tab instance has different socket
        io.in(toUser?.socket_id).emit('message', data?.message);
        // send notification to him
        pushNotifi(data?.to, `New Message from ${fromUser?.username}`, data?.message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};


export { init };