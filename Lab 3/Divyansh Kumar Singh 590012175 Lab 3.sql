CREATE DATABASE Lab_3;
USE Lab_3;

-- 1. Student_Details
CREATE TABLE Student_Details (
    Student_RollNo INT PRIMARY KEY,
    Stu_Name VARCHAR(50),
    Stu_Marks INT,
    Stu_City VARCHAR(50)
);
DESC Student_Details;

-- 2. Faculty_Details
CREATE TABLE Faculty_Details (
    Faculty_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    Dept_ID INT,
    Address VARCHAR(100)
);
DESC Faculty_Details;

-- 3. Department
CREATE TABLE Department (
    Dept_ID INT PRIMARY KEY,
    Faculty_ID INT,
    Dept_Name VARCHAR(50),
    FOREIGN KEY (Faculty_ID) REFERENCES Faculty_Details(Faculty_ID)
);
DESC Department;

-- 3b. Department_Emp
CREATE TABLE Department_Emp (
    Dept_ID INT PRIMARY KEY,
    Dept_Name VARCHAR(50),
    Emp_ID INT,
    Dept_Grade CHAR(1)
);
DESC Department_Emp;

-- 4. Old_Employee
CREATE TABLE Old_Employee (
    Emp_ID INT PRIMARY KEY,
    Emp_Name VARCHAR(50),
    Emp_Salary DECIMAL(10,2),
    Address VARCHAR(100)
);
DESC Old_Employee;

-- 5. New_Employee
CREATE TABLE New_Employee (
    Emp_ID INT PRIMARY KEY,
    Emp_Name VARCHAR(50),
    Emp_Salary DECIMAL(10,2),
    Address VARCHAR(100)
);
DESC New_Employee;

-- 6. Employee_Details
CREATE TABLE Employee_Details (
    Emp_ID INT PRIMARY KEY,
    Emp_Name VARCHAR(50),
    Emp_Salary DECIMAL(10,2),
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES Department_Emp(Dept_ID)
);
DESC Employee_Details;

-- 7. Student
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    City VARCHAR(50)
);
DESC Student;

-- 8. Student2
CREATE TABLE Student2 (
    Student_ID INT PRIMARY KEY,
    City VARCHAR(50)
);
DESC Student2;

-- 9. Orders
CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY,
    Cust_ID INT,
    Order_Date DATE
);
DESC Orders;

-- 10. Sales
CREATE TABLE Sales (
    Product_Category VARCHAR(50),
    Sales_Amount DECIMAL(10,2)
);
DESC Sales;

-- 11. Top_Students
CREATE TABLE Top_Students (
    Student_ID INT PRIMARY KEY,
    Top_Marks INT
);
DESC Top_Students;

-- 12. Customer
CREATE TABLE Customer (
    Cust_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    Age INT,
    Occupation VARCHAR(50)
);
DESC Customer;

----------------------------------------------------
-- Insert Data
----------------------------------------------------

INSERT INTO Student_Details VALUES
(1001, 'Akhil', 85, 'Agra'),
(1002, 'Balram', 78, 'Delhi'),
(1003, 'Bheem', 87, 'Gurgaon'),
(1004, 'Chetan', 95, 'Noida'),
(1005, 'Diksha', 99, 'Agra'),
(1006, 'Raman', 90, 'Ghaziabad'),
(1007, 'Sheetal', 68, 'Delhi');
SELECT * FROM Student_Details;

INSERT INTO Faculty_Details VALUES
(101, 'Bheem', 1, 'Gurgaon'),
(102, 'Chetan', 2, 'Noida'),
(103, 'Diksha', NULL, 'Agra'),
(104, 'Raman', 4, 'Ghaziabad'),
(105, 'Yatin', 3, 'Noida'),
(106, 'Anuj', NULL, 'Agra'),
(107, 'Rakes', 5, 'Gurgaon');
SELECT * FROM Faculty_Details;

INSERT INTO Department VALUES
(1, 101, 'BCA'),
(2, 102, 'B.Tech'),
(3, 105, 'BBA'),
(4, 104, 'MBA'),
(5, 107, 'MCA');
SELECT * FROM Department;

INSERT INTO Department_Emp VALUES
(401, 'Administration', 1008, 'C'),
(402, 'HR', 1004, 'A'),
(403, 'Testing', 1002, 'C'),
(404, 'Coding', 1001, 'B'),
(405, 'Sales', 1003, 'A'),
(406, 'Marketing', NULL, 'C'),
(407, 'Accounting', 1005, 'C');
SELECT * FROM Department_Emp;

INSERT INTO Old_Employee VALUES
(1001, 'Akhil', 50000, 'Agra'),
(1002, 'Balram', 25000, 'Delhi'),
(1003, 'Bheem', 45000, 'Gurgaon'),
(1004, 'Chetan', 60000, 'Noida'),
(1005, 'Diksha', 30000, 'Agra'),
(1006, 'Raman', 50000, 'Ghaziabad'),
(1007, 'Sheetal', 35000, 'Delhi');
SELECT * FROM Old_Employee;

