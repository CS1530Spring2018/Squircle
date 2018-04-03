from flask import Flask, current_app
from flask_socketio import SocketIO
import os, unittest, sys, json
sys.path.append('..')
import squircle

class SocksTestCase(unittest.TestCase):
	
	def setUp(self):
		squircle.app.config['TESTING'] = True
		squircle.app.config['DEBUG'] = False
		squircle.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
		squircle.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
		self.app = squircle.app
		with self.app.app_context():
			self.test_app = current_app.test_client()
		self.client = squircle.socketio.test_client(self.app)
	
	def tearDown(self):
		pass
	
	def test_create(self):
		self.client.emit('create', {'code':'AAAAA'})
		assert 'AAAAA' in squircle.socks.room_occupants
	
	def test_create_users_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = squircle.socks.room_occupants['AAAAA']
		assert len(occupants['players']) == 0
		
	def test_create_spectators_empty(self):
		self.client.emit('create', {'code':'AAAAA'})
		occupants = squircle.socks.room_occupants['AAAAA']
		assert len(occupants['spectators']) == 0