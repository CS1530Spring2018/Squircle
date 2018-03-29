from flask import Flask
import os, unittest, tempfile, sys
sys.path.append('..')
import routes, squircle

class RoutesTestCase(unittest.TestCase):
	
	def setUp(self):
		squircle.app.config['TESTING'] = True
		squircle.app.config['DEBUG'] = False
		squircle.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
		squircle.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
		self.app = squircle.app.test_client()
		squircle.db.drop_all()
		squircle.db.create_all()
			
	def tearDown(self):
		pass
	
	def test_index(self):
		rv = self.app.get('/')
		assert b'lobby' in rv.data
if __name__ == '__main__':
    unittest.main()