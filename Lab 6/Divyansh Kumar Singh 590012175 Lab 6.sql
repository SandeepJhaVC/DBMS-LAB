CREATE DATABASE IF NOT EXISTS lab_6;

USE lab_6;

-- Date and time functions
CREATE TABLE student (
    ID INT,
    Name VARCHAR(50),
    DateTime_Birth DATETIME,
    City VARCHAR(50)
);

INSERT INTO
    student
VALUES
    (
        1,
        'Mansi Shah',
        '2010-01-01 18:39:09',
        'Pune'
    ),
    (
        2,
        'Tejal Wagh',
        '2010-03-04 05:13:19',
        'Nasik'
    ),
    (
        3,
        'Sejal Kumari',
        '2010-05-01 10:31:07',
        'Mumbai'
    ),
    (
        4,
        'Sonal Jain',
        '2010-09-09 17:17:07',
        'Shimla'
    ),
    (
        5,
        'Surili Maheshwari',
        '2010-07-10 20:45:18',
        'Surat'
    );

SELECT
    ID
FROM
    student;

SELECT
    Name
FROM
    student;

SELECT
    DateTime_Birth
FROM
    student;

SELECT
    CURDATE() AS currentdate;

SELECT
    DATE_ADD(DateTime_Birth, INTERVAL 3 DAY) AS date_added
FROM
    student;

SELECT
    DATE_FORMAT(DateTime_Birth, '%Y-%m-%d') AS formatted_date
FROM
    student;

SELECT
    DATEDIFF(CURDATE(), DATE(DateTime_Birth)) AS date_diff
FROM
    student;

SELECT
    DAY(DateTime_Birth) AS day_value
FROM
    student;

SELECT
    DAYNAME(DateTime_Birth) AS day_name
FROM
    student;

SELECT
    DAYOFMONTH(DateTime_Birth) AS day_of_month
FROM
    student;

SELECT
    DAYOFWEEK(DateTime_Birth) AS day_of_week
FROM
    student;

SELECT
    DAYOFYEAR(DateTime_Birth) AS day_of_year
FROM
    student;

SELECT
    FROM_DAYS(737846) AS from_days_date
FROM
    student;

SELECT
    HOUR(DateTime_Birth) AS hour_value
FROM
    student;

SELECT
    LAST_DAY(DateTime_Birth) AS last_day_of_month
FROM
    student;

SELECT
    NOW() AS current_datetime
FROM
    student;

SELECT
    PERIOD_ADD(202201, 3) AS period_added
FROM
    student;

SELECT
    PERIOD_DIFF(202203, 202201) AS period_difference
FROM
    student;

SELECT
    QUARTER(DateTime_Birth) AS quarter_value
FROM
    student;

SELECT
    SECOND(DateTime_Birth) AS second_value
FROM
    student;

SELECT
    STR_TO_DATE('2022-05-20', '%Y-%m-%d') AS string_to_date
FROM
    student;

SELECT
    SUBDATE(DateTime_Birth, INTERVAL 2 DAY) AS date_subtracted
FROM
    student;

SELECT
    SUBTIME(DateTime_Birth, '03:15:00') AS time_subtracted
FROM
    student;

SELECT
    SYSDATE() AS system_date
FROM
    student;

SELECT
    TIME(DateTime_Birth) AS time_value
FROM
    student;

SELECT
    TIME_FORMAT(DateTime_Birth, '%H:%i:%s') AS formatted_time
FROM
    student;

SELECT
    TIME_TO_SEC(DateTime_Birth) AS time_to_seconds
FROM
    student;

SELECT
    TIMEDIFF(NOW(), DateTime_Birth) AS time_difference
FROM
    student;

SELECT
    TIMESTAMP('2022-04-10') AS timestamp_value
FROM
    student;

SELECT
    TO_DAYS('2022-06-15') AS to_days_value
FROM
    student;

SELECT
    WEEKDAY(DateTime_Birth) AS weekday_index
FROM
    student;

SELECT
    WEEK(DateTime_Birth) AS week_value
FROM
    student;

SELECT
    WEEKOFYEAR(DateTime_Birth) AS week_of_year_value
FROM
    student;

-- Conditional Functions
CREATE TABLE sample_table (
    column1 INT,
    column2 VARCHAR(50),
    column3 DATE
);

INSERT INTO
    sample_table
VALUES
    (1, 'apple', '2022-01-01'),
    (2, 'banana', '2022-02-15'),
    (3, 'orange', '2022-03-20'),
    (4, 'grape', '2022-04-10'),
    (5, 'kiwi', '2022-05-05');

SELECT
    *
FROM
    sample_table
WHERE
    column1 > 2
    AND column3 > '2022-03-01';

SELECT
    *
FROM
    sample_table
