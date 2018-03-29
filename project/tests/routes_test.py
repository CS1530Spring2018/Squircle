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

	def login(self, username, password):
		return self.app.post('/login/', data={
			'user':username,
			'pass':password,
			'type':'Login'
		}, follow_redirects=True)
	
	def logout(self):
		return self.app.get('/logout/')
	
	def create_account(self, username, password, age, country, about_me):
		return self.app.post('/login/', data={
			'user':username,
			'pass':password,
			'age':age, 
			'country':country,
			'about':about_me,
			'type':'Create Account'
		}, follow_redirects=True)
			
	def test_create_account(self):
		rv = self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		assert b'Join Lobby' in rv.data
	
	def test_create_duplicate_account(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		self.logout()
		rv = self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		assert b'Username already exists. Try something different.' in rv.data

	def test_create_account_no_optional_info(self):
		rv = self.create_account('admin', 'root', '', '', '')
		assert b'Join Lobby' in rv.data
	def test_login(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		self.logout()
		rv = self.login('admin', 'root')
		assert b'Join Lobby' in rv.data
		
	def test_bad_login_password(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		self.logout()
		rv = self.login('admin', 'bad_password')
		assert b'Invalid login. Try again.' in rv.data

if __name__ == '__main__':
    unittest.main()