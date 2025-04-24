# secrets.py
import os
from base64 import b64decode

# In production, load these from environment variables or a secure key vault
JWT_SECRET = os.getenv('JWT_SECRET', 'your-jwt-secret-key')
AES_KEY = b64decode(os.getenv('AES_KEY', 'MDEyMzQ1Njc4OWFiY2RlZg=='))  # Base64 32-byte key
AES_IV = b64decode(os.getenv('AES_IV', 'MDEyMzQ1Njc4OWFiY2RlZg=='))     # Base64 16-byte IV
