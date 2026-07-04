from flask import Blueprint, jsonify
from db import get_db

api_bp = Blueprint('api', __name__)


@api_bp.route('/roles')
def api_roles():
    conn = get_db()
    rows = conn.execute(
        'SELECT id, title, category, location, employment_type FROM roles '
        'WHERE active = 1 ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@api_bp.route('/posts')
def api_posts():
    conn = get_db()
    rows = conn.execute(
        'SELECT id, title, body, image_url, created_at FROM posts '
        'WHERE published = 1 ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])