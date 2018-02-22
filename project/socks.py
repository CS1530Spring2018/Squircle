from flask_socketio import SocketIO, emit
from squircle import socketio

@socketio.on('create')
def handle_create(json):
    print('received json: ' + str(json))

@socketio.on('join')
def handle_join(json):
	print(str(json))
	emit(str(json))