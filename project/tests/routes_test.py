from flask import Flask
import os, unittest, tempfile, sys
sys.path.append('..')
import routes, squircle

class RoutesTestCase(unittest.TestCase):
	
	def setUp(self):
		squircle.app.testing = True
		self.app = squircle.app.test_client()
		SQLALCHEMY_TRACK_MODIFICATIONS = False
		#squircle.db.init_app(self.app)
		with squircle.app.app_context():
			squircle.db.create_all()
			
	def tearDown(self):
		self.app = Flask(__name__)
		squircle.db.init_app(self.app)
		with self.app.app_context():
			squircle.db.drop_all()
	
	def test_index(self):
		rv = self.app.get('/')
		assert b'lobby' in rv.data
if __name__ == '__main__':
    unittest.main()