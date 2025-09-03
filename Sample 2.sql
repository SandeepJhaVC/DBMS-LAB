CREATE DATABASE Sample;
USE Sample;

CREATE TABLE student
(
StudentID INT, 
Student_FirstName VARCHAR(20), 
Student_LastName VARCHAR(20), 
Student_PhoneNumber VARCHAR(20), 
Student_Email_ID VARCHAR(40)
);

ALTER TABLE student ADD INDEX (StudentID);
DESC student;
SHOW INDEXES FROM student;




DROP TABLE student;



