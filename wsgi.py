"""
WSGI entry point for production deployment
This file is used by gunicorn to serve the Flask application
"""

import os
from app import app

if __name__ == "__main__":
    app.run()