WHERE
    column1 = 2
    OR column2 = 'orange';

SELECT
    *
FROM
    sample_table
WHERE
    (
        column1 > 2
        AND column3 > '2022-03-01'
    )
    OR column2 = 'banana';

SELECT
    *
FROM
    sample_table
WHERE
    column2 LIKE 'a%';

SELECT
    *
FROM
    sample_table
WHERE
    column1 IN (2, 4);

SELECT
    *
FROM
    sample_table
WHERE
    column1 > ANY (
        SELECT
            column1
        FROM
            sample_table
        WHERE
            column3 > '2022-03-01'
    );

SELECT
    *
FROM
    sample_table
WHERE
    EXISTS (
        SELECT
            *
        FROM
            sample_table
        WHERE
            column1 = 3
    );

SELECT
    *
FROM
    sample_table
WHERE
    NOT column1 = 2;

SELECT
    *
FROM
    sample_table
WHERE
    column1 <> 2;

SELECT
    *
FROM
    sample_table
WHERE
    column2 IS NULL;

SELECT
    *
FROM
    sample_table
WHERE
    column2 IS NOT NULL;

SELECT
    *
FROM
    sample_table
WHERE
    column1 BETWEEN 2 AND 4;

---- Control flow functions
-- CASE operator
SELECT
    CASE 1
        WHEN 1 THEN 'this is case one'
        WHEN 2 THEN 'this is case two'
        ELSE 'this is not in the case'
    END AS 'how to execute case statement';

SELECT
    CASE 4
        WHEN 1 THEN 'this is case one'
        WHEN 2 THEN 'this is case two'
        ELSE 'this is not in the case'
    END AS 'how to execute case statement';

SELECT
    CASE 2
        WHEN 1 THEN 'this is case one'
        WHEN 2 THEN 'this is case two'
        ELSE 'this is not in the case'
    END AS 'how to execute case statement';

SELECT
    CASE
        WHEN 2 > 3 THEN 'this is true'
        ELSE 'this is false'
    END;

SELECT
    CASE
        WHEN 2 < 3 THEN 'this is true'
        ELSE 'this is false'
    END;

SELECT
    CASE BINARY 'A'
        WHEN 'a' THEN 1
        WHEN 'b' THEN 2
    END;

CREATE TABLE student_grades (student_id INT, grade INT);

INSERT INTO
    student_grades (student_id, grade)
VALUES
    (1, 95),
    (2, 85),
    (3, 75),
    (4, 60);

CREATE TABLE employee_data (employee_id INT, salary DECIMAL(10, 2));

INSERT INTO
    employee_data (employee_id, salary)
VALUES
    (101, 120000),
    (102, 75000),
    (103, 45000),
    (104, 110000);

CREATE TABLE product_inventory (product_id INT, quantity INT);

INSERT INTO
    product_inventory (product_id, quantity)
VALUES
    (1, 75),
    (2, 20),
    (3, 5),
    (4, 100);

CREATE TABLE customer_orders (order_id INT, order_status VARCHAR(20));

INSERT INTO
    customer_orders (order_id, order_status)
VALUES
    (1, 'Shipped'),
    (2, 'Processing'),
    (3, 'Cancelled'),
    (4, 'Pending');

CREATE TABLE temperature_readings (
    location VARCHAR(50),
    temperature DECIMAL(5, 2)
);

INSERT INTO
    temperature_readings (location, temperature)
VALUES
    ('City A', 32.5),
    ('City B', 25.0),
    ('City C', 18.5),
    ('City D', 28.0);

-- Display grades based on conditions
SELECT
    student_id,
    grade,
    CASE
        WHEN grade >= 90 THEN 'A'
        WHEN grade BETWEEN 80 AND 89  THEN 'B'
        WHEN grade BETWEEN 70 AND 79  THEN 'C'
        ELSE 'F'
    END AS grade_category
FROM
    student_grades;

-- Categorize employees based on salary
SELECT
    employee_id,
    salary,
    CASE
        WHEN salary > 100000 THEN 'High Income'
        WHEN salary BETWEEN 50000 AND 100000  THEN 'Moderate Income'
        ELSE 'Low Income'
    END AS income_category
FROM
    employee_data;

-- Determine product availability based on quantity
SELECT
    product_id,
    quantity,
    CASE
        WHEN quantity > 50 THEN 'In Stock'
        WHEN quantity BETWEEN 10 AND 50  THEN 'Low Stock'
        ELSE 'Out of Stock'
    END AS availability_status
FROM
    product_inventory;

-- Categorize orders based on status
SELECT
    order_id,
    order_status,
    CASE
        WHEN order_status = 'Shipped' THEN 'Order Shipped'
        WHEN order_status = 'Processing' THEN 'Order Processing'
        WHEN order_status = 'Cancelled' THEN 'Order Cancelled'
        ELSE 'Unknown Status'
    END AS order_category
