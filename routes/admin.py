import os
import time
from flask import Blueprint, request, redirect, url_for, render_template
from flask_login import login_user, logout_user, login_required
from werkzeug.utils import secure_filename

from db import get_db
from auth import AdminUser, verify_credentials

admin_bp = Blueprint('admin', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def upload_dir():
    from flask import current_app
    return os.path.join(current_app.static_folder, 'uploads')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------- Auth ----------

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        if verify_credentials(username, password):
            login_user(AdminUser())
            return redirect(url_for('admin.dashboard'))
        return render_template('admin/login.html', error='Incorrect username or password.')
    return render_template('admin/login.html', error=None)


@admin_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('admin.login'))


# ---------- Dashboard ----------

@admin_bp.route('/')
@login_required
def dashboard():
    conn = get_db()
    roles = conn.execute('SELECT * FROM roles ORDER BY created_at DESC').fetchall()
    posts = conn.execute('SELECT * FROM posts ORDER BY created_at DESC').fetchall()
    conn.close()
    return render_template('admin/dashboard.html', roles=roles, posts=posts)


# ---------- Roles CRUD ----------

@admin_bp.route('/roles', methods=['POST'])
@login_required
def add_role():
    title = request.form.get('title', '').strip()
    category = request.form.get('category', '').strip()
    location = request.form.get('location', '').strip()
    employment_type = request.form.get('employment_type', '').strip()
    if title and category and location and employment_type:
        conn = get_db()
        conn.execute(
            'INSERT INTO roles (title, category, location, employment_type) VALUES (?, ?, ?, ?)',
            (title, category, location, employment_type)
        )
        conn.commit()
        conn.close()
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/roles/<int:role_id>/toggle', methods=['POST'])
@login_required
def toggle_role(role_id):
    conn = get_db()
    row = conn.execute('SELECT active FROM roles WHERE id = ?', (role_id,)).fetchone()
    if row:
        conn.execute('UPDATE roles SET active = ? WHERE id = ?', (0 if row['active'] else 1, role_id))
        conn.commit()
    conn.close()
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/roles/<int:role_id>/delete', methods=['POST'])
@login_required
def delete_role(role_id):
    conn = get_db()
    conn.execute('DELETE FROM roles WHERE id = ?', (role_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin.dashboard'))


# ---------- Posts CRUD ----------

@admin_bp.route('/posts', methods=['POST'])
@login_required
def add_post():
    title = request.form.get('title', '').strip()
    body = request.form.get('body', '').strip()
    image_url = None

    file = request.files.get('image')
    if file and file.filename and allowed_file(file.filename):
        filename = f"{int(time.time())}-{secure_filename(file.filename)}"
        file.save(os.path.join(upload_dir(), filename))
        image_url = f"/static/uploads/{filename}"

    if title and body:
        conn = get_db()
        conn.execute(
            'INSERT INTO posts (title, body, image_url) VALUES (?, ?, ?)',
            (title, body, image_url)
        )
        conn.commit()
        conn.close()
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/posts/<int:post_id>/toggle', methods=['POST'])
@login_required
def toggle_post(post_id):
    conn = get_db()
    row = conn.execute('SELECT published FROM posts WHERE id = ?', (post_id,)).fetchone()
    if row:
        conn.execute('UPDATE posts SET published = ? WHERE id = ?', (0 if row['published'] else 1, post_id))
        conn.commit()
    conn.close()
    return redirect(url_for('admin.dashboard'))


@admin_bp.route('/posts/<int:post_id>/delete', methods=['POST'])
@login_required
def delete_post(post_id):
    conn = get_db()
    conn.execute('DELETE FROM posts WHERE id = ?', (post_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin.dashboard'))