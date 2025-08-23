CREATE DATABASE Sample;
USE Sample;

CREATE TABLE student(
StudentID INT NOT NULL, 
Student_FirstName VARCHAR(20), 
Student_LastName VARCHAR(20), 
Student_PhoneNumber VARCHAR(20), 
Student_Email_ID VARCHAR(40)
);

DESC student;

ALTER TABLE student CHANGE StudentID StudentID INT NOT NULL;

DESC student;