FROM
    customer_orders;

-- Categorize temperature readings based on conditions
SELECT
    location,
    temperature,
    CASE
        WHEN temperature > 30 THEN 'Hot'
        WHEN temperature BETWEEN 20 AND 30  THEN 'Moderate'
        ELSE 'Cool'
    END AS temperature_category
FROM
    temperature_readings;

-- IF() control flow
CREATE TABLE books (
    book_id VARCHAR(10),
    book_name VARCHAR(50),
    isbn_no VARCHAR(11),
    cate_id VARCHAR(10),
    aut_id VARCHAR(10),
    pub_id VARCHAR(10),
    dt_of_pub DATE,
    pub_lang VARCHAR(20),
    no_page INT,
    book_price DECIMAL(8, 2)
);

INSERT INTO
    books
VALUES
    (
        'BK001',
        'Introduction to Electrodynamics',
        '0000979001',
        'CA001',
        'AUT001',
        'P003',
        '2001-05-08',
        'English',
        201,
        85.00
    ),
    (
        'BK002',
        'Understanding of Steel Construction',
        '0000979002',
        'CA002',
        'AUT002',
        'P001',
        '2003-07-15',
        'English',
        300,
        105.50
    ),
    (
        'BK003',
        'Guide to Networking',
        '0000979003',
        'CA003',
        'AUT003',
        'P002',
        '2002-09-10',
        'Hindi',
        510,
        200.00
    ),
    (
        'BK004',
        'Transfer of Heat and Mass',
        '0000979004',
        'CA002',
        'AUT004',
        'P004',
        '2004-02-16',
        'English',
        600,
        250.00
    ),
    (
        'BK005',
        'Conceptual Physics',
        '0000979005',
        'CA001',
        'AUT005',
        'P006',
        '2003-07-16',
        NULL,
        345,
        145.00
    ),
    (
        'BK006',
        'Fundamentals of Heat',
        '0000979006',
        'CA001',
        'AUT006',
        'P005',
        '2003-08-10',
        'German',
        247,
        112.00
    ),
    (
        'BK007',
        'Advanced 3d Graphics',
        '0000979007',
        'CA003',
        'AUT007',
        'P002',
        '2004-02-16',
        'Hindi',
        165,
        56.00
    ),
    (
        'BK008',
        'Human Anatomy',
        '0000979008',
        'CA005',
        'AUT008',
        'P006',
        '2001-05-17',
        'German',
        88,
        50
    ),
    (
        'BK009',
        'Mental Health Nursing',
        '0000979009',
        'CA005',
        'AUT009',
        'P007',
        '2004-02-10',
        'English',
        350,
        145.00
    ),
    (
        'BK010',
        'Fundamentals of Thermodynamics',
        '0000979010',
        'CA002',
        'AUT010',
        'P007',
        '2002-10-14',
        'English',
        400,
        225.00
    ),
    (
        'BK011',
        'The Experimental Analysis of Cat',
        '0000979011',
        'CA004',
        'AUT011',
        'P005',
        '2007-06-09',
        'French',
        225,
        95.00
    ),
    (
        'BK012',
        'The Nature of World',
        '0000979012',
        'CA004',
        'AUT005',
        'P008',
        '2005-12-20',
        'English',
        350,
        88.00
    ),
    (
        'BK013',
        'Environment a Sustainable Future',
        '0000979013',
        'CA004',
        'AUT012',
        'P001',
        '2003-10-27',
        'German',
        165,
        100.00
    ),
    (
        'BK014',
        'Concepts in Health',
        '0000979014',
        'CA005',
        'AUT013',
        'P004',
        '2001-08-25',
        NULL,
        320,
        00
    ),
    (
        'BK015',
        'Anatomy & Physiology',
        '0000979015',
        'CA005',
        'AUT014',
        'P008',
        '2000-10-10',
        'Hindi',
        225,
        135.00
    ),
    (
        'BK016',
        'Networks and Telecommunications',
        '00009790_16',
        'CA003',
        'AUT015',
        'P003',
        '2002-01-01',
        'French',
        95,
        45.00
    );

SELECT
    *
FROM
    books;

SELECT
    book_name,
    IF(
        pub_lang = "English",
        "Engllish Book",
        "Other Lnaguage"
    ) AS Language
FROM
    books;

SELECT
    book_name,
    isbn_no,
    IF(
        (
            SELECT
                COUNT(*)
            FROM
                books
            WHERE
                pub_lang = 'English'
        ) > (
            SELECT
                COUNT(*)
            FROM
                books
            WHERE
                pub_lang <> 'English'
        ),
        (CONCAT("Pages: ", no_page)),
        (CONCAT("Price: ", book_price))
    ) AS "Page / Price"
