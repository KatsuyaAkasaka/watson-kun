require('dotenv').config();
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const fs = require('fs');

const textToSpeech = new TextToSpeechV1({
  username: process.env.IBM_T2S_TOKEN,
  password: process.env.IBM_T2S_SECRET
});

module.exports = {
  TextToSpeechV1Object: textToSpeech,
  textToSpeech: async (text, socket) => {
    const synthesizeParams = {
      text,
      accept: 'audio/mp3',
      voice: 'ja-JP_EmiVoice'
    };

    // Pipe the synthesized text to a file.
    textToSpeech.synthesize(synthesizeParams).on('error', error => {
      console.log(error);
    }).pipe(fs.createWriteStream(`./public/audio.mp3`))
    .on('finish', () => {
      emitSendFile(socket);
    });
  }
}

const emitSendFile = socket => {
  if (socket === null) return;
  const audioFilePath = `./public/audio.mp3`;
  fs.readFile(audioFilePath, (err, data) => {
    console.dir(data);
    socket.emit('sendFile', data);
  });
};
