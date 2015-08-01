$(function(){
	var $join = $(".join");
	var $start = $(".start");
	var $surrender = $(".surrender");
	var $cancel = $(".cancel");
	var $msgin = $(".msgin");
	iosocket.on('connect', function () {
		$msgin.append($('<li>已连接上服务器！</li>'));

		iosocket.on('message', function(msg) {
			$msgin.append($('<li></li>').text(msg));

			if(typeof(msg) == "string"){
				switch(msg){
					case "join":
						$join.attr('disabled','disabled');
						$start.removeAttr('disabled');
						break;
					case "start":
						$start.attr('disabled','disabled');
						$cancel.attr('disabled','disabled');
						$surrender.removeAttr('disabled');
						gameStart();
						break;
					case "gg":
						break;
					case "cancel":
						$start.attr('disabled','disabled');
						$join.removeAttr('disabled');
						break;
					default:
						break;
				}
			}else{
				ox = msg[0]; oy = msg[1]; x = msg[2]; y = msg[3];
				activeChess.moveChessman(ox,oy,x,y);			
				matrix[y][x] = matrix[oy][ox];
				matrix[oy][ox] = 0;
				lattice = null;	ox = null; oy = null;
				activeSide = true;
			}
		});

		iosocket.on('disconnect', function() {
			$msgin.append('<li>与服务器失去连接</li>');
		});
	});

	$join.on("click", function(){
		iosocket.send("join");
		$join.attr('disabled','disabled');
		$cancel.removeAttr('disabled');
	});

	$start.on("click", function(){
		iosocket.send("start");
		$start.attr('disabled','disabled');
		$surrender.removeAttr('disabled');
		gameStart();
	});

	$cancel.on("click", function(){
		iosocket.send("cancel");
		$cancel.attr('disabled','disabled');
		$join.removeAttr('disabled');
	});
});