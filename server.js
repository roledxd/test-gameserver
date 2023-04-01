const express = require('express')
const WebSocket = require('ws');
const app = express()
const port = 80
const wsport = 3030

app.get('/', (req, res) => {
  res.send('API')
})

app.get('/serverdata', (req, res) => {
  res.json({
    address: req.get('host') + ':' + wsport,
    mnt_msg: "Server is under maintenance, try again later.",
    is_mnt: false,
    name: "Main server",
    motd: "TESTING"
  })
})

app.post('/signin', (req, res) => {
  res.send('auth req')
})

app.listen(port, () => {
  console.log(`HTTP running on port ${port}`)
})

//ws
const wss = new WebSocket.Server({ port: wsport });

const clients = new Map();

wss.on('connection', (ws) => {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);
  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const metadata = clients.get(ws);

    message.sender = metadata.id;
    message.color = metadata.color;
    const outbound = JSON.stringify(message);

    [...clients.keys()].forEach((client) => {
      client.send(outbound);
    });
  });
  ws.on("close", () => {
    clients.delete(ws);
  });
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log("wss up on port "+ wsport);