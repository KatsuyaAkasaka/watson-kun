// import modules
require('dotenv').config();
require('pug');
const querystring = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
// const cfenv = require('cfenv');
const fs = require('fs');
const path = require('path');
const CallAPIs = require('./call_apis');
const T2S = require('./rest_text_to_speech');
const SocketIO = require('socket.io');
// const appEnv = cfenv.getAppEnv();

// create a new express server
const app = express();
const port = process.env.PORT;//appEnv.port;
const socketIO = SocketIO(app.listen(port));
let socket = null;

socketIO.on('connection', socket => {
  console.log('a user connected');
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/app', (req, res) => {
  socketIO.on('connection', (s) => {
    socket = s;
  });
  res.render('app');
});

app.post('/callback', async (req, res) => {
  const message =  req.body.events[0].message.text;

  // access to media wiki api
  const extract = await CallAPIs.mediaWiki(message);

  // access to T2S API
  await T2S.textToSpeech(extract);
  emitSendFile(socket);

  // reply to line
  await CallAPIs.lineMessaging(req.body.events[0].replyToken, extract);

  res.send('OK');
});

const emitSendFile = socket => {
  if (socket === null) return;
  const audioFilePath = `/tmp/audio.mp3`;
  fs.readFile(audioFilePath, (err, data) => {
    console.dir(data);
    socket.emit('sendFile', data);
  });
};