INSERT INTO New_Employee VALUES
(1008, 'Sumit', 50000, 'Agra'),
(1009, 'Akash', 55000, 'Delhi'),
(1010, 'Devansh', 65000, 'Gurgaon');
SELECT * FROM New_Employee;

INSERT INTO Employee_Details VALUES
(1001, 'Akhil', 50000, 404),
(1002, 'Balram', 25000, 403),
(1003, 'Bheem', 45000, 405),
(1004, 'Chetan', 60000, 402),
(1005, 'Ram', 65000, 407),
(1006, 'Shyam', 55500, 401),
(1007, 'Shobhit', 60000, 406);
SELECT * FROM Employee_Details;

INSERT INTO Student VALUES
(1, 'Peter', 'Texas'),
(2, 'Suzi', 'California'),
(3, 'Joseph', 'Alaska'),
(4, 'Andrew', 'Los Angeles'),
(5, 'Brayan', 'New York');
SELECT * FROM Student;

INSERT INTO Student2 VALUES
(1, 'Texas'),
(2, 'California'),
(3, 'Alaska'),
(4, 'Los Angeles'),
(5, 'New York');
SELECT * FROM Student2;

INSERT INTO Orders VALUES
(1, 101, '2023-01-15'),
(2, 102, '2023-02-20'),
(3, 103, '2023-03-10'),
(4, 104, '2023-04-05'),
(5, 105, '2023-05-12');
SELECT * FROM Orders;

INSERT INTO Sales VALUES
('Electronics', 15000.00),
('Clothing', 8500.00),
('Books', 3200.00),
('Furniture', 21000.00);
SELECT * FROM Sales;

INSERT INTO Top_Students VALUES
(1001, 95),
(1003, 92),
(1005, 98),
(1006, 91);
SELECT * FROM Top_Students;

INSERT INTO Customer VALUES
(101, 'John', 28, 'Engineer'),
(102, 'Alice', 32, 'Doctor'),
(103, 'Robert', 40, 'Teacher'),
(104, 'Sophia', 25, 'Student'),
(105, 'David', 35, 'Businessman');
SELECT * FROM Customer;

----------------------------------------------------
-- Subquery Questions
----------------------------------------------------

-- Q1 Retrieve the names and marks of students whose marks are greater 
-- than the average marks.
SELECT * FROM Student_Details
WHERE Stu_Marks > (SELECT AVG(Stu_Marks) FROM Student_Details);


-- Q2 Fetch the names and addresses of faculties who belong to 
-- departments in either 'Noida' or ‘Gurgaon.'
SELECT * FROM Department
WHERE Faculty_ID IN (
    SELECT Faculty_ID FROM Faculty_Details
    WHERE Address = 'Noida' OR Address = 'Gurgaon'
);


-- Q3 Insert the details of employees from the "Old_Employee" table 
-- into the "New_Employee" table, considering only those with a salary
-- greater than 40000.
INSERT INTO New_Employee
SELECT * FROM Old_Employee
WHERE Emp_Salary > 40000;
SELECT * FROM New_Employee;

-- Another Query using ```INSERT``` 
INSERT INTO New_Employee
SELECT * 
FROM Old_Employee
WHERE Emp_ID = ANY (
    SELECT Emp_ID 
    FROM Department_Emp 
    WHERE Dept_ID IN (406, 407)
);
SELECT * FROM New_Employee;


-- Q4 Increase the salary of employees by 10% for those whose 
-- department grade is ‘A.'
UPDATE Employee_Details
SET Emp_Salary = Emp_Salary + 5000
WHERE Emp_ID IN (SELECT Emp_ID FROM Department_Emp WHERE Dept_Grade = 'A');
SELECT * FROM Employee_Details;

-- Q5 Delete the records of employees whose department grade is ‘C.’
DELETE FROM Employee_Details
WHERE Emp_ID IN (SELECT Emp_ID FROM Department_Emp WHERE Dept_Grade = 'C');
SELECT * FROM Employee_Details;

-- Subquery with Comparison Operator
-- Query 1
SELECT * 
FROM Employee_Details
WHERE Emp_ID IN (
    SELECT Emp_ID FROM Employee_Details
    WHERE Emp_Salary > 35000
);
-- This query selects all employees from Employee_Details whose salary 
-- is greater than 35000.

-- Query 2
SELECT Emp_Name, Emp_Salary, Dept_ID
FROM Employee_Details
WHERE Emp_Salary = (SELECT MAX(Emp_Salary) FROM Employee_Details);
-- This query shows the employee(s) with the maximum salary in the company.


-- Q6 Retrieve the names of students who do not belong to the city 'Los 
-- Angeles' based on data from the "Student2" table.
SELECT Name, City FROM Student
WHERE City NOT IN (SELECT City FROM Student2 WHERE City = 'Los Angeles');

-- Q7 Use a subquery in the FROM clause to create a derived table showing 
-- the maximum, minimum, and average number of items for each order.
SELECT MAX(items), MIN(items), FLOOR(AVG(items))
FROM (
    SELECT COUNT(Order_ID) AS items
    FROM Orders
    GROUP BY Order_Date
) AS OrderSummary;


