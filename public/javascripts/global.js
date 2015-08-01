var iosocket = io.connect(); //websocket

// chess initial
var $chessgrid = $("#chessGrid");
var ox, oy;	//original x,y when chosen
var redChess = new chess($chessgrid, "Red", 0);
var blackChess = new chess($chessgrid, "Black", 1);
var matrix = matrixInit();
var lattice;
var moveNow = "Red";  //set first hand
var activeChess = redChess;  // set the active pointer
// var $chessman = $(".chessman");

// control initial
var activeSide = true;