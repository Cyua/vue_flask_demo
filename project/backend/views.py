# -*- coding: utf-8 -*-

from flask import render_template
from backend import app
from backend import config

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index():
    return render_template("index.html")