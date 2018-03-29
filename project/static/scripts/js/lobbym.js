var socket;
function sendMessage() {
	//var key = e.keyCode || e.which;
	//if (key == 13) {
		textArea = $("#typing")[0];
		message = textArea.value;
		textArea.value = "";
		//e.preventDefault();
		textArea.focus();
		console.log(message);
		socket.emit('new message', {"username":username, "room":lobbycode, "message":message});
	//}
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
		// function makeReq(method, target, retCode, action, data) {
			// var httpRequest = new XMLHttpRequest();

			// if (!httpRequest) {
				// alert('Giving up :( Cannot create an XMLHTTP instance');
				// return false;
			// }

			// httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
			// httpRequest.open(method, target);
			
			// if (data){
				// httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				// httpRequest.send(data);
			// }
			// else {
				// httpRequest.send();
			// }
		// }

		// function makeHandler(httpRequest, retCode, action) {
			// function handler() {
				// if (httpRequest.readyState === XMLHttpRequest.DONE) {
					// if (httpRequest.status === retCode) {
						// action(httpRequest.responseText);
					// } else if (httpRequest.status == 400) {
						// //alert("Please make sure all fields were entered correctly.");
						// var response = JSON.parse(httpRequest.responseText);
						// //console.log(response['message']);
						// response = response["message"];
						// if (response["limit"]) {
							// alert(response["limit"]);
						// } else if (response["amount"]) {
							// alert(response["amount"]);
						// } else {
							// alert(response["message"]);
						// }
						// //console.log(response["message"]["limit"]);
						
					// } else {
						// alert("There was a problem with the request.");
					// }
				// }
			// }
			// return handler;
		// }
		// function successAction() {
			// window.location.replace(req.responseText);
		// }
		//make request to /controller
		var req = new XMLHttpRequest();
		var data = "?room="+lobbycode;
		//var data = "?player_num=";
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
				//$("#ready").removeAttr("disabled");
				req.send();
				//makeReq("GET", "/getcontroller", 200, action, '');
			}
		}
		//req.send();
		$("#main_chatbox").removeAttr("hidden");
		$("#userslist").attr("hidden", "hidden");
		$("#sendMessage").on("click", sendMessage);
	});
	
	socket.on('new message', function(m, sender) {
		$("#history").append($("<p>").text(sender+":"+m));
		document.getElementById("history").scrollTop = history.scrollHeight;
	});
}
window.addEventListener("load", setup, true);

