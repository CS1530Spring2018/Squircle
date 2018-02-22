
function setup() {
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('connect', function() {
		var lobbycode = $("#lobbycode").text().substring(5).trim();
		console.log(lobbycode);
		socket.emit('join', {'code': lobbycode, 'username': {{username}} });
	});
}
window.addEventListener("load", setup, true);

