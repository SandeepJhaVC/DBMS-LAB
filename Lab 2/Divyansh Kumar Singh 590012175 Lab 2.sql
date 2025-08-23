CREATE DATABASE TechCo;

USE TechCo;

-- Question 1
-- Create Products table
CREATE TABLE Products (
    ProductID INT NOT NULL,
    ProductName VARCHAR(50) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Manufacturer VARCHAR(50) NOT NULL
);
DESC Products;

-- Create Customers table
CREATE TABLE Customers (
    CustomerID INT NOT NULL,
    CustomerName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL
);
DESC Customers;

-- Question 2
-- Inserting records into Products
INSERT INTO Products (ProductID, ProductName, UnitPrice, Manufacturer)
VALUES 
    (1, 'Laptop', 999.99, 'TechBrand'),
    (2, 'Smartphone', 699.99, 'MobileTech'),
    (3, 'Tablet', 349.99, 'GadgetCorp');

SELECT * FROM Products;

-- Inserting records into Customers
INSERT INTO Customers (CustomerID, CustomerName, Email)
VALUES 
    (101, 'Divyansh', 'divyansh@email.com'),
    (102, 'Sauhard', 'sauhard@email.com'),
    (103, 'Sarthak', 'Sarthak@email.com');

SELECT * FROM Customers;

-- Question 3
ALTER TABLE Customers 
ADD PhoneNumber VARCHAR(15) NOT NULL DEFAULT '0000000000' 
CHECK (LENGTH(PhoneNumber) = 10);

DESC Customers;

-- Question 4
ALTER TABLE Customers
ADD CONSTRAINT unique_email UNIQUE (Email);

DESC Customers;

-- This will fail due to duplicate email:
INSERT INTO Customers (CustomerID, CustomerName, Email, PhoneNumber)
VALUES (104, 'Test User', 'divyansh@email.com', '1234567890');

-- Question 5
ALTER TABLE Products
ADD PRIMARY KEY (ProductID);

ALTER TABLE Customers
ADD PRIMARY KEY (CustomerID);

DESC Products;
DESC Customers;

-- Question 6
CREATE TABLE Orders (
    OrderID INT NOT NULL PRIMARY KEY,
    CustomerID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

DESC Orders;

-- Question 7
ALTER TABLE Orders
ADD OrderQuantity INT NOT NULL DEFAULT 1,
ADD CONSTRAINT chk_quantity CHECK (OrderQuantity BETWEEN 1 AND 100);

DESC Orders;

-- Question 8
ALTER TABLE Orders
ADD OrderStatus VARCHAR(20) DEFAULT 'Pending';

DESC Orders;

-- Question 9
CREATE INDEX idx_unitprice ON Products(UnitPrice);

-- Explanation:
-- This index will speed up queries that filter or sort by UnitPrice
-- Example of improved query:
SELECT * FROM Products WHERE UnitPrice > 500 ORDER BY UnitPrice;

-- Question 10
INSERT INTO Orders (OrderID, CustomerID, OrderQuantity)
VALUES 
    (1004, 101, 2),
    (1005, 102, 56),
    (1006, 101, 52);

-- Now the query:
SELECT DISTINCT c.CustomerName, c.Email
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID;

-- Question 11
-- First verify which orders will be updated
SELECT OrderID, CustomerID, OrderStatus 
FROM Orders 
WHERE OrderQuantity > 50;

-- Then perform the update using the primary key
UPDATE Orders o
JOIN (
    SELECT OrderID 
    FROM Orders 
    WHERE OrderQuantity > 50
) t ON o.OrderID = t.OrderID
SET o.OrderStatus = 'Shipped';

SELECT * FROM Orders;

-- Question 12
DELETE FROM Products
WHERE UnitPrice < 10;

-- Verify:
SELECT * FROM Products;

-- Question 13
ALTER TABLE Products
MODIFY COLUMN UnitPrice FLOAT NOT NULL;

DESC Products;

-- Question 14
SELECT AVG(UnitPrice) AS AveragePrice
FROM Products;

DROP DATABASE TechCo;