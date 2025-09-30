CREATE DATABASE IF NOT EXISTS Lab_4;

USE Lab_4;

CREATE TABLE employee (
    name VARCHAR(45) NOT NULL,
    occupation VARCHAR(35) NOT NULL,
    working_date date,
    working_hours VARCHAR(10)
);

DESC employee;

INSERT INTO
    employee
VALUES
    ('Robin', 'Scientist', '2020-10-04', 12),
    ('Warner', 'Engineer', '2020-10-04', 10),
    ('Peter', 'Actor', '2020-10-04', 13),
    ('Marco', 'Doctor', '2020-10-04', 14),
    ('Brayden', 'Teacher', '2020-10-04', 12),
    ('Antonio', 'Business', '2020-10-04', 11);

SELECT * FROM employee;

SELECT COUNT(name) FROM employee;

SELECT SUM(working_hours) AS "Total working hours" FROM employee;

SELECT AVG(working_hours) AS "Average working hours" FROM employee;

SELECT MIN(working_hours) AS Minimum_working_hours FROM employee;

SELECT MAX(working_hours) AS Maximum_working_hours FROM employee;

SELECT working_date FROM employee LIMIT 1;

SELECT working_hours FROM employee ORDER BY name DESC LIMIT 1;

CREATE TABLE employee2 (
    emp_id VARCHAR(45),
    emp_fname VARCHAR(10),
    emp_lname VARCHAR(10),
    dept_id VARCHAR(10),
    designation VARCHAR(25)
);

DESC employee2;

INSERT INTO
    employee2
VALUES
    (1, 'David', 'Miller', 2, 'Engineer'),
    (2, 'Peter', 'Watson', 3, 'Manager'),
    (3, 'Mark', 'Boucher', 1, 'Scientist'),
    (2, 'Peter', 'Watson', 3, 'BDE'),
    (1, 'David', 'Miller', 2, 'Developer'),
    (4, 'Adam', 'Warner', 4, 'Receptionist'),
    (3, 'Mark', 'Boucher', 1, 'Engineer'),
    (4, 'Adam', 'Warner', 4, 'Clerk');

SELECT * FROM employee2;

SELECT
    emp_id,
    emp_fname,
    emp_lname,
    dept_id,
    GROUP_CONCAT(designation) AS designation
FROM
    employee2
GROUP BY
    emp_id,
    emp_fname,
    emp_lname,
    dept_id;

SELECT
    emp_fname,
    dept_id,
    GROUP_CONCAT(DISTINCT designation) AS designation
FROM
    employee2
GROUP BY
    emp_id,
    emp_fname,
    emp_lname,
    dept_id;

SELECT
    emp_fname,
    GROUP_CONCAT(DISTINCT designation SEPARATOR ';') AS designation
FROM
    employee2
GROUP BY
    emp_id,
    emp_fname,
    emp_lname,
    dept_id;

SELECT
    GROUP_CONCAT(
        CONCAT_WS(',', emp_lname, emp_fname) SEPARATOR ';'
    ) AS employeename
FROM
    employee2;

