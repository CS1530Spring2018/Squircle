from squircle import app, db
from sqlalchemy import *

class User(db.Model):

	username = db.Column(db.String(80), primary_key=True)
	password = db.Column(db.String(80), nullable=False)

class Lobby(db.Model):
	code = db.Column(db.String(5), primary_key=True)
@app.cli.command()
def initdb():
	db.drop_all()
	db.create_all()
	db.session.commit()