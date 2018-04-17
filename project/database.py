from squircle import app, db
from sqlalchemy import *

class UserLogin(db.Model):
	username = db.Column(db.String(80), primary_key=True)
	password = db.Column(db.String(80), nullable=False)
	
class UserProfile(db.Model):
	username = db.Column(db.String(80), db.ForeignKey('user_login.username'), nullable=False, primary_key=True)
	about_me = db.Column(db.Text, nullable=True)
	# age = db.Column(db.Integer, nullable=True)
	country = db.Column(db.String(20), nullable=True)
	
class UserStats(db.Model):
	username = db.Column(db.String(80), db.ForeignKey('user_login.username'), nullable=False, primary_key=True)
	matches_played = db.Column(db.Integer)
	matches_won = db.Column(db.Integer)

class Lobby(db.Model):
	code = db.Column(db.String(5), primary_key=True)

class Chatlog(db.Model):
	sender = db.Column(db.String(80), db.ForeignKey("user_login.username"), nullable=False, primary_key=True)
	message = db.Column(db.Text, nullable=False)
	timestamp = db.Column(db.DateTime, nullable=False, primary_key=True)
	lobby_code = db.Column(db.String(5), db.ForeignKey('lobby.code'))
	lobby = db.relationship('Lobby', backref=db.backref('log', cascade='all, delete-orphan'))
@app.cli.command()
def initdb():
	db.drop_all()
	db.create_all()
	db.session.commit()