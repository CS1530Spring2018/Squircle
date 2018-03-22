var socket;

function sendMessage(e) {
	var key = e.keyCode || e.which;
	if (key == 13) {
		textArea = $("#typing");
		message = textArea.value;
		textArea.value = "";
		e.preventDefault();
		textArea.focus();
		socket.emit('new message', {"username":username, "room":lobbycode, "message":message});
	}
}
function setup() {
	socket = io.connect('http://' + document.domain + ':' + location.port);
	
	socket.on('connect', function() {
		socket.emit('join', {'code': lobbycode, 'username':username});
	});
	
	socket.on('new message', function() {
		
	}
}
window.addEventListener("load", setup, true);