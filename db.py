import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'anchorline.db')
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn


def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            employment_type TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            image_url TEXT,
            published INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    ''')
    conn.commit()

    count = conn.execute('SELECT COUNT(*) AS c FROM roles').fetchone()['c']
    if count == 0:
        starter_roles = [
            ('Facility Technician', 'Maintenance', 'On-site', 'Full-time'),
            ('Site Supervisor', 'Operations', 'On-site', 'Full-time'),
            ('Housekeeping Staff', 'Housekeeping', 'On-site', 'Full-time / Part-time'),
            ('Security Guard', 'Security', 'On-site', 'Shift-based'),
        ]
        conn.executemany(
            'INSERT INTO roles (title, category, location, employment_type) VALUES (?, ?, ?, ?)',
            starter_roles
        )
        conn.commit()

    conn.close()