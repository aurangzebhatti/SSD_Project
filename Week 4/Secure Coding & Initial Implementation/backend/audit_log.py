# audit_log.py
from functools import wraps
from flask import request
from config.db import get_db

def log_activity(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        conn = get_db()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO audit_logs (user_id, action, timestamp) VALUES (%s, %s, NOW())",
                (current_user['id'], f"{request.method} {request.path}")
            )
            conn.commit()
        except Exception as e:
            print("Logging error:", e)
        return f(current_user, *args, **kwargs)
    return decorated