-- Q8 Fetch the names, cities, and incomes of employees whose income is 
-- higher than the average income of employees in their respective cities.
SELECT Emp_Name, Dept_ID, Emp_Salary
FROM Employee_Details e
WHERE Emp_Salary > (
    SELECT AVG(Emp_Salary)
    FROM Employee_Details
    WHERE Dept_ID = e.Dept_ID
);

-- Q9 Retrieve the name, occupation, and age of customers who have placed 
-- at least one order using the EXISTS operator.

SELECT Name, Occupation, Age
FROM Customer C
WHERE EXISTS (SELECT * FROM Orders O WHERE C.Cust_ID = O.Cust_ID);

-- Q10 Retrieve all columns for customers whose (cust_id, occupation) matches 
-- any row of (order_id, order_date) from the "Orders" table.
SELECT * FROM Customer C
WHERE ROW(Cust_ID, Occupation) = (
    SELECT Order_ID, Order_Date FROM Orders O WHERE C.Cust_ID = O.Cust_ID
);

-- Q11 Find customers whose cust_id is greater than all cust_ids in the
-- "Orders" table.

SELECT Cust_ID, Name FROM Customer
WHERE Cust_ID > ALL (SELECT Cust_ID FROM Orders);

-- Q12 Write an SQL query using a subquery within another subquery to retrieve 
-- names and salaries of employees who earn more than the average salary of 
-- employees in the "IT" department.
SELECT Emp_Name, Emp_Salary
FROM Employee_Details
WHERE Emp_Salary > (
    SELECT AVG(Emp_Salary) FROM Employee_Details
    WHERE Dept_ID = (SELECT Dept_ID FROM Department_Emp WHERE Dept_Name = 'HR')
);

-- Q13 Using the "Sales" table, find the total sales amount for each product 
-- category, displaying only those categories where the total sales amount is 
-- greater than the average total sales amount.
SELECT Product_Category, SUM(Sales_Amount) AS Total_Sales
FROM Sales
GROUP BY Product_Category
HAVING SUM(Sales_Amount) > (
    SELECT AVG(SumSales) FROM (
        SELECT SUM(Sales_Amount) AS SumSales
        FROM Sales GROUP BY Product_Category
    ) AS SalesSummary
);

-- Q14 Retrieve department names and the count of employees in each department, 
-- filtering out departments where the count is less than 5.

SELECT D.Dept_Name, COUNT(E.Emp_ID) AS EmployeeCount
FROM Employee_Details E
JOIN Department_Emp D ON E.Dept_ID = D.Dept_ID
GROUP BY D.Dept_Name
HAVING COUNT(E.Emp_ID) >= 5;

-- Q15 Write an SQL query involving multiple subqueries to retrieve information 
-- about employees based on various conditions.

SELECT Emp_Name, Emp_Salary, Dept_ID
FROM Employee_Details
WHERE Emp_Salary > (SELECT AVG(Emp_Salary) FROM Employee_Details)
  AND Dept_ID IN (SELECT Dept_ID FROM Department_Emp WHERE Dept_Grade = 'A');

-- Q16 Find the names and marks of students who scored between 80 and 90.
SELECT Stu_Name, Stu_Marks
FROM Student_Details
WHERE Stu_Marks BETWEEN 80 AND 90;

-- Q17 Insert the details of employees from the "Old_Employee" table into the 
-- "New_Employee" table, considering only those with a salary greater than 
-- the average salary of all employees.
INSERT INTO New_Employee (Emp_ID, Emp_Name, Emp_Salary, Address)
SELECT o.Emp_ID, o.Emp_Name, o.Emp_Salary, o.Address
FROM Old_Employee o
WHERE Emp_Salary > (SELECT AVG(Emp_Salary) FROM Old_Employee)
ON DUPLICATE KEY UPDATE 
    Emp_Name = o.Emp_Name,
    Emp_Salary = o.Emp_Salary,
    Address = o.Address;

SELECT * FROM New_Employee;

 
-- Q18 Retrieve the names of students who scored more marks than ANY student 
-- from the "Top_Students" table.
SELECT Stu_Name
FROM Student_Details
WHERE Stu_Marks > ANY (SELECT Top_Marks FROM Top_Students);

-- Q19 Update the salary of employees by 5% for those whose department is 'HR' 
-- and the salary is less than the average salary of HR department employees.

UPDATE Employee_Details e
JOIN (
    SELECT AVG(Emp_Salary) AS avg_salary
    FROM Employee_Details
    WHERE Dept_ID = (SELECT Dept_ID FROM Department_Emp WHERE Dept_Name = 'HR')
) t
SET e.Emp_Salary = e.Emp_Salary * 1.05
WHERE e.Dept_ID = (SELECT Dept_ID FROM Department_Emp WHERE Dept_Name = 'HR')
  AND e.Emp_Salary < t.avg_salary;

SELECT * FROM Employee_Details;

-- Q20 Fetch the names and ages of customers who have NOT placed any orders 
-- based on the data from the "Orders" table.

SELECT Name, Age FROM Customer C
WHERE NOT EXISTS (SELECT * FROM Orders O WHERE C.Cust_ID = O.Cust_ID);
