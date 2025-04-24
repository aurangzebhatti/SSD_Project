# inventory.py
from flask import Blueprint, request, jsonify
from middleware.auth_token import token_required
from middleware.audit_log import log_activity
from config.db import get_db
from config.secrets import AES_KEY, AES_IV
from Crypto.Cipher import AES
import base64

inventory_bp = Blueprint('inventory', __name__)

def encrypt_item_name(item_name):
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    padded = item_name + (16 - len(item_name) % 16) * chr(16 - len(item_name) % 16)
    encrypted = cipher.encrypt(padded.encode('utf-8'))
    return base64.b64encode(encrypted).decode('utf-8')

@inventory_bp.route('/inventory', methods=['POST'])
@token_required
@log_activity
def add_item(current_user):
    if current_user['role'] not in ['admin', 'staff']:
        return jsonify({'error': 'Insufficient permissions'}), 403

    data = request.json
    item_name = data.get('itemName')
    quantity = data.get('quantity')

    if not item_name or not isinstance(quantity, int) or quantity < 0:
        return jsonify({'error': 'Invalid input'}), 400

    conn = get_db()
    cursor = conn.cursor()
    encrypted_name = encrypt_item_name(item_name)

    try:
        cursor.execute("INSERT INTO inventory (item_name, quantity) VALUES (%s, %s)", (encrypted_name, quantity))
        conn.commit()
        return jsonify({'message': 'Item added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/audit-logs', methods=['GET'])
@token_required
@log_activity
def get_logs(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Admins only'}), 403

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM audit_logs")
    logs = cursor.fetchall()
    return jsonify(logs)
