-- Step 1: Create the database
-- Step 2: Switch to the new database
-- In pgAdmin, just connect to it. In psql CLI: 
-- Step 3: Create tables

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(10) CHECK (role IN ('admin', 'staff')) NOT NULL,
mfa_secret VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
id SERIAL PRIMARY KEY,
item_name VARCHAR(255) NOT NULL,
quantity INTEGER NOT NULL CHECK (quantity >= 0),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
action VARCHAR(255) NOT NULL,
timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create user and grant permissions (optional for local dev)
-- Note: PostgreSQL roles are a bit different from MySQL users
-- You can skip this if using the default 'postgres' role or create:
CREATE ROLE wms_user WITH LOGIN PASSWORD 'secure_password_123';
GRANT CONNECT ON DATABASE ecommerce TO wms_user;
GRANT USAGE ON SCHEMA public TO wms_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO wms_user;

