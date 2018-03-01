function setup() {
	if (lobbycode != null) {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
		socket.on('connect', function() {
			socket.emit('create', {'code': lobbycode});
		});
		socket.on('new user', function(username) {
			console.log("new user joined");
			if ($("#players").length == numPlayers) {
				$("#spectators").append($("<li>").text(username));
			} else {
				$("#players").append($("<li>").text(username));
			}
		});
		socket.on('all ready', function() {
			//make request to /game
			var req = new XMLHttpRequest(); 
			req.open("GET", "/getgame/");
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