from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from squircle import socketio
room_occupants = {}
@socketio.on('create')
def handle_create(json):
	print('received json: ' + str(json))
	room = json['code']
	join_room(room)
	if room not in room_occupants:
		room_occupants[room] = []

@socketio.on('join')
def handle_join(json):
	print(str(json))
	username = json['username']
	room = json['code']
	join_room(room)
	if username not in room_occupants[room]:
		room_occupants[room].append(username)
		socketio.emit('new user', username, room=room)