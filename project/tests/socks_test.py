from flask import Flask, current_app
from flask_socketio import SocketIO
import os, unittest, sys, json
sys.path.append('..')
from vars import room_occupants, room_ready

class SocksTestCase(unittest.TestCase):
	
	def setUp(self):
		self.app = Flask(__name__)
		self.app.config['TESTING'] = True
		self.app.config['DEBUG'] = False
		self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
		self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
		self.app.secret_key = os.urandom(24)
		#with self.app.app_context():
			#self.test_app = current_app.test_client()
		self.socketio = SocketIO(self.app)
		self.client = self.socketio.test_client(self.app)
	
	def tearDown(self):
		pass
	
	def test_create(self):
		self.client.emit('create', {'code':'AAAAA'})
		print(room_occupants)
		assert 'AAAAA' in room_occupants
	
	def test_create_users_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = room_occupants['AAAAA']
		assert len(occupants['players']) == 0
		
	def test_create_spectators_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = room_occupants['AAAAA']
		assert len(occupants['spectators']) == 0
		
	def test_join_receive_emit(self):
		# clear old socket.io notifications
		self.client.get_received()
		
		self.client.emit('create', {'code':'AAAAA'})
		self.client.emit('join', {'code':'AAAAA', 'username':'tester'})
		
		rec = self.client.get_received()
		print(rec)
		assert len(rec) == 1
		assert rec[0]['name'] == 'new user'

	def test_join(self):
		# clear old socket.io notifications
		self.client.get_received()
		
		self.client.emit('create', {'code':'AAAAA'})
		self.client.emit('join', {'code':'AAAAA', 'username':'tester'})
		occupants = room_occupants['AAAAA']
		assert 'tester' in occupants['players']
		