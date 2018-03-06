var socket;
function sendMessage(e) {
	var key = e.keyCode || e.which;
	if (key == 13) {
		textArea = $("#typing");
		message = textArea.value;
		textArea.value = "";
		e.preventDefault();
		textArea.focus();
		console.log(message);
		socket.emit('new message', {"username":username, "room":lobbycode, "message":message});
	}
}

function setup() {
	
	console.log(users);
	for (p in players) {
		$("#players").append($("<li>").text(players[p]));
	}
	for (s in spectators) {
		$("#spectators").append($("<li>").text(spectators[s]));
	}
	socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		socket.emit('join', {'code': lobbycode, 'username':username});
	});
	if (players.length == numPlayers) {
		for (player of $("#players li")) {
			if (username == player.innerText) {
				$("#ready").removeAttr("disabled");
			}
		}
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
		for (player of $("#players li")) {
			if (username == player.innerText) {
				$("#ready").removeAttr("disabled");
			}
		}
	});
	
	$("#ready").on("click", function() {
		socket.emit("ready", {"username":username, "room":lobbycode});
		$("#ready").attr("disabled", "disabled");
	});
	
	socket.on('all ready', function() {
		//make request to /controller
		var req = new XMLHttpRequest();
		var data = "?room="+lobbycode;
		req.open("GET", "/getcontroller"+data);
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
		//req.send();
		$("#main_chatbox").removeAttr("hidden");
		socket.on('new message', function(m) {
			$("#history").append($("<p>").text(m));
			document.getElementById("history").scrollTop = history.scrollHeight;
		});
	});
}
window.addEventListener("load", setup, true);

