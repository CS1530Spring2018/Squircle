function setup() {
	var lobby = $("#lobbycode").text();
	if (lobby.length > 6) {
		//there is a lobby code
		lobbycode = lobby.substring(5).trim();
		var socket = io.connect('http://' + document.domain + ':' + location.port);
		socket.on('connect', function() {
			socket.emit('create', {'code': lobbycode});
		});
		socket.on("new user", function(username) {
			$("#users").append($("<li>").text(username));
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