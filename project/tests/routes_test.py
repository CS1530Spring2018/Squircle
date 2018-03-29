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
	
	def test_logout(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.logout()
		assert b'You have successfully been logged out!' in rv.data
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

	def test_login_bad_username(self):
		rv = self.login('bad_username', 'root')
		assert b'Invalid login. Try again.' in rv.data
	
	def test_unlogged_in_unauthorized(self):
		rv = self.app.get('/profile/admin')
		self.assertEqual(rv.status_code, 404)
	
	def test_view_other_profile(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		self.logout()
		self.create_account('bob', 'bob', '', '', '')
		rv = self.app.get('/profile/admin')
		self.assertEqual(rv.status_code, 404)
		
	def test_getlobbycode(self):
		rv = self.app.get('/lobbycode/')
		assert b'lobby' in rv.data
		
	def test_lobbycode_uppercase(self):
		rv = self.app.get('/lobbycode/')
		code = rv.data.decode('ascii').split('/')[2]
		self.assertTrue(code.isupper())
		
	def test_lobbycode_five_digits(self):
		rv = self.app.get('/lobbycode/')
		code = rv.data.decode('ascii').split('/')[2]
		self.assertEqual(len(code), 5)
		
	def test_join_bad_lobby(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.app.post('/profile/admin', data={'code':'BADCODE'}, follow_redirects=True)
		assert b'That lobby is not valid!' in rv.data
		
	def test_join_valid_lobby(self):
		rv = self.app.get('/lobbycode/')
		code = rv.data.decode('ascii').split('/')[2]
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.app.post('/profile/admin', data={'code':code}, follow_redirects=True)
		assert code in rv.data.decode('ascii')
if __name__ == '__main__':
    unittest.main()