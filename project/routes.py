from squircle import app, db
from flask import redirect, render_template, url_for, session, request, flash, abort
from werkzeug.useragents import UserAgent
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
import string, random, json
from database import UserProfile, UserStats, UserLogin, Lobby, Chatlog

from socks import room_occupants, num_players

@app.route('/')
def default():
	if is_mobile():
		#mobile
		return redirect(url_for("logger"))
	else:
		return redirect(url_for("lobby"))
@app.route("/testgame/")
def test_game():
	return render_template("game.html")

@app.route('/getcontroller/')
def redirect_controller():
	print("no good")
	username = session["username"]
	print("code bad")
	code = request.args.get('room')
	print("code:", code)
	if username in room_occupants[code]["players"]:
		return url_for('mobile_controller')
	elif username in room_occupants[code]["spectators"]:
		return url_for('chat_app',room=code)
	print("something went wrong")

@app.route('/chat/')
def chat_app(room=None):
	return render_template('chat.html', lobbycode=room, username=session['username'])

@app.route('/controller/', methods=['GET'])
def mobile_controller():
	return render_template('index_controller.html')

@app.route('/getgame/')
def redirect_game():
	return url_for('game_page')

@app.route('/game/')
def game_page():
	return render_template('game.html')

@app.route('/login/', methods=["GET", "POST"])
def logger():
	

	if "username" in session:
		return redirect(url_for("profile", username=session["username"]))
	elif request.method == "POST" and request.form["type"]=="Login":
		#query db
		user = UserLogin.query.filter_by(username=request.form["user"]).first()
		
		if user is not None:
			password = user.password
			if check_password_hash(password, request.form["pass"]):
				#login successful
				session["username"] = request.form["user"]
				return redirect(url_for("profile", username=user.username))
		# bad password or bad username, just login again
		flash("Invalid login. Try again.")
		return redirect(url_for("logger"))
	elif request.method == "POST" and request.form["type"]=="Create Account":
		failure = create_account(request.form["user"], request.form["pass"], 
			about_me=request.form['about'], age=request.form['age'], country=request.form['country'])
		if "Duplicate" == failure:
			flash("Username already exists. Try something different.")
			return redirect(url_for("logger"))
		#once new account is registered first set session
		session["username"] = request.form["user"]
		#then redirect to profile
		flash("Your account has been created successfully.")
		return redirect(url_for("profile", username=request.form["user"]))
	else:
		return render_template("loginPage.html")

@app.route("/logout/")
def unlogger():
	# if logged in, log out, otherwise offer to log in
	if "username" in session:
		session.clear()
		return render_template("logoutPage.html")
	else:
		return redirect(url_for("logger"))



@app.route("/profile/")
@app.route("/profile/<username>", methods=["GET", "POST"])
def profile(username=None):
	if not username:
		# if no profile specified direct unlogged in users to the login page
		return redirect(url_for("logger"))
	logged_in = "username" in session and session["username"] == username
	if logged_in and request.method == "GET":
		return render_template("profilePage.html", user=username)	
	elif request.method == "POST" and "code" in request.form:
		code = request.form['code']
		print(code)
		lobbies = Lobby.query.filter_by(code=code).first()
		if lobbies:
			return redirect(url_for('lobby', code=code))
		else:
			flash("That lobby is not valid!")
			return redirect(url_for("profile", username=username))
	else:
		abort(404)

@app.route("/lobby/")
@app.route("/lobby/<code>")
def lobby(code=None):
	if not code:
		return render_template("lobby.html", num_players=num_players)
	else:
		if is_mobile():
			return render_template("lobbym.html", code=code, data=json.dumps({'username':session['username'], 'users':room_occupants[code], 'num_players':num_players}))
		else:
			return render_template("lobby.html", code=code, num_players=num_players)


@app.route("/lobbycode/")
def getlobbycode():
	repeat = True
	while repeat:
		codes = Lobby.query.all()
		code = ''.join([random.choice(string.ascii_uppercase) for n in range(5)])
		if code not in codes:
			repeat = False
	newcode = Lobby(code=code)
	db.session.add(newcode)
	db.session.commit()
	#return "Lobby Code: " + code
	return url_for("lobby", code=code)

#Helper functions#

def is_mobile():
	ua = request.headers.get('User-Agent')
	useragent = UserAgent(ua)
	return useragent.platform in ['android', 'iphone', 'ipad']
	

def create_account(new_username, new_password, about_me=None, age=None, country=None):
	new_user = UserLogin(username=new_username, password=generate_password_hash(new_password))
	db.session.add(new_user)
	new_profile = UserProfile(username=new_username, about_me=about_me, age=age, country=country)
	db.session.add(new_profile)
	try:
		db.session.commit()
	except IntegrityError as ie:
		db.session.rollback()
		return "Duplicate"
	return None
