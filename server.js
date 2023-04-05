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
    address: "ws://"+req.get('host') + ':' + wsport,
    mnt_msg: "Server is under maintenance, try again later.",
    is_mnt: true,
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
  return clients.size;
}

wss.on('connection', (ws) => {
  const id = uuidv4();
  const signedIn = false;
  const nickname = null;
  const ip = null;
  const playerdata = { id, signedIn, nickname, ip };

  clients.set(ws, playerdata);

  log("+ " + id + " has connected, " + clients.size + " online");

  ws.on('message', (messageAsString) => {

    const message = parseJSON(messageAsString, null);

    if (message == null) return ws.send(
      JSON.stringify({ action: "error", data: "Unknown data type recieved from client." })
    );

    const player = clients.get(ws);

    message.sender = player.id;
    message.signedIn = player.signedIn;
    message.nickname = player.nickname;
    message.ip = player.ip;

    const outbound = JSON.stringify(message);

    if (message.action !== 'auth' && !player.signedIn) {
      ws.send(
        JSON.stringify({ action: "error", data: "Unauthorized, please reconnect and log in." })
      );
      return ws.close()
    }

    switch (message.action) {
      case "auth":
        ws.send(
          JSON.stringify({ action: "log", data: "Logging in as " + message.data.username + "..." })
        );
        var playerdata = {
          id: player.id,
          signedIn: true,
          nickname: message.data.username,
          ip: ""
        };
        clients.set(ws, playerdata);
        ws.send(
          JSON.stringify({ action: "auth_response", data: {success: true, nickname: message.data.username} })
        );
        ws.send(
          JSON.stringify({ action: "motd", data: `Have a nice game! ${clients.size} online` })
        );
        break;
      case "getUser":
        var playerWS = clients.get(ws);
        ws.send(
          JSON.stringify(playerWS)
        );
        break;
      default:
        break;
    }

    /*
    [...clients.keys()].forEach((client) => {
      client.send(outbound);
    });*/

  });

  ws.on("close", () => {
    const player = clients.get(ws);
    clients.delete(ws);
    log("- " + player.id + " has disconnected, " + clients.size + " online");
  });

});

function uuidv4() {
  return 'beta-xxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const parseJSON = (inputString, fallback) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  }
};

function log(data) {
  return console.log(timestamp('YYYY-MM-DD HH:mm:ss') + ' ' + data);
}

log("✔ WebSocket server is running, port " + wsport);