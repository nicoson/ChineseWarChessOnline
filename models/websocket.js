var socketio = require('socket.io')();  //socket.io
/**
 * websocket: broadcast event from client.
 */
var counter = 0;
var gameStatus = false;
var gameData = [];
var actSide = true;

socketio.on('connection', function (socket) {
  socket.on('message', function (msg) {
    console.log('receive ', msg);
    console.log(typeof(msg));
    //将信息发送给其他客户端
    if(typeof(msg) == "string"){
      if(msg == "start"){gameStatus = true;}
      socket.broadcast.emit('message', msg);
    }else{
      socket.broadcast.emit('message', coordReverse(msg));
      //save game data for watcher
      gameData.push(actSide?msg:coordReverse(msg));
      actSide = !actSide;
    }

  });

  socket.on("connect", function(){
    counter++;
    console.log(counter);
  });

  socket.on("disconnect", function(){
    counter--;
    console.log(counter);
  });
});

function coordReverse(coord) {
  coord[0] = 8-coord[0];
  coord[1] = 9-coord[1];
  coord[2] = 8-coord[2];
  coord[3] = 9-coord[3];
  return coord;
}

module.exports.listen = function(server){
	return socketio.listen(server);
}