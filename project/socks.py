from flask_socketio import SocketIO, emit, join_room, leave_room
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
	join_room(room)
	emit('new user', json['username'], room=room)