function gameStart(){
	redChess.init();
	blackChess.init();
	
	$(".restart").on("click", function(){
		// chessBoardDestroy();
		// ox = null, oy = null;  //original x,y when chosen
		// matrix = matrixInit();
		// lattice = null;
		// moveNow = "Red";  //set first hand
		// redChess = new chess($chessgrid, "Red", 0);
		// blackChess = new chess($chessgrid, "Black", 1);
		// activeChess = redChess;
		// redChess.init();
		// blackChess.init();
		// $chessman = $(".chessman");
		location.reload();
	});

	// choose a chessman
	$(".chessman").on("click", function(){
		if($(this).attr("data-color") == activeChess.color && activeSide){
			if(lattice){
				activeChess.pathToggle(lattice); // close the available path
				lattice = null;	ox = null; oy = null;
			}else{
				ox = parseInt($(this).attr("data-x"));
				oy = parseInt($(this).attr("data-y"));
				var name = $(this).attr("id");
				lattice = activeChess.takeAction(ox,oy,name,matrix);
				activeChess.pathToggle(lattice);  // show the available path
			}
		}
	});

	// move chessman
	$chessgrid.find("td").on("click", function(){
		if(lattice){
			var x = parseInt($(this).attr("data-x"));
			var y = parseInt($(this).attr("data-y"));
			var temp=[]; // search the lattice to make the location legal
			for(var i=0; i<lattice.length; i++){
				temp.push(lattice[i].toString().trim());
			}
			if((ox!=x || oy!=y) && temp.indexOf(y+","+x)>-1){
				activeChess.moveChessman(ox,oy,x,y);
				//send movement to server
				iosocket.send([ox,oy,x,y]);
				matrix[y][x] = matrix[oy][ox];
				matrix[oy][ox] = 0;
				activeChess.pathToggle(lattice);
				//activeChess = (activeChess.color=="Red")?blackChess:redChess;
				lattice = null;	ox = null; oy = null;
				activeSide = false;
			}
		}
	});
}

function matrixInit(){
	return [[2,2,2,2,2,2,2,2,2],
			[0,0,0,0,0,0,0,0,0],
			[0,2,0,0,0,0,0,2,0],
			[2,0,2,0,2,0,2,0,2],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[1,0,1,0,1,0,1,0,1],
			[0,1,0,0,0,0,0,1,0],
			[0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1],
			];
}

function chessBoardDestroy(){
	$("#chessGrid td").empty();
}