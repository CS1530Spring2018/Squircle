from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from squircle import socketio, db
from datetime import datetime
from database import Chatlog
from vars import num_players, room_occupants, room_ready

@socketio.on('create')
def handle_create(json):
	room = json['code']
	join_room(room)
	if room not in room_occupants:
		room_occupants[room] = {'players':[], 'spectators':[]}

@socketio.on('join')
def handle_join(json):
	username = json['username']
	room = json['code']
	join_room(room)
	if username not in room_occupants[room]['players'] and username not in room_occupants[room]['spectators']:
		socketio.emit('new user', username, room=room)
		if len(room_occupants[room]['players']) == num_players:
			room_occupants[room]['spectators'].append(username)
		elif len(room_occupants[room]['players']) == num_players - 1:
			room_occupants[room]['players'].append(username)
			socketio.emit('players reached', room=room)
		else:
			room_occupants[room]['players'].append(username)

@socketio.on('is room ready')
def handle_is_room_ready(json):
	room = json['code']
	if room_ready[room] == num_players:
		socketio.emit('room is ready', room=room)

@socketio.on('game join')
def handle_game_join(json):
	room = json['code']
	join_room(room)
	
@socketio.on('ready')
def handle_join(json):
	username = json['username']
	room = json['room']
	if room not in room_ready:
		room_ready[room] = 1
	else:
		room_ready[room] = room_ready[room] + 1
	if room_ready[room] == num_players:
		socketio.emit('all ready', room=room)

@socketio.on('new message')
def handle_new_message(json):
	username = json['username']
	room = json['room']
	message = json['message']
	new_message = Chatlog(sender=username, message=message, timestamp=datetime.now(), lobby_code=room)
	db.session.add(new_message)
	db.session.commit()
	socketio.emit('new message', (message, username), room=room)