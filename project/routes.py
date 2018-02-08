from squircle import app, db
from flask import redirect, render_template, url_for, session, request, flash, abort
from werkzeug.useragents import UserAgent
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
import string, random
from database import UserProfile, UserStats, UserLogin, Lobby, Chatlog


@app.route('/')
def default():
	if is_mobile():
		#mobile
		return redirect(url_for("logger"))
	else:
		return redirect(url_for("lobby"))

@app.route('/controller/', methods=['GET'])
def mobile_controller():
	return render_template('index_controller.html')
	
@app.route('/login/', methods=["GET", "POST"])
def logger():
	if "username" in session:
		return redirect(url_for("profile", username=session["username"]))
	elif request.method == "POST":
		#query db
		user = UserLogin.query.filter_by(username=request.form["user"]).first()
		
		if user is not None:
			password = user.password
			if check_password_hash(password, request.form["pass"]):
				#login successful
				session["username"] = request.form["user"]
				return redirect(url_for("profile", username=user.username))
		# bad password or bad username, just login again
		flash("Invalid login. Try again")
		return redirect(url_for("logger"))
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


@app.route("/create_profile/", methods=["GET", "POST"])
def create_profile():
	
	if request.method == "POST":
		
		failure = create_account(request.form["user"], request.form["pass"])
		if "Duplicate" == failure:
			flash("Username already exists. Try something different")
			return redirect(url_for("create_profile"))
		#once new account is registered first set session
		session["username"] = request.form["user"]
		#then redirect to profile
		flash("Your account has been created successfully")
		return redirect(url_for("profile", username=request.form["user"]))
	else:
		return render_template("createProfilePage.html", title="Sign Up For an Account")


@app.route("/profile/")
@app.route("/profile/<username>", methods=["GET", "POST"])
def profile(username=None):
	if not username:
		# if no profile specified direct unlogged in users to the login page
		return redirect(url_for("logger"))
	logged_in = "username" in session and session["username"] == username
	if logged_in and request.method == "GET":
		return render_template("profilePage.html", user=username)	
	elif request.method == "POST" and "join" in request.form:
		code = request.form['join']
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
		return render_template("lobby.html")
	else:
		if is_mobile():
			return render_template("lobbym.html", code=code)
		else:
			return render_template("lobby.html", code=code)


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
	#return "Lobby code: " + code
	return url_for("lobby", code=code)

#Helper functions#

def is_mobile():
	ua = request.headers.get('User-Agent')
	useragent = UserAgent(ua)
	return useragent.platform in ['android', 'iphone', 'ipad']
	

def create_account(new_username, new_password):
	new_user = UserLogin(username=new_username, password=generate_password_hash(new_password))
	db.session.add(new_user)
	try:
		db.session.commit()
	except IntegrityError as ie:
		db.session.rollback()
		return "Duplicate"
	return None