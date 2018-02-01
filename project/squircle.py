from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = urandom(24)
socketio = SocketIO(app)
db = SQLAlchemy(app)