function chess(chessgrid,color,pos){
	this.chessgrid = chessgrid;
	this.color = color;
	this.position = pos;  // 1:down, 2:upper

	this.init = function(){
		var i=0, j=0;
		
		// initialized the chessGrid table
		for(i=0; i<10; i++){
			var chessgridrow = this.chessgrid.find("tr").eq(i).find("td");
			for(j=0; j<9; j++){
				chessgridrow.eq(j).attr({
					"data-x":j,
					"data-y":i
				});
			}
		}

		// initialized the chessman
		var redman = ["車","馬","相","仕","帥","兵","砲"];
		var blackman = ["車","馬","相","士","將","卒","炮"];
		var downPos = [[0, 9],[1, 9],[2, 9],[3, 9],[4, 9],[5, 9],[6, 9],[7, 9],
						[8, 9],[0, 6],[2, 6],[4, 6],[6, 6],[8, 6],[1, 7],[7, 7]];
		var upperPos = [[0, 0],[1, 0],[2, 0],[3, 0],[4, 0],[5, 0],[6, 0],[7, 0],
							[8, 0],[0, 3],[2, 3],[4, 3],[6, 3],[8, 3],[1, 2],[7, 2]];
		var role, pos;

		if(this.color === "Red"){role = redman;}else{role = blackman;}
		if(this.position === 0){pos = downPos;}else{pos = upperPos;}

		this.chessman(pos[0], "juL", role[0]);
		this.chessman(pos[1], "maL", role[1]);
		this.chessman(pos[2], "xiangL", role[2]);
		this.chessman(pos[3], "shiL", role[3]);
		this.chessman(pos[4], "shuai", role[4]);
		this.chessman(pos[5], "shiR", role[3]);
		this.chessman(pos[6], "xiangR", role[2]);
		this.chessman(pos[7], "maR", role[1]);
		this.chessman(pos[8], "juR", role[0]);
		this.chessman(pos[9], "bing1", role[5]);
		this.chessman(pos[10], "bing2", role[5]);
		this.chessman(pos[11], "bing3", role[5]);
		this.chessman(pos[12], "bing4", role[5]);
		this.chessman(pos[13], "bing5", role[5]);
		this.chessman(pos[14], "paoL", role[6]);
		this.chessman(pos[15], "paoR", role[6]);
	}

	this.chessman = function(pos,name1,name2){
		var x = pos[0], y = pos[1];
		var local = this.chessgrid.find("tr").eq(y).children("td").eq(x);
		local.append("<div id="+name1+" data-x="+x+" data-y="+y+" data-color="+this.color+"></div>");
		local.children().addClass("chessman");
		local.children().append("<div>"+name2+"<div>");
		local.children().children().addClass("chessmanInner"+this.color);
	}

	this.takeAction = function(x,y,name,matrix){
		switch(true){
			case Boolean(name.match("ju")):
			return this.juAction(x,y,matrix);
			case Boolean(name.match("ma")):
			return this.maAction(x,y,matrix);
			case Boolean(name.match("xiang")):
			return this.position?this.xiangUpAction(x,y,matrix):this.xiangAction(x,y,matrix);
			case Boolean(name.match("shi")):
			return this.position?this.shiUpAction(x,y,matrix):this.shiAction(x,y,matrix);
			case Boolean(name.match("shuai")):
			return this.position?this.shuaiUpAction(x,y,matrix):this.shuaiAction(x,y,matrix);
			case Boolean(name.match("pao")):
			return this.paoAction(x,y,matrix);
			case Boolean(name.match("bing")):
			return this.position?this.bingUpAction(x,y,matrix):this.bingAction(x,y,matrix);
			default:
			console.log(name);
		}
	}

	this.pathToggle = function(lattice){
		var chessgridrow = this.chessgrid.find("tr");
		for(var i=0; i<lattice.length; i++){
			chessgridrow.eq(lattice[i][0]).find("td").eq(lattice[i][1]).toggleClass("chessPath");
		}
	}

	this.moveChessman = function(ox,oy,x,y){
		var removeChess = this.chessgrid.find("tr").eq(y).find("td").eq(x);
		var ko = false;
		if(removeChess.children().attr("id") == "shuai") ko = true;
		removeChess.empty().append(
			this.chessgrid.find("tr").eq(oy).find("td").eq(ox).children().attr({"data-y": y,"data-x": x}).detach()
			);
		if(ko){
			$(".gameOver>div>h3").html(this.color+" win!!!");
			$(".gameOver").css({"display":"block"});
		}
	}

	this.juAction = function(x,y,matrix){
		var i, j;
		var availLattice = [[y,x]];
		for(i=x-1;i>-1;i--){
			if(matrix[y][i] == 0){
				availLattice.push([y, i]); 
			}else{
				if(matrix[y][i] == (2-this.position)){
					availLattice.push([y, i]);
				}
				break;
			}
		}
		for(i=x+1;i<9;i++){
			if(matrix[y][i] == 0){
				availLattice.push([y, i]); 
			}else{
				if(matrix[y][i] == (2-this.position)){
					availLattice.push([y, i]);
				}
				break;
			}
		}
		for(j=y-1;j>-1;j--){
			if(matrix[j][x] == 0){
				availLattice.push([j, x]); 
			}else{
				if(matrix[j][x] == (2-this.position)){
					availLattice.push([j, x]);
				}
				break;
			}
		}
		for(j=y+1;j<10;j++){
			if(matrix[j][x] == 0){
				availLattice.push([j, x]); 
			}else{
				if(matrix[j][x] == (2-this.position)){
					availLattice.push([j, x]);
				}
				break;
			}
		}
		return availLattice;
	}

	this.maAction = function(x,y,matrix){
		var availLattice = [[y,x]];
		// up direction
		if(y>1){
			if(matrix[y-1][x] == 0){
				if(x>0){	// upper left
					if(matrix[y-2][x-1]!=(this.position+1)){
						availLattice.push([y-2, x-1]);
					}
				}
				if(x<8){	// upper right
					if(matrix[y-2][x+1]!=(this.position+1)){
						availLattice.push([y-2, x+1]);
					}
				}
			}
		}

		// down direction
		if(y<8){
			if(matrix[y+1][x] == 0){
				if(x>0){	// down left
					if(matrix[y+2][x-1]!=(this.position+1)){
						availLattice.push([y+2, x-1]);
					}
				}
				if(x<8){	//down right
					if(matrix[y+2][x+1]!=(this.position+1)){
						availLattice.push([y+2, x+1]);
					}
				}
			}
		}
		
		// left direction
		if(x>1){
			if(matrix[y][x-1] == 0){
				if(y>0){
					if(matrix[y-1][x-2]!=(this.position+1)){
						availLattice.push([y-1, x-2]);
					}
				}
				if(y<9){
					if(matrix[y+1][x-2]!=(this.position+1)){
						availLattice.push([y+1, x-2]);
					}
				}
			}
		}

		// right direction
		if(x<7){
			if(matrix[y][x+1] == 0){
				if(y>0){
					if(matrix[y-1][x+2]!=(this.position+1)){
						availLattice.push([y-1, x+2]);
					}
				}
				if(y<9){
					if(matrix[y+1][x+2]!=(this.position+1)){
						availLattice.push([y+1, x+2]);
					}
				}
			}
		}
		
		return availLattice;
	}

	this.xiangAction = function(x,y,matrix){
		var availLattice = [[y,x]];
		
		if(y-2>4){	//upper
			if(x-2>-1){	//up-left
				if(matrix[y-1][x-1]==0){
					if(matrix[y-2][x-2]!=(this.position+1)){
						availLattice.push([y-2,x-2]);
					}
				}
			}
			if(x+2<9){ //up-right
				if(matrix[y-1][x+1]==0){
					if(matrix[y-2][x+2]!=(this.position+1)){
						availLattice.push([y-2,x+2]);
					}
				}
			}
		}
		if(y+2<10){
			if(x-2>-1){	//down-left
				if(matrix[y+1][x-1]==0){
					if(matrix[y+2][x-2]!=(this.position+1)){
						availLattice.push([y+2,x-2]);
					}
				}
			}
			if(x+2<9){ //down-right
				if(matrix[y+1][x+1]==0){
					if(matrix[y+2][x+2]!=(this.position+1)){
						availLattice.push([y+2,x+2]);
					}
				}
			}
		}

		return availLattice;
	}

	this.xiangUpAction = function(x,y,matrix){
		var availLattice = [[y,x]];
		
		if(y>0){	//upper
			if(x-2>-1){	//up-left
				if(matrix[y-1][x-1]==0){
					if(matrix[y-2][x-2]!=(this.position+1)){
						availLattice.push([y-2,x-2]);
					}
				}
			}
			if(x+2<9){ //up-right
				if(matrix[y-1][x+1]==0){
					if(matrix[y-2][x+2]!=(this.position+1)){
						availLattice.push([y-2,x+2]);
					}
				}
			}
		}
		if(y+2<5){
			if(x-2>-1){	//down-left
				if(matrix[y+1][x-1]==0){
					if(matrix[y+2][x-2]!=(this.position+1)){
						availLattice.push([y+2,x-2]);
					}
				}
			}
			if(x+2<9){ //down-right
				if(matrix[y+1][x+1]==0){
					if(matrix[y+2][x+2]!=(this.position+1)){
						availLattice.push([y+2,x+2]);
					}
				}
			}
		}

		return availLattice;
	}

	this.shiAction = function(x,y,matrix){
		var availLattice = [[y,x]];

		if(y-1>6){	//up
			if(x-1>2){	// up-left
				if(matrix[y-1][x-1]!=(this.position+1)){
					availLattice.push([y-1,x-1]);
				}
			}
			if(x+1<6){	// up-right
				if(matrix[y-1][x+1]!=(this.position+1)){
					availLattice.push([y-1,x+1]);
				}
			}
		}
		if(y+1<10){	//down
			if(x-1>2){	// down-left
				if(matrix[y+1][x-1]!=(this.position+1)){
					availLattice.push([y+1,x-1]);
				}
			}
			if(x+1<6){	// down-left
				if(matrix[y+1][x+1]!=(this.position+1)){
					availLattice.push([y+1,x+1]);
				}
			}
		}
		return availLattice;
	}

	this.shiUpAction = function(x,y,matrix){
		var availLattice = [[y,x]];

		if(y>0){	//up
			if(x-1>2){	// up-left
				if(matrix[y-1][x-1]!=(this.position+1)){
					availLattice.push([y-1,x-1]);
				}
			}
			if(x+1<6){	// up-right
				if(matrix[y-1][x+1]!=(this.position+1)){
					availLattice.push([y-1,x+1]);
				}
			}
		}
		if(y+1<3){	//down
			if(x-1>2){	// down-left
				if(matrix[y+1][x-1]!=(this.position+1)){
					availLattice.push([y+1,x-1]);
				}
			}
			if(x+1<6){	// down-left
				if(matrix[y+1][x+1]!=(this.position+1)){
					availLattice.push([y+1,x+1]);
				}
			}
		}
		return availLattice;
	}

	this.shuaiAction = function(x,y,matrix){
		var availLattice = [[y,x]];
		if(y-1>6){	// up
			if(matrix[y-1][x]!=(this.position+1)){
				availLattice.push([y-1,x]);
			}
		}

		if(y+1<10){	// down
			if(matrix[y+1][x]!=(this.position+1)){
				availLattice.push([y+1,x]);
			}
		}
		
		if(x-1>2){	// left
			if(matrix[y][x-1]!=(this.position+1)){
				availLattice.push([y,x-1]);
			}
		}

		if(x+1<6){	// right
			if(matrix[y][x+1]!=(this.position+1)){
				availLattice.push([y,x+1]);
			}
		}
		
		return availLattice;
	}

	this.shuaiUpAction = function(x,y,matrix){
		var availLattice = [[y,x]];
		if(y>0){	// up
			if(matrix[y-1][x]!=(this.position+1)){
				availLattice.push([y-1,x]);
			}
		}

		if(y+1<3){	// down
			if(matrix[y+1][x]!=(this.position+1)){
				availLattice.push([y+1,x]);
			}
		}
		
		if(x-1>2){	// left
			if(matrix[y][x-1]!=(this.position+1)){
				availLattice.push([y,x-1]);
			}
		}

		if(x+1<6){	// right
			if(matrix[y][x+1]!=(this.position+1)){
				availLattice.push([y,x+1]);
			}
		}
		
		return availLattice;
	}

	this.paoAction = function(x,y,matrix){
		var i, j;
		var availLattice = [[y,x]];

		for(i=x-1;i>-1;i--){	// left
			if(matrix[y][i] == 0){
				availLattice.push([y, i]); 
			}else{
				for(j=i-1; j>-1; j--){
					if(matrix[y][j] != 0){
						if(matrix[y][j] == (2-this.position)){
							availLattice.push([y, j]); 
							break;
						}else{
							break;
						}
					}
				}
				break;
			}
		}
		for(i=x+1;i<9;i++){	// right
			if(matrix[y][i] == 0){
				availLattice.push([y, i]); 
			}else{
				for(j=i+1; j<9; j++){
					if(matrix[y][j] != 0){
						if(matrix[y][j] == (2-this.position)){
							availLattice.push([y, j]); 
							break;
						}else{
							break;
						}
					}
				}
				break;
			}
		}
		for(j=y-1;j>-1;j--){	// up
			if(matrix[j][x] == 0){
				availLattice.push([j, x]); 
			}else{
				for(i=j-1; i>-1; i--){
					if(matrix[i][x] != 0){
						if(matrix[i][x] == (2-this.position)){
							availLattice.push([i, x]); 
							break;
						}else{
							break;
						}
					}
				}
				break;
			}
		}
		for(j=y+1;j<10;j++){	// down
			if(matrix[j][x] == 0){
				availLattice.push([j, x]); 
			}else{
				for(i=j+1; i<10; i++){
					if(matrix[i][x] != 0){
						if(matrix[i][x] == (2-this.position)){
							availLattice.push([i, x]); 
							break;
						}else{
							break;
						}
					}
				}
				break;
			}
		}

		return availLattice;
	}

	this.bingAction = function(x,y,matrix){
		var availLattice = [[y,x]];

		if(matrix[y-1][x]!=(this.position+1)){	// up
				availLattice.push([y-1,x]);
		}

		if(y<5){
			if(x>0){	//left
				if(matrix[y][x-1]!=(this.position+1)){
					availLattice.push([y,x-1]);
				}
			}
			if(x<8){	//right
				if(matrix[y][x+1]!=(this.position+1)){
					availLattice.push([y,x+1]);
				}
			}
		}

		return availLattice;
	}

	this.bingUpAction = function(x,y,matrix){
		var availLattice = [[y,x]];

		if(matrix[y+1][x]!=(this.position+1)){	// down
				availLattice.push([y+1,x]);
		}

		if(y>4){
			if(x>0){	//left
				if(matrix[y][x-1]!=(this.position+1)){
					availLattice.push([y,x-1]);
				}
			}
			if(x<8){	//right
				if(matrix[y][x+1]!=(this.position+1)){
					availLattice.push([y,x+1]);
				}
			}
		}

		return availLattice;
	}
}