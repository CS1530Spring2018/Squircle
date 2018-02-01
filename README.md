# Squircle

## Installation instructions

### Python

Make sure Python 3.6+ is installed.

`pip install -r requirements.txt`

### JavaScript

`npm install`

`bower install`

## Running The Server

Use a virtual environment since some environment variables will be changed.

`virtualenv venv`

If on Windows, run `venv\Scripts\activate'

`pip install -r requirements.txt`

`set FLASK_APP=squircle.py`

`flask run`

This should start the server on 127.0.0.1:5000 or something similar.