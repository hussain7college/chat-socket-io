import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

// enable cors
app.use(cors());

// Create a server instance
const server = http.createServer(app);

// Create a new instance of Socket.io and pass the server instance
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});


const usersSockets = [];


// Socket.io event handling
io.on('connection', (socket) => {
  const socketId = socket?.id;
  console.log('A user connected', socketId);

  // Handle events from the client
  socket.on('setUsername', (data) => {
    console.log('Received setUsername:', data);
    usersSockets?.push({
      username: data.username,
      socket_id: socketId
    });
    // return socketID to the user
    io.in(socketId).emit('setUsername', socketId);
  });

  socket.on('message', (data) => {
    console.log('Received message:', data);
    // send message to specific user
    const sentUser = usersSockets.find(user => user.username === data.to);
    io.in(sentUser?.socket_id).emit('message', data?.message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get("/", (req, res) => {
  res.send("This is home page.");
});

// PORT
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});


