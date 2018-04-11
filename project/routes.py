from squircle import app, db
from flask import redirect, render_template, url_for, session, request, flash, abort
from werkzeug.useragents import UserAgent
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
import string, random, json
from database import UserProfile, UserStats, UserLogin, Lobby, Chatlog
from vars import num_players, room_occupants, game_player

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

@app.route('/help/')
def faq():
	return render_template('faq.html')
	
@app.route('/getcontroller/')
def redirect_controller():
	username = session["username"]
	code = request.args.get('room')
	if username in room_occupants[code]["players"]:
		if code not in game_player:
			game_player[code] = 0
		else:
			game_player[code] = game_player[code] + 1
		return url_for('mobile_controller', playerNum=game_player[code])

@app.route('/controller/<playerNum>', methods=['GET'])
def mobile_controller(playerNum=None):
	return render_template('index_controller.html', playerNum=playerNum, username=session['username'])

@app.route('/controllerTest/', methods=['GET'])
def mobile_controller2():
	return render_template('index_controller.html', playerNum=0, username="test")

@app.route('/getgame/')
def redirect_game():
	code = request.args.get("lobby")
	return url_for('game_page', code=code)

@app.route('/game/<code>')
def game_page(code=None):
	return render_template('game.html', code=code)

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
			try:
				return render_template("lobbym.html", code=code, data=json.dumps({'username':session['username'],
					'users':room_occupants[code], 'num_players':num_players}))
			except KeyError as ke:
				flash("That lobby is not valid!")
				return redirect(url_for("profile", username=session['username']))
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
