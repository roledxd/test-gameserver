const express = require('express')
const WebSocket = require('ws');
const app = express()
const port = 80
const wsport = 3030

const timestamp = require('time-stamp');

console.log(`${timestamp('YYYY-MM-DD HH:mm:ss')} Server launch requested`)

const cors = require('cors');
const helmet = require('helmet');
const router = express.Router();

require('./modules/mongodb')

app.use(helmet())
app.use(cors({
  origin: '*'
}))

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-type,Accept,X-Access-Token,X-Key");

  res.contentType('text/html');

  next();
});

app.all('/server/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-type,Accept,X-Access-Token,X-Key");

  res.contentType('application/json');

  next();
});


app.get('/', (req, res) => {
  res.send('now playing: ' + onlineCount())
})

app.get('/server', (req, res) => {
  res.json({
    address: req.get('host') + ':' + wsport,
    mnt_msg: "Server is under maintenance, try again later.",
    is_mnt: false,
    name: "Main server",
    motd: "TESTING",
    online: onlineCount()
  })
})

app.listen(port, () => {
  console.log(`${timestamp('YYYY-MM-DD HH:mm:ss')} ✔ HTTP server is running, port ${port}`)
})

//ws
const wss = new WebSocket.Server({ port: wsport });

const clients = new Map();

const planets = new Map();

function onlineCount() {
  return clients.entries.length;
}

wss.on('connection', (ws) => {
  const id = uuidv4();
  const signedIn = false;
  const nickname = null;
  const ip = null;
  const playerdata = { id, signedIn, nickname, ip };

  clients.set(ws, playerdata);

  ws.on('message', (messageAsString) => {

    const message = JSON.parse(messageAsString);
    const playerdata = clients.get(ws);

    message.sender = playerdata.id;
    message.signedIn = playerdata.signedIn;
    message.nickname = playerdata.nickname;
    message.ip = playerdata.ip;

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
  return 'xxxxxxxx-xxxx-rled-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log(timestamp('YYYY-MM-DD HH:mm:ss') + " ✔ WebSocket server is running, port " + wsport);