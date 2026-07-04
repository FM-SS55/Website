import os
from flask_login import LoginManager, UserMixin
from werkzeug.security import check_password_hash

login_manager = LoginManager()
login_manager.login_view = 'admin.login'


class AdminUser(UserMixin):
    id = 'admin'

    def __init__(self):
        self.username = os.environ.get('ADMIN_USERNAME', 'admin')


@login_manager.user_loader
def load_user(user_id):
    if user_id == AdminUser.id:
        return AdminUser()
    return None


def verify_credentials(username, password):
    expected_user = os.environ.get('ADMIN_USERNAME', 'admin')
    expected_hash = os.environ.get('ADMIN_PASSWORD_HASH', '')
    if username != expected_user or not expected_hash:
        return False
    return check_password_hash(expected_hash, password)