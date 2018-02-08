from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from os import urandom
app = Flask(__name__)
app.secret_key = urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///squircle.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #to suppress some warning that popped up
socketio = SocketIO(app)
db = SQLAlchemy(app)

import database
import routes
import socks

if __name__ == '__main__':
    socketio.run(app)