-- MySQL String Function --
CREATE TABLE sample_table (
    id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

DESC sample_table;

INSERT INTO
    sample_table (id, first_name, last_name)
VALUES
    (1, 'John', 'Doe'),
    (2, 'Jane', 'Smith'),
    (3, 'Alice', 'Johnson');

SELECT * FROM sample_table;

SELECT id FROM sample_table;
SELECT first_name FROM sample_table;
SELECT last_name FROM sample_table;

SELECT
    CONCAT_WS('-', first_name, last_name) AS concat_ws_result
FROM
    sample_table;

SELECT
    CONCAT(first_name, ' ', last_name) AS concat_result
FROM
    sample_table;

SELECT
    CHARACTER_LENGTH(first_name) AS char_length_result
FROM
    sample_table;

SELECT
    ELT(1, first_name, last_name, 'Other') AS elt_result
FROM
    sample_table;

SELECT
    EXPORT_SET(id, 1, ',', '') AS export_set_result
FROM
    sample_table;

SELECT
    FIELD(first_name, 'Alice', 'Jane', 'John') AS field_result
FROM
    sample_table;

SELECT
    FIND_IN_SET(first_name, 'John,Jane,Alice') AS find_in_set_result
FROM
    sample_table;

SELECT
    FORMAT(id, 2) AS format_result
FROM
    sample_table;

SELECT
    FROM_BASE64('SGVsbG8gd29ybGQh') AS from_base64_result
FROM
    sample_table;

SELECT
    HEX(id) AS hex_result
FROM
    sample_table;

SELECT
INSERT
    (first_name, 2, 0, 'X') AS insert_result
FROM
    sample_table;

SELECT
    INSTR(first_name, 'hn') AS instr_result
FROM
    sample_table;

SELECT
    LCASE(first_name) AS lcase_result
FROM
    sample_table;

SELECT
    LEFT(first_name, 2) AS left_result
FROM
    sample_table;

SELECT
    LENGTH(first_name) AS length_result
FROM
    sample_table;

SELECT
    first_name LIKE 'J%' AS like_result
FROM
    sample_table;

SELECT
    LOAD_FILE('/path/to/file') AS load_file_result
FROM
    sample_table;

SELECT
    LOCATE('a', first_name) AS locate_result
FROM
    sample_table;

SELECT
    LOWER(first_name) AS lower_result
FROM
    sample_table;

SELECT
    LPAD(first_name, 10, '*') AS lpad_result
FROM
    sample_table;

SELECT
    LTRIM(' ' || first_name) AS ltrim_result
FROM
    sample_table;

SELECT
    MAKE_SET(2, 'Red', 'Green', 'Blue') AS make_set_result
FROM
    sample_table;

SELECT
    MID(first_name, 2, 2) AS mid_result
FROM
    sample_table;

SELECT
    OCTET_LENGTH(first_name) AS octet_length_result
FROM
    sample_table;

SELECT
    OCT(id) AS oct_result
FROM
    sample_table;

SELECT
    ORD(LEFT(first_name, 1)) AS ord_result
FROM
    sample_table;

SELECT
    POSITION('oh' IN first_name) AS position_result
FROM
    sample_table;

SELECT
    QUOTE(first_name) AS quote_result
FROM
    sample_table;

SELECT
REPEAT (first_name, 2) AS repeat_result
FROM
    sample_table;

SELECT
REPLACE
    (first_name, 'Jo', 'X') AS replace_result
FROM
    sample_table;

SELECT
    REVERSE(first_name) AS reverse_result
FROM
    sample_table;

SELECT
    RIGHT(last_name, 2) AS right_result
FROM
    sample_table;

SELECT
    RPAD(first_name, 10, '*') AS rpad_result
FROM
    sample_table;

SELECT
    RTRIM(first_name) AS rtrim_result
FROM
    sample_table;

SELECT
    SOUNDEX(first_name) AS soundex_result
FROM
    sample_table;

-- Mathematical Functions --
-- Creating a sample employee table
CREATE TABLE employee3 (
    employee_id INT PRIMARY KEY,
    salary DECIMAL(10, 2),
    age INT
);

-- Inserting sample data into the employee3 table
INSERT INTO
    employee3 (employee_id, salary, age)
VALUES
    (1, 50000.25, 30),
    (2, 60000.75, 35),
    (3, 75000.50, 28);

SELECT * FROM employee3;

SELECT employee_id FROM employee3;

-- Using various functions in SQL queries on the employee3 table
SELECT
    ABS(salary) AS abs_salary
FROM
    employee3;

SELECT
    ACOS(salary / 100000) AS acos_salary
FROM
    employee3;

SELECT
    SIGN(salary) AS sign_salary
FROM
    employee3;

SELECT
    SIN(salary / 100000) AS sin_salary
FROM
    employee3;

SELECT
    SQRT(salary) AS sqrt_salary
FROM
    employee3;
    
SELECT 
	salary AS sum_salary 
FROM 
	employee3;

SELECT
    TAN(salary / 100000) AS tan_salary
FROM
    employee3;

SELECT
TRUNCATE (salary, 2) AS truncated_salary
FROM
    employee3;

SELECT
    ASIN(salary / 100000) AS asin_salary
FROM
    employee3;

SELECT
    ATAN2(salary, age) AS atan2_salary
FROM
    employee3;

SELECT
    ATAN(salary / 100000) AS atan_salary
FROM
    employee3;
    
SELECT 
	salary AS avg_salary 
FROM 
	employee3;

SELECT
    CEIL(salary) AS ceil_salary
FROM
    employee3;

SELECT
    CEILING(salary) AS ceiling_salary
FROM
    employee3;

SELECT
    COS(salary / 100000) AS cos_salary
FROM
    employee3;

SELECT
    COT(salary / 100000) AS cot_salary
FROM
    employee3;

SELECT
    1 AS count_employee
FROM
    employee3;

SELECT
    DEGREES(salary / 100000) AS degrees_salary
FROM
    employee3;

SELECT
    salary DIV 2 AS div_salary
FROM
    employee3;

SELECT
    EXP(salary / 100000) AS exp_salary
FROM
    employee3;

SELECT
    FLOOR(salary) AS floor_salary
FROM
    employee3;

SELECT
    GREATEST(salary, 0, -50000) AS greatest_salary
FROM
    employee3;

SELECT
    LEAST(salary, 0, -50000) AS least_salary
FROM
    employee3;

SELECT
    LN(salary / 100000) AS ln_salary
FROM
    employee3;

SELECT
    LOG10(salary / 100000) AS log10_salary
FROM
    employee3;

SELECT
    LOG(salary / 100000, 2) AS log_salary
FROM
    employee3;

SELECT
    LOG2(salary / 100000) AS log2_salary
FROM
    employee3;

SELECT
    MAX(salary) AS max_salary
FROM
    employee3;

SELECT
    MIN(salary) AS min_salary
FROM
    employee3;

SELECT
    MOD(salary, 3) AS mod_salary
FROM
    employee3;

SELECT
    PI() AS pi_value
FROM
    employee3;

SELECT
    POWER(salary, 2) AS power_salary
FROM
    employee3;

SELECT
    POW(salary, 2) AS pow_salary
FROM
    employee3;

SELECT
    RADIANS(salary / 100000) AS radians_salary
FROM
    employee3;

SELECT
    RAND() AS rand_value
FROM
    employee3;

SELECT
    ROUND(salary, 2) AS round_salary
FROM
    employee3;
