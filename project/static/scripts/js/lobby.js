function test_spectators(){
	document.getElementById("spectators").style.borderColor = "cyan";
					document.getElementById("spectators").style.borderStyle = "solid"; 
					document.getElementById("spectators").style.borderRadius = "16px";
					document.getElementById("spectators").style.backgroundColor = "rgb(198, 198, 198)";
					$("#spectators").append($("<h3>").text("Spectators"));
					$("#spectators").append($("<li>").text("testUsername"));
}

function setup() {
	if (lobbycode != null) {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
		socket.on('connect', function() {
			socket.emit('create', {'code': lobbycode});
		});
		socket.on('new user', function(username) {
			console.log("new user joined");
			console.log($("#players").length)
			if ($("#players li").length == numPlayers) {
				if ($("#spectators li").length == 0) {
					document.getElementById("spectators").style.borderColor = "cyan";
					document.getElementById("spectators").style.borderStyle = "solid"; 
					document.getElementById("spectators").style.borderRadius = "16px";
					document.getElementById("spectators").style.backgroundColor = "rgb(198, 198, 198)";
					$("#spectators").append($("<h3>").text("Spectators"));
				}
				$("#spectators").append($("<li>").text(username));
			} else {
				if ($("#players li").length == 0) {
					document.getElementById("players").style.borderColor = "rgb(235, 199, 0)";
					document.getElementById("players").style.borderStyle = "solid"; 
					document.getElementById("players").style.borderRadius = "16px";
					document.getElementById("players").style.backgroundColor = "rgb(198, 198, 198)";
					$("#players").append($("<h3>").text("Players"));
					test_spectators();
				}
				$("#players").append($("<li>").text(username));
			}
		});
		socket.on('all ready', function() {
			//make request to /game
			var req = new XMLHttpRequest(); 
			var data = "?lobby="+lobbycode;
			req.open("GET", "/getgame/"+data);
			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			req.onreadystatechange = function() {
				if (req.readyState == 4) 
				{
					if (req.status != 200) 
					{
						
					} else {
						window.location.replace(req.responseText);
					}
				}
			}
			req.send();
		});
	}
	$("#genLobbyCode").on("click", function() {
		var req = new XMLHttpRequest(); 
		req.open("GET", "/lobbycode/");
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.onreadystatechange = function() {
			if (req.readyState == 4) 
			{
				if (req.status != 200) 
				{
					
				} else {
					window.location.replace(req.responseText);
				}
			}
		}
		req.send();
	});
}
window.addEventListener("load", setup, true);