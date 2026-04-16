-- Create database
CREATE DATABASE IF NOT EXISTS supermarket_db;
USE supermarket_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products inventory
CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers for sales records
CREATE TABLE IF NOT EXISTS Customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales header
CREATE TABLE IF NOT EXISTS Sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  user_id INT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE RESTRICT
);

-- Sale line items for each transaction
CREATE TABLE IF NOT EXISTS Sale_Details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES Sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT
);

-- Example seed user (password: admin123)
INSERT IGNORE INTO Users (name, email, password, role)
VALUES ('Administrator', 'admin@kicukiro.supermarket', '$2b$10$QyAqKuT0sGekgO5bGy5x8OMjBge7xLjzPx7ZkB/-Gx2C6QGZ5JcK6', 'admin');

-- Example products
INSERT IGNORE INTO Products (name, description, price, stock)
VALUES
  ('Milk 1L', 'Fresh milk from local dairy', 1.20, 50),
  ('Rice 5kg', 'Premium long-grain rice', 12.50, 25),
  ('Cooking Oil 2L', 'Vegetable oil for cooking', 8.00, 30);

-- Example customers
INSERT IGNORE INTO Customers (name, phone, email, address)
VALUES
  ('Jean Uwimana', '+250788123456', 'jean@example.com', 'Kicukiro, Kigali'),
  ('Aline Mukamana', '+250788987654', 'aline@example.com', 'Kicukiro District, Kigali');
