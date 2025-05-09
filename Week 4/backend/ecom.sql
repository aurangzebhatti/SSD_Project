create database ecommerce;
CREATE TABLE ecommerce.users (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- User ID (auto-incremented)
    email VARCHAR(255) NOT NULL UNIQUE,       -- Email (unique and not null)
    password VARCHAR(255) NOT NULL,           -- Password (not null)
    name VARCHAR(50) DEFAULT NULL             -- Name (optional, can be null)
);
CREATE TABLE ecommerce.products (
    id INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(255) NOT NULL,              
    description TEXT DEFAULT NULL,       
    imgaddress VARCHAR(255) DEFAULT NULL,     
    price DECIMAL(10,2) NOT NULL,              
    category VARCHAR(100) DEFAULT NULL         
);
CREATE TABLE ecommerce.orders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  address TEXT,
  city VARCHAR(255),
  paymentMethod VARCHAR(50),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE ecommerce.orderdetail (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  orderId INT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INT NOT NULL,
  pricePerItem DECIMAL(10,2) NOT NULL,
  charges DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
);