from flask import Flask, current_app
from flask_socketio import SocketIO
import os, unittest, sys, json
sys.path.append('..')
import squircle
from socks import room_occupants, room_ready, num_players

class SocksTestCase(unittest.TestCase):
	
	def setUp(self):
		self.app = squircle.app#Flask(__name__)
		self.app.config['TESTING'] = True
		self.app.config['DEBUG'] = False
		self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
		self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
		self.client = squircle.socketio.test_client(self.app)
	
	def tearDown(self):
		room_occupants.clear()
		room_ready.clear()
	
	def test_create(self):
		self.client.emit('create', {'code':'AAAAA'})
		assert 'AAAAA' in room_occupants
	
	def test_create_users_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = room_occupants['AAAAA']
		assert len(occupants['players']) == 0
		
	def test_create_spectators_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = room_occupants['AAAAA']
		assert len(occupants['spectators']) == 0
		
	def join_helper(self, username="tester"):
		# clear old socket.io notifications
		self.client.get_received()
		self.client.emit('create', {'code':'AAAAA'})
		self.client.emit('join', {'code':'AAAAA', 'username':username})
		return self.client.get_received()
	
	def test_join_emits(self):
		rec = self.join_helper()
		assert len(rec) == 1
	
	def test_join_receive_emit(self):
		rec = self.join_helper()
		assert rec[0]['name'] == 'new user'
	
	def test_join_receive_username(self):
		username = "tester"
		rec = self.join_helper(username)
		assert rec[0]['args'][0] == username
		
	def test_join(self):
		self.join_helper()
		occupants = room_occupants['AAAAA']
		assert 'tester' in occupants['players']
		
	def make_room_ready(self, roomcode, offset=0):
		self.client.emit('create', {'code':roomcode})
		for i in range(num_players-offset):
			self.client.emit('join', {'code':roomcode, 'username':'player'+str(i)})
			self.client.emit('ready', {'room':roomcode, 'username':'player'+str(i)})
		return self.client.get_received()
		
	def test_join_spectator(self):
		self.make_room_ready('AAAAA')
		self.client.emit('join', {'code':'AAAAA', 'username':'spectator0'})
		assert 'spectator0' in room_occupants['AAAAA']['spectators']
		
	def test_join_players_reached(self):
		self.make_room_ready('AAAAA', offset=1)
		# clear old socket.io notifications
		self.client.get_received()
		self.client.emit('join', {'code':'AAAAA', 'username':'final_player'})
		rec = self.client.get_received()
		assert rec[1]['name'] == 'players reached'

	def test_is_room_ready(self):
		self.client.emit('is room ready', {'code':'AAAAA'})
		rec = self.client.get_received()
		assert len(rec) == 0
		
	def test_room_is_ready_emits(self):
		self.make_room_ready('AAAAA')
		# clear old socket.io notifications
		self.client.get_received()
		self.client.emit('is room ready', {'code':'AAAAA'})
		rec = self.client.get_received()
		assert len(rec) == 1

	def test_room_is_ready(self):
		self.make_room_ready('AAAAA')
		# clear old socket.io notifications
		self.client.get_received()
		self.client.emit('is room ready', {'code':'AAAAA'})
		rec = self.client.get_received()
		assert rec[0]['name'] == 'room is ready'
		
	def test_room_read_emits(self):
		self.make_room_ready('AAAAA', offset=1)
		self.client.emit('join', {'code':'AAAAA', 'username':'final_player'})
		# clear old socket.io notifications
		self.client.get_received()
		self.client.emit('ready', {'room':'AAAAA', 'username':'final_player'})
		rec = self.client.get_received()
		assert rec[0]['name'] == 'all ready'