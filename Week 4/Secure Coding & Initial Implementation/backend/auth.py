# auth.py
from flask import Blueprint, request, jsonify
import bcrypt, jwt, pyotp
from datetime import datetime, timedelta
from config.db import get_db
from config.secrets import JWT_SECRET

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or role not in ['admin', 'staff']:
        return jsonify({'error': 'Invalid input'}), 400

    conn = get_db()
    cursor = conn.cursor()
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    mfa_secret = pyotp.random_base32()

    try:
        cursor.execute("INSERT INTO users (username, password, role, mfa_secret) VALUES (%s, %s, %s, %s)",
                       (username, hashed_pw, role, mfa_secret))
        conn.commit()
        return jsonify({'message': 'User registered', 'mfa_secret': mfa_secret}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    mfa_code = data.get('mfaCode')

    if not username or not password or not mfa_code:
        return jsonify({'error': 'Missing credentials'}), 400

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'error': 'Invalid username or password'}), 401

    if not pyotp.TOTP(user['mfa_secret']).verify(mfa_code):
        return jsonify({'error': 'Invalid MFA code'}), 401

    token = jwt.encode({'id': user['id'], 'role': user['role'], 'exp': datetime.utcnow() + timedelta(hours=1)}, JWT_SECRET, algorithm='HS256')
    return jsonify({'token': token})
