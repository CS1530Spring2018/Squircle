from flask import Flask
import os, unittest, sys
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
	
	def get_lobby_code(self):
		rv = self.app.get('/lobbycode/')
		return rv.data.decode('ascii').split('/')[2]
		
	def test_logout(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.logout()
		assert b'You have successfully been logged out!' in rv.data
	
	def test_logout_not_logged_in(self):
		rv = self.app.get('/logout/',follow_redirects=True)
		assert b'Login' in rv.data
	
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
	
	def test_login_page(self):
		rv = self.app.get('/login/')
		assert b'Login' in rv.data
		
	def test_login(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		self.logout()
		rv = self.login('admin', 'root')
		assert b'Join Lobby' in rv.data
	
	def test_login_redirects_to_profile(self):
		self.create_account('admin', 'root', '', '', '')
		rv = self.app.get('/login/')
		assert b'Login' not in rv.data
		
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
	
	def test_profile_page(self):
		rv = self.app.get('/profile/', follow_redirects=True)
		assert b'Login' in rv.data
	
	def test_username_in_profile_page(self):
		rv = self.create_account('bob', 'bob', '', '', '')
		assert b'bob' in rv.data
	
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
		code = self.get_lobby_code()
		self.assertTrue(code.isupper())
		
	def test_lobbycode_five_digits(self):
		code = self.get_lobby_code()
		self.assertEqual(len(code), 5)
		
	def test_join_bad_lobby(self):
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.app.post('/profile/admin', data={'code':'BADCODE'}, follow_redirects=True)
		assert b'That lobby is not valid!' in rv.data
		
	def test_join_valid_lobby(self):
		code = self.get_lobby_code()
		self.create_account('admin', 'root', '20', 'usa', 'some about me text')
		rv = self.app.post('/profile/admin', data={'code':code}, follow_redirects=True)
		assert code in rv.data.decode('ascii')
	
	def test_lobby_has_lobbycode(self):	
		code = self.get_lobby_code()
		rv = self.app.get('/lobby/'+code)
		assert bytes(code, 'utf-8') in rv.data
	
	def test_faq(self):
		rv = self.app.get('/help/')
		assert b'Squircle Help' in rv.data
	
	def test_pages_have_help_tips(self):
		rv = self.app.get('/lobby/')
		assert b'Help' in rv.data
		
		rv = self.app.get('/login/')
		assert b'Help' in rv.data
		
		# /profile/bob
		rv = self.create_account('bob', 'bob', '', '', '')
		assert b'Help' in rv.data

		code = self.get_lobby_code()
		rv = self.app.get('/game/'+code)
		assert b'Help' in rv.data
		
		rv = self.app.get('/lobby/'+code)
		assert b'Help' in rv.data
		
	def test_game_page(self):
		code = self.get_lobby_code()
		rv = self.app.get('/game/'+code)
		assert bytes(code, 'utf-8') in rv.data

	def test_controller_page_0(self):
		self.create_account('bob', 'bob', '', '', '')
		rv = self.app.get('/controller/0')
		assert b'player_one' in rv.data
	
	def test_controller_page_1(self):
		self.create_account('bob', 'bob', '', '', '')
		rv = self.app.get('/controller/1')
		assert b'player_two' in rv.data
	
	def test_controller_page_2(self):
		self.create_account('bob', 'bob', '', '', '')
		rv = self.app.get('/controller/2')
		assert b'player_three' in rv.data
		
	def test_controller_page_3(self):
		self.create_account('bob', 'bob', '', '', '')
		rv = self.app.get('/controller/3')
		assert b'player_four' in rv.data
		
if __name__ == '__main__':
    unittest.main()