var socket = io.connect('http://' + document.domain + ':' + location.port);
function setup() {
	socket.on('connect', function() {
		socket.emit('my event', {data: 'I\'m connected!'});
	});
}
window.addEventListener("load", setup, true);

