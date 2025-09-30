CREATE DATABASE IF NOT EXISTS lab_5;

USE lab_5;

------------------------------------------------------------------------
-- Question 3
CREATE TABLE Department (
    Dname VARCHAR(15) NOT NULL,
    Dnumber INT NOT NULL,
    Mgr_ssn CHAR(9),
    Mgr_start_date DATE,
    PRIMARY KEY (Dnumber),
    -- FOREIGN KEY (Mgr_ssn) REFERENCES Employee (Ssn),
    UNIQUE (Dname)
);

CREATE TABLE Employee (
    Fname VARCHAR(15) NOT NULL,
    Minit CHAR,
    lname VARCHAR(15),
    Ssn CHAR(9) NOT NULL,
    Bdate DATE,
    Address VARCHAR(30),
    Sex CHAR,
    Salary DECIMAL(10, 2),
    Super_ssn CHAR(9),
    Dno INT NOT NULL,
    PRIMARY KEY (Ssn),
    FOREIGN KEY (Dno) REFERENCES Department (Dnumber)
);

ALTER TABLE Department
ADD FOREIGN KEY (Mgr_ssn) REFERENCES Employee (Ssn);

CREATE TABLE Dept_locations (
    Dnumber INT NOT NULL,
    Dlocation VARCHAR(15) NOT NULL,
    PRIMARY KEY (Dnumber, Dlocation),
    FOREIGN KEY (Dnumber) REFERENCES Department (Dnumber)
);

CREATE TABLE Project (
    Pname VARCHAR(15) NOT NULL,
    Pnumber INT NOT NULL,
    Plocation VARCHAR(15),
    Dnum INT NOT NULL,
    PRIMARY KEY (Pnumber),
    UNIQUE (Pname),
    FOREIGN KEY (Dnum) REFERENCES Department (Dnumber)
);

CREATE TABLE Works_on (
    Essn CHAR(9) NOT NULL,
    Pno INT NOT NULL,
    Hours DECIMAL(3, 1) NOT NULL,
    PRIMARY KEY (Essn, Pno),
    FOREIGN KEY (Essn) REFERENCES Employee (Ssn),
    FOREIGN KEY (Pno) REFERENCES Project (Pnumber)
);

CREATE TABLE Dependent (
    Essn CHAR(9) NOT NULL,
    Dependent_name VARCHAR(15) NOT NULL,
    Sex CHAR,
    Bdate DATE,
    Relationship VARCHAR(8),
    PRIMARY KEY (Essn, Dependent_name),
    FOREIGN KEY (Essn) REFERENCES Employee (Ssn)
);

------------- Inserting data
INSERT INTO
    Department (Dname, Dnumber, Mgr_ssn, Mgr_start_date)
VALUES
    ('Research', 5, NULL, '1988-05-22'),
    ('Administration', 4, NULL, '1995-01-01'),
    ('Headquarters', 1, NULL, '1981-06-19');

INSERT INTO
    Employee (
        Fname,
        Minit,
        Lname,
        Ssn,
        Bdate,
        Address,
        Sex,
        Salary,
        Super_ssn,
        Dno
    )
VALUES
    (
        'John',
        'B',
        'Smith',
        '123456789',
        '1965-01-09',
        '731 Fondren, Houston TX',
        'M',
        30000,
        '333445555',
        5
    ),
    (
        'Franklin',
        'T',
        'Wong',
        '333445555',
        '1965-12-08',
        '638 Voss, Houston TX',
        'M',
        40000,
        '888665555',
        5
    ),
    (
        'Alicia',
        'J',
        'Zelaya',
        '999887777',
        '1968-01-19',
        '3321 Castle, Spring TX',
        'F',
        25000,
        '987654321',
        4
    ),
    (
        'Jennifer',
        'S',
        'Wallace',
        '987654321',
        '1941-06-20',
        '291 Berry, Bellaire TX',
        'F',
        43000,
        '888665555',
        4
    ),
    (
        'Ramesh',
        'K',
        'Narayan',
        '666884444',
        '1962-09-15',
        '975 Fire Oak, Humble TX',
        'M',
        38000,
        '333445555',
        5
    ),
    (
        'Joyce',
        'A',
        'English',
        '453453453',
        '1972-07-31',
        '5631 Rice, Houston TX',
        'F',
        25000,
        '333445555',
        5
    ),
    (
        'Ahmad',
        'V',
        'Jabbar',
        '987987987',
        '1969-03-29',
        '980 Dallas, Houston TX',
        'M',
        25000,
        '987654321',
        4
    ),
    (
        'James',
        'E',
        'Borg',
        '888665555',
        '1937-11-10',
        '450 Stone, Houston TX',
        'M',
        55000,
        NULL,
        1
    );

SELECT * FROM Department;

UPDATE Department
SET
    Mgr_ssn = '333445555'
