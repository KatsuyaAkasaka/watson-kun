$(function(){
  const audioContext = window.AudioContext || window.webkitAudioContext;
  const context = new audioContext();
  const socket = io.connect();   //クライアントが 'http://localhost' にソケット接続を要求

  const playSound = buffer => {
    const source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  };

  socket.on('connect', () => {   //サーバがクライアントとの接続を確立すると、クライアントで 'connect' イベントが発生
    console.log("connected");
    socket.on('sendFile', data => {
      console.dir(data);
      context.decodeAudioData(data, playSound, err => { console.log(err); });
    });
  });
});
