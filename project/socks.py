from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from squircle import socketio
room_occupants = {}
@socketio.on('create')
def handle_create(json):
	print('received json: ' + str(json))
	room = json['code']
	join_room(room)
	if room not in room_occupants:
		room_occupants[room] = {'players':[], 'spectators':[]}

@socketio.on('join')
def handle_join(json):
	print(str(json))
	username = json['username']
	room = json['code']
	join_room(room)
	if username not in room_occupants[room]['players'] and username not in room_occupants[room]['spectators']:
		if len(room_occupants[room]['players']) == 4:
			room_occupants[room]['spectators'].append(username)
		else:
			room_occupants[room]['players'].append(username)
		socketio.emit('new user', username, room=room)