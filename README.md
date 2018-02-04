# Squircle

## Installation instructions

### Python

Make sure Python 3.6+ is installed.

`pip install -r requirements.txt`

### JavaScript

`npm install`

`bower install`

If bower doesn't work run `npm install -g` first. 

## Running The Server

First navigate to the project directory

`cd project`

Use a virtual environment since some environment variables will be changed.

`virtualenv venv`

If on Windows, run `venv\Scripts\activate`

`pip install -r requirements.txt`

`set FLASK_APP=squircle.py`

or if that doesn't work run:

`export FLASK_APP=squircle.py`

`flask initdb`

`flask run`

This should start the server on 127.0.0.1:5000 or something similar.

To run the server over the local network (so phones can connect), first check your local IP address:

Windows: `ipconfig /all`

Then run `flask run --host=<ipaddress>`