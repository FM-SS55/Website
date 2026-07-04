import os
from flask import Flask
from dotenv import load_dotenv

from db import init_db
from auth import login_manager


def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_change_me')
    app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # 8MB upload cap

    login_manager.init_app(app)

    with app.app_context():
        init_db()

    from routes.public import public_bp
    from routes.api import api_bp
    from routes.admin import admin_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)