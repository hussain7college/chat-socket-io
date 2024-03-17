import express from 'express';
import http from 'http';
import cors from 'cors';
import *  as socket from './socket.js';
import *  as notifi from './notification.js';

const app = express();
// Create a server instance
const server = http.createServer(app);

// enable cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is home page.");
});

// init chat socket
socket.init(server);

// init notification
notifi.init(app);

// PORT
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});


