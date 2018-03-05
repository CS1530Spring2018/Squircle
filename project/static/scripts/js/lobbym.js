
function setup() {
	
	console.log(users);
	for (p in players) {
		$("#players").append($("<li>").text(players[p]));
	}
	for (s in spectators) {
		$("#spectators").append($("<li>").text(spectators[s]));
	}
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		socket.emit('join', {'code': lobbycode, 'username':username});
	});
	if (players.length == numPlayers) {
		$("#ready").removeAttr("disabled");
	}
	socket.on('new user', function(username) {
		console.log("new user joined");
		if ($("#players li").length == numPlayers) {
			$("#spectators").append($("<li>").text(username));
		} else {
			$("#players").append($("<li>").text(username));
		}
	});
	
	socket.on('players reached', function() {
		$("#ready").removeAttr("disabled");
	});
	
	$("#ready").on("click", function() {
		socket.emit("ready", {"username":username, "room":lobbycode});
		$("#ready").attr("disabled", "disabled");
	});
	
	socket.on('all ready', function() {
		//make request to /controller
		var req = new XMLHttpRequest(); 
		req.open("GET", "/getcontroller/");
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

