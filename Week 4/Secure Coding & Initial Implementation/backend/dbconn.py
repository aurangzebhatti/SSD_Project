# db.py
import pymysql

def get_db():
    return pymysql.connect(
        host='localhost',
        user='wms_user',
        password='secure_password_123',
        db='wms_db',
        cursorclass=pymysql.cursors.DictCursor
    )
