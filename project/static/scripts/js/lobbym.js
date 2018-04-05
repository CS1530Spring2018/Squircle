
function sendMessage() {
	textArea = $("#typing")[0];
	message = textArea.value;
	textArea.value = "";
	textArea.focus();
	console.log(message);
	socket.emit('new message', {"username":username, "room":lobbycode, "message":message});
}

function listUsers() {
	for (p in players) {
		$("#players").append($("<li>").text(players[p]));
	}
	for (s in spectators) {
		$("#spectators").append($("<li>").text(spectators[s]));
	}
}

function setupChat() {
	$("#Chat").removeAttr("hidden");
	// $("#main_chatbox").removeAttr("hidden");
	$("#userslist").attr("hidden", "hidden");
	// $("#sendMessage").on("click", sendMessage);
}

function setup() {
	
	
	
	socket.emit('is room ready', {'code': lobbycode});
	socket.on('room is ready', function() {
		setupChat();
	});
	listUsers();
	if (players.length == numPlayers) {
		for (player of $("#players li")) {
			if (username == player.innerText) {
				$("#ready").removeAttr("disabled");
			}
		}
	}
	
	$("#ready").on("click", function() {
		socket.emit("ready", {"username":username, "room":lobbycode});
		$("#ready").attr("disabled", "disabled");
	});
	
	socket.on('new user', function(username) {
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
		for (player of $("#players li")) {
			if (username == player.innerText) {
				req.send();
			}
		}
		setupChat();
	});
	
	socket.on('new message', function(m, sender) {
		// $("#history").append($("<p>").text(sender+":"+m));
		// document.getElementById("history").scrollTop = history.scrollHeight;
	});
}
window.addEventListener("load", setup, true);