FROM
    books;

SELECT
    book_id,
    book_name,
    IF(pub_lang IS NULL, 'N/A', pub_lang) AS "Pub. Language"
FROM
    books;

SELECT
    book_id,
    book_name,
    pub_lang
FROM
    books;

CREATE TABLE purchase (
    invoice_no VARCHAR(10),
    invoice_dt DATE,
    ord_no VARCHAR(20),
    ord_date DATE,
    receive_dt DATE,
    book_id VARCHAR(10),
    book_name VARCHAR(50),
    pub_lang VARCHAR(20),
    cate_id VARCHAR(10),
    receive_qty INT,
    purch_price DECIMAL(8, 2),
    total_cost DECIMAL(10, 2)
);

INSERT INTO
    purchase
VALUES
    (
        'INV0001',
        '2008-07-15',
        'ORD/08-09/0001',
        '2008-07-06',
        '2008-07-19',
        'BK001',
        'Introduction to
Electrodynamics',
        'English',
        'CA001',
        15,
        75.00,
        1125.00
    ),
    (
        'INV0002',
        '2008-08-25',
        'ORD/08-09/0002',
        '2008-08-09',
        '2008-08-28',
        'BK004',
        'Transfer of
Heat and Mass',
        'English',
        'CA002',
        8,
        55.00,
        440.00
    ),
    (
        'INV0003',
        '2008-09-20',
        'ORD/08-09/0003',
        '2008-09-15',
        '2008-09-23',
        'BK005',
        'Conceptual
Physics',
        NULL,
        'CA001',
        20,
        20.00,
        400.00
    ),
    (
        'INV0004',
        '2007-08-30',
        'ORD/07-08/0005',
        '2007-08-22',
        '2007-08-30',
        'BK004',
        'Transfer of
Heat and Mass',
        'English',
        'CA002',
        15,
        35.00,
        525.00
    ),
    (
        'INV0005',
        '2007-07-28',
        'ORD/07-08/0004',
        '2007-06-25',
        '2007-07-30',
        'BK001',
        'Introduction to
Electrodynamics',
        'English',
        'CA001',
        8,
        25.00,
        200.00
    ),
    (
        'INV0006',
        '2007-09-24',
        'ORD/07-08/0007',
        '2007-09-20',
        '2007-09-30',
        'BK003',
        'Guide to
Networking',
        'Hindi',
        'CA003',
        20,
        45.00,
        900.00
    );

SELECT
    *
FROM
    purchase;

SELECT
    SUM(IF(pub_lang = 'English', 1, 0)) AS English,
    SUM(IF(pub_lang <> 'English', 1, 0)) AS "Non English"
FROM
    purchase;

CREATE TABLE publishers (
    pub_id VARCHAR(10),
    pub_name VARCHAR(50),
    pub_city VARCHAR(30),
    country VARCHAR(30),
    country_office VARCHAR(30),
    no_of_branch INT,
    estd DATE
);

INSERT INTO
    publishers
VALUES
    (
        'P001',
        'Jex Max Publication',
        'New York',
        'USA',
        'New York',
        15,
        '1969-12-25'
    ),
    (
        'P002',
        'BPP Publication',
        'Mumbai',
        'India',
        'New Delhi',
        10,
        '1985-10-01'
    ),
    (
        'P003',
        'New Harrold Publication',
        'Adelaide',
        'Australia',
        'Sydney',
        6,
        '1975-09-05'
    ),
    (
        'P004',
        'Ultra Press Inc.',
        'London',
        'UK',
        'London',
        8,
        '1948-07-10'
    ),
    (
        'P005',
        'Mountain Publication',
        'Houstan',
        'USA',
        'Sun Diego',
        25,
        '1975-01-01'
    ),
    (
        'P006',
        'Summer Night Publication',
        'New York',
        'USA',
        'Atlanta',
        10,
        '1990-12-10'
    ),
    (
        'P007',
        'Pieterson Grp. of Publishers',
        'Cambridge',
        'UK',
        'London',
        6,
        '1950-07-15'
    ),
    (
        'P008',
        'Novel Publisher Ltd.',
        'New Delhi',
        'India',
        'Bangalore',
        10,
        '2000-01-01'
    );

SELECT
    *
FROM
    publishers;

SELECT
    COUNT(IF(country = 'USA', 1, NULL)) USA,
    COUNT(IF(country = 'UK', 1, NULL)) UK,
    COUNT(IF(country = 'India', 1, NULL)) India,
    COUNT(IF(country = 'Australia', 1, NULL)) Australia
FROM
    publishers;

SELECT
    country,
    COUNT(country)
FROM
    publishers
GROUP BY
    country;
