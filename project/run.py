# -*- coding: utf-8 -*-

from backend import app

if __name__ == "__main__":
    app.run(port=9876, host="0.0.0.0", debug=True)