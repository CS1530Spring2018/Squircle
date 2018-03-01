
function setup() {
	console.log(users);
	for (user in users) {
		$("#users").append($("<li>").text(users[user]));
	}
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		socket.emit('join', {'code': lobbycode, 'username':username});
	});
	
	socket.on('new user', function(username) {
		console.log("new user joined");
		$("#users").append($("<li>").text(username));
	});
}
window.addEventListener("load", setup, true);

