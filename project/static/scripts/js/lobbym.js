
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
	
	socket.on('new user', function(username) {
		console.log("new user joined");
		if ($("#players").length == 4) {
			$("#spectators").append($("<li>").text(username));
		} else {
			$("#players").append($("<li>").text(username));
		}
	});
}
window.addEventListener("load", setup, true);

