from squircle import app, db
from flask import redirect, render_template, url_for, session, request, flash
from werkzeug.useragents import UserAgent
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from database import UserProfile, UserStats, UserLogin, Lobby, Chatlog

@app.route('/')
def default():
	ua = request.headers.get('User-Agent')
	useragent = UserAgent(ua)
	if useragent.platform in ['android', 'iphone', 'ipad']:
		#mobile
		return redirect(url_for("logger"))
	else:
		return redirect(url_for("lobby"))
	
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
	else:
		abort(401)
		
@app.route("/lobby/")
def lobby():
	return render_template("lobby.html")
#Helper functions#

def create_account(new_username, new_password):
	new_user = UserLogin(username=new_username, password=generate_password_hash(new_password))
	db.session.add(new_user)
	try:
		db.session.commit()
	except IntegrityError as ie:
		db.session.rollback()
		return "Duplicate"
	return None