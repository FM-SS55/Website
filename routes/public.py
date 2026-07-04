from flask import Blueprint, render_template
from db import get_db

public_bp = Blueprint('public', __name__)


@public_bp.route('/')
def home():
    return render_template('home.html')


# ---- Services ----

@public_bp.route('/services')
def services_index():
    return render_template('services/index.html')


@public_bp.route('/services/facilities-management')
def service_facilities_management():
    return render_template('services/facilities-management.html')


@public_bp.route('/services/property-management')
def service_property_management():
    return render_template('services/property-management.html')


@public_bp.route('/services/maintenance-repairs')
def service_maintenance_repairs():
    return render_template('services/maintenance-repairs.html')


# ---- Sectors ----

@public_bp.route('/sectors')
def sectors_index():
    return render_template('sectors/index.html')


@public_bp.route('/sectors/offices')
def sector_offices():
    return render_template('sectors/offices.html')


@public_bp.route('/sectors/retail')
def sector_retail():
    return render_template('sectors/retail.html')


@public_bp.route('/sectors/industrial')
def sector_industrial():
    return render_template('sectors/industrial.html')


# ---- Insights, careers, contact ----

@public_bp.route('/insights')
def insights():
    conn = get_db()
    posts = conn.execute(
        'SELECT id, title, body, image_url, created_at FROM posts '
        'WHERE published = 1 ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return render_template('insights.html', posts=posts)


@public_bp.route('/careers')
def careers():
    conn = get_db()
    roles = conn.execute(
        'SELECT id, title, category, location, employment_type FROM roles '
        'WHERE active = 1 ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return render_template('careers.html', roles=roles)


@public_bp.route('/contact')
def contact():
    return render_template('contact.html')