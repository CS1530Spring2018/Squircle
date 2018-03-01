from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from squircle import socketio

@socketio.on('create')
def handle_create(json):
	print('received json: ' + str(json))
	join_room(json['code'])

@socketio.on('join')
def handle_join(json):
	print(str(json))
	username = json['username']
	room = json['code']
	if room not in rooms():
		emit('new user', username, room=room)
	join_room(room)