WHERE
    Dnumber = 5;

UPDATE Department
SET
    Mgr_ssn = '987654321'
WHERE
    Dnumber = 4;

UPDATE Department
SET
    Mgr_ssn = '888665555'
WHERE
    Dnumber = 1;
    
SELECT * FROM Department;

INSERT INTO
    Project (Pname, Pnumber, Plocation, Dnum)
VALUES
    ('ProductX', 1, 'Bellaire', 5),
    ('ProductY', 2, 'Sugarland', 5),
    ('ProductZ', 3, 'Houston', 5),
    ('Computerization', 10, 'Stafford', 4),
    ('Reorganization', 20, 'Houston', 1),
    ('Newbenefits', 30, 'Stafford', 4);

INSERT INTO
    Works_on (Essn, Pno, Hours)
VALUES
    ('123456789', 1, 32.5),
    ('123456789', 2, 7.5),
    ('666884444', 3, 40.0),
    ('453453453', 1, 20.0),
    ('453453453', 2, 20.0),
    ('333445555', 2, 10.0),
    ('333445555', 3, 10.0),
    ('333445555', 10, 10.0),
    ('333445555', 20, 10.0),
    ('999887777', 30, 30.0),
    ('999887777', 10, 10.0),
    ('987987987', 10, 35.0),
    ('987987987', 30, 5.0),
    ('987654321', 30, 20.0),
    ('987654321', 20, 15.0),
    ('888665555', 20, 12.0);

INSERT INTO
    DEPENDENT (
        Essn,
        Dependent_name,
        Sex,
        Bdate,
        Relationship
    )
VALUES
    (
        '333445555',
        'Alice',
        'F',
        '1986-04-04',
        'Daughter'
    ),
    (
        '333445555',
        'Theodore',
        'M',
        '1983-10-25',
        'Son'
    ),
    (
        '333445555',
        'Joy',
        'F',
        '1958-05-03',
        'Spouse'
    ),
    (
        '987654321',
        'Abner',
        'M',
        '1942-02-28',
        'Spouse'
    ),
    (
        '123456789',
        'Michael',
        'M',
        '1988-01-04',
        'Son'
    ),
    (
        '123456789',
        'Alice',
        'F',
        '1988-12-30',
        'Daughter'
    ),
    (
        '123456789',
        'Elizabeth',
        'F',
        '1967-05-05',
        'Spouse'
    );

INSERT INTO
    Dept_locations (Dnumber, Dlocation)
VALUES
    (1, 'Houston'),
    (4, 'Stafford'),
    (5, 'Bellaire'),
    (5, 'Houston'),
    (5, 'Sugarland');


SELECT * FROM Employee;

SELECT * FROM Project;

SELECT * FROM Works_on;

SELECT * FROM DEPENDENT;

SELECT * FROM Dept_locations;

------------------------------------------------------------------------
-- Question 4
CREATE TABLE CLIENT_MASTER (
    CLIENTNO VARCHAR(6) PRIMARY KEY CHECK (CLIENTNO LIKE 'C%'),
    NAME VARCHAR(20) NOT NULL,
    ADDRESS1 VARCHAR(30),
    ADDRESS2 VARCHAR(30),
    CITY VARCHAR(15),
    PINCODE INT,
    STATE VARCHAR(15),
    BALDUE DECIMAL(10, 2)
);

CREATE TABLE PRODUCT_MASTER (
    PRODUCTNO VARCHAR(6) PRIMARY KEY CHECK (PRODUCTNO LIKE 'P%'),
    DESCRIPTION VARCHAR(15) NOT NULL,
    PROFITPERCENT DECIMAL(4, 2) NOT NULL,
    UNIT_MEASURE VARCHAR(10) NOT NULL,
    QTYONHAND INT NOT NULL,
    REORDERLVL INT NOT NULL,
    SELLPRICE DECIMAL(8, 2) NOT NULL,
    COSTPRICE DECIMAL(8, 2) NOT NULL
);

CREATE TABLE SALESMAN_MASTER (
    SALESMANNO VARCHAR(6) PRIMARY KEY CHECK (SALESMANNO LIKE 'S%'),
    SALESMANNAME VARCHAR(20) NOT NULL,
    ADDRESS1 VARCHAR(30) NOT NULL,
    ADDRESS2 VARCHAR(30),
    CITY VARCHAR(20),
    PINCODE INT,
    STATE VARCHAR(20),
    SALAMT DECIMAL(8, 2) NOT NULL CHECK (SALAMT <> 0),
    TGTTOGET DECIMAL(6, 2) NOT NULL CHECK (TGTTOGET <> 0),
    YTDSALES DECIMAL(6, 2) NOT NULL,
    REMARKS VARCHAR(60)
);

INSERT INTO
    CLIENT_MASTER (
        CLIENTNO,
        NAME,
        CITY,
        PINCODE,
        STATE,
        BALDUE
    )
VALUES
    (
        'C00001',
        'Ivan bayross',
        'Mumbai',
        400054,
        'Maharashtra',
        15000
    ),
    (
        'C00002',
        'Mamta muzumdar',
        'Madras',
        780001,
        'Tamil Nadu',
        0
    ),
    (
        'C00003',
        'Chhaya bankar',
        'Mumbai',
        400057,
        'Maharashtra',
        5000
    ),
    (
        'C00004',
        'Ashwini joshi',
        'Bangalore',
        560001,
        'Karnataka',
        0
    ),
    (
        'C00005',
        'Hansel colaco',
        'Mumbai',
        400060,
        'Maharashtra',
        2000
    ),
    (
        'C00006',
        'Deepak sharma',
        'Mangalore',
        560050,
        'Karnataka',
        0
    );

INSERT INTO
    PRODUCT_MASTER
VALUES
    (
        'P00001',
        'T-Shirt',
        5,
        'Piece',
        200,
        50,
        350,
        250
    ),
    (
        'P0345',
        'Shirts',
        6,
        'Piece',
        150,
        50,
        500,
        350
    ),
    (
        'P06734',
        'Cotton jeans',
        5,
        'Piece',
        100,
        20,
        600,
        450
    ),
    (
        'P07865',
        'Jeans',
        5,
        'Piece',
        100,
        20,
        750,
        500
    ),
    (
        'P07868',
        'Trousers',
        2,
        'Piece',
        150,
        50,
        850,
        550
    ),
    (
        'P07885',
        'Pull Overs',
        2.5,
        'Piece',
        80,
        30,
        700,
        450
    ),
    (
        'P07965',
        'Denim jeans',
        4,
        'Piece',
        100,
        40,
        350,
        250
    ),
    (
        'P07975',
        'Lycra tops',
        5,
        'Piece',
        70,
        30,
        300,
        175
    ),
    (
        'P08865',
        'Skirts',
        5,
        'Piece',
        75,
        30,
        450,
        300
    );

INSERT INTO
    SALESMAN_MASTER (
        SALESMANNO,
        SALESMANNAME,
        ADDRESS1,
        ADDRESS2,
        CITY,
        PINCODE,
        STATE,
        SALAMT,
        TGTTOGET,
        YTDSALES,
        REMARKS
    )
VALUES
    (
        'S00001',
        'Aman',
        'A/14 Worli',
        NULL,
        'Mumbai',
        400002,
        'Maharashtra',
        3000,
        100,
        50,
        NULL
    ),
    (
        'S00002',
        'Omkar',
        '65 Nariman',
        NULL,
        'Mumbai',
        400001,
        'Maharashtra',
        3500,
        200,
        75,
        NULL
    ),
    (
        'S00003',
        'Raj',
        'P-7 Bandra',
        NULL,
        'Mumbai',
        400032,
        'Maharashtra',
        3000,
        150,
        60,
        NULL
    ),
    (
        'S00004',
        'Ashish',
        'A/5 Juhu',
        NULL,
        'Mumbai',
        400044,
        'Maharashtra',
        3500,
        120,
        55,
        NULL
    );

SELECT NAME FROM CLIENT_MASTER;

SELECT * FROM CLIENT_MASTER;

SELECT NAME, CITY, STATE FROM CLIENT_MASTER;

SELECT DESCRIPTION FROM PRODUCT_MASTER;

SELECT  * FROM CLIENT_MASTER
WHERE CITY = 'Mumbai';

SELECT SALESMANNAME FROM SALESMAN_MASTER
WHERE SALAMT = 3000;

UPDATE CLIENT_MASTER
SET CITY = 'Bangalore'
WHERE CLIENTNO = 'C00005';

UPDATE CLIENT_MASTER
SET BALDUE = 1000
WHERE CLIENTNO = 'C00001';

SET SQL_SAFE_UPDATES = 0;

UPDATE PRODUCT_MASTER
SET COSTPRICE = 950
WHERE DESCRIPTION = 'Trousers';

UPDATE SALESMAN_MASTER
SET CITY = 'Pune';

DELETE FROM SALESMAN_MASTER
WHERE SALAMT = 3500;

DELETE FROM PRODUCT_MASTER
WHERE QTYONHAND = 100;

DELETE FROM CLIENT_MASTER
WHERE STATE = 'Tamil Nadu';

ALTER TABLE CLIENT_MASTER
ADD Telephone BIGINT;

ALTER TABLE PRODUCT_MASTER
MODIFY SELLPRICE DECIMAL(10, 2);

DROP TABLE CLIENT_MASTER;

SELECT * FROM PRODUCT_MASTER;

SELECT * FROM SALESMAN_MASTER;
