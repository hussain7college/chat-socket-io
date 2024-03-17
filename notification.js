const users = {}; // unlike socket, notifications doesn't care about tabs

const init = (app) => {
  app.get('/notifi', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    console.log('✅ username', req?.query?.username);
    users[req?.query?.username] = res;

    // If client closes connection, stop sending events
    res.on('close', () => {
      console.log('client dropped me');
      res.end();
    });
  });
};

const pushNotifi = (username, title, body, payload) => {
  const res = users?.[username];
  if (!res) {
    console.error('❌', 'username not found');
    return;
  }
  res.write(`data: ${JSON.stringify({ title, body, payload })}\n\n`); // res.write() instead of res.send()
};

export { init, pushNotifi };