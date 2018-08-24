// import modules
const express = require('express');
const T2S = require('./rest_text_to_speech');
const app = express();
const server = app.listen(3000);
const fs = require('fs');
const path = require('path');
require('pug');

const SocketIO = require('socket.io');
const socketIO = SocketIO(server);
let socket = null;


// const text = CallAPIs.mediaWiki('リンゴ');
// console.dir(text);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.send('ok');
});

// app.get('/app', (req, res) => {
//   const audioFilePath = __dirname + "/public/audio.mp3";
//   fs.readFile(audioFilePath, function(err, data){
//     socketIO.on('connection', (socket) => {
//       console.log('a user connected');
//       console.dir(err);
//       socket.emit('sendFile', data);
//     });
//   });
//   res.render('app');
// });

app.get('/app', (req, res) => {
  socketIO.on('connection', (s) => {
    socket = s;
  });
  res.render('app');
});

app.get('/line', (req, res) => {
  emitSendFile(socket);
  res.send('OK');
});

const emitSendFile = (socket) => {
  if (socket === null) return;
  const audioFilePath = `${__dirname}/public/audio.mp3`;
  let read = fs.createReadStream(audioFilePath, {buffersize: 10});
  read.on('data', data => {
    socket.emit('sendFile', data);
  });
};

(async () => {
  T2S.textToSpeech("オレンジ（林檎、学名：Malus pumila）は、バラ科リンゴ属の落葉高木樹。");
})();
