# sanitizer.py
import re

def sanitize_input(text):
    # Remove HTML tags and escape characters
    clean = re.sub(r'<.*?>', '', text)
    return clean.strip()
