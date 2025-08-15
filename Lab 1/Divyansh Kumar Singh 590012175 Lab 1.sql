CREATE DATABASE Bus_Station;

USE Bus_Station;

-- 3. 
-- Bus Table
CREATE TABLE Bus (
    Bus_No VARCHAR(10) PRIMARY KEY,
    Source VARCHAR(20),
    Destination VARCHAR(20),
    Couch_Type VARCHAR(20)
);

DESC Bus;


-- Reservation Table
CREATE TABLE Reservation (
    PNR_No INT PRIMARY KEY,
    Journey_date DATE,
    No_of_seats INT,
    Address VARCHAR(50),
    Contact_No BIGINT CHECK (LENGTH(Contact_No) = 10),
    Bus_No VARCHAR(10),
    Seat_No INT,
    FOREIGN KEY (Bus_No) REFERENCES Bus(Bus_No)
);

DESC Reservation;

-- Ticket Table
CREATE TABLE Ticket (
    Ticket_No INT PRIMARY KEY,
    Journey_date DATE,
    Age INT,
    Sex CHAR(10),
    Source VARCHAR(10),
    Destination VARCHAR(10),
    Dep_Time VARCHAR(10),
    Bus_No INT
);

DESC Ticket;

-- Passenger Table
CREATE TABLE Passenger (
    PNR_No INT PRIMARY KEY,
    Ticket_No INT,
    Name VARCHAR(15),
    Age INT,
    Sex ENUM('Male', 'Female'),  
    Contact_No BIGINT CHECK (LENGTH(Contact_No) = 10),
    FOREIGN KEY (Ticket_No) REFERENCES Ticket(Ticket_No)
);

DESC Passenger;

-- Cancellation Table
CREATE TABLE Cancellation (
    PNR_No INT PRIMARY KEY,
    Journey_date INT,  
    Seat_No VARCHAR(15),
    Contact_No BIGINT CHECK (LENGTH(Contact_No) = 10)
);

DESC Cancellation;

INSERT INTO Bus (Bus_No, Source, Destination, Couch_Type)
VALUES
('B001', 'Delhi', 'Jaipur', 'AC'),
('B002', 'Mumbai', 'Pune', 'Sleeper'),
('B003', 'Chennai', 'Bangalore', 'Semi-Deluxe');

INSERT INTO Reservation (PNR_No, Journey_date, No_of_seats, Address, Contact_No, Bus_No, Seat_No)
VALUES
(1001, '2025-08-20', 2, '123 MG Road, Delhi', 9876543210, 'B001', 12),
(1002, '2025-08-21', 1, '45 Andheri East, Mumbai', 9123456780, 'B002', 5),
(1003, '2025-08-22', 3, '78 T Nagar, Chennai', 9988776655, 'B003', 8);

INSERT INTO Ticket (Ticket_No, Journey_date, Age, Sex, Source, Destination, Dep_Time, Bus_No)
VALUES
(5001, '2025-08-20', 30, 'Male', 'Delhi', 'Jaipur', '08:00', 1),
(5002, '2025-08-21', 25, 'Female', 'Mumbai', 'Pune', '10:30', 2),
(5003, '2025-08-22', 40, 'Male', 'Chennai', 'Bangalore', '07:45', 3);


INSERT INTO Passenger (PNR_No, Ticket_No, Name, Age, Sex, Contact_No)
VALUES
(1001, 5001, 'Rajesh Kumar', 30, 'Male', 9876543210),
(1002, 5002, 'Anita Sharma', 25, 'Female', 9123456780),
(1003, 5003, 'Suresh Reddy', 40, 'Male', 9988776655);

INSERT INTO Cancellation (PNR_No, Journey_date, Seat_No, Contact_No)
VALUES
(1003, 20250822, '8', 9988776655);

SELECT * FROM Bus;
SELECT * FROM Reservation;
SELECT * FROM Ticket;
SELECT * FROM Passenger;
SELECT * FROM Cancellation;

-- 4.
ALTER TABLE Bus
ADD Bus_Fare DECIMAL(8,2);

DESC Bus;

-- 5.
DESC Ticket;

ALTER TABLE Ticket
MODIFY Sex VARCHAR(10);

DESC Ticket;

-- 6.
ALTER TABLE Bus
CHANGE Couch_Type Coach_Type VARCHAR(20);

DESC Bus;

-- 7.
ALTER TABLE Bus
MODIFY Bus_No VARCHAR(15),
MODIFY Source VARCHAR(50),
MODIFY Destination VARCHAR(50),
MODIFY Coach_Type VARCHAR(30);

DESC Bus;

ALTER TABLE Reservation
MODIFY Address VARCHAR(100),
MODIFY Contact_No BIGINT;  

ALTER TABLE Reservation
MODIFY Bus_No VARCHAR(15);

DESC Reservation;

ALTER TABLE Ticket
MODIFY Sex VARCHAR(10),
MODIFY Source VARCHAR(50),
MODIFY Destination VARCHAR(50),
MODIFY Dep_Time VARCHAR(20);

DESC Ticket;


ALTER TABLE Passenger
MODIFY Name VARCHAR(30),
MODIFY Sex VARCHAR(10);

DESC Passenger;


ALTER TABLE Cancellation
MODIFY Seat_No VARCHAR(20);

DESC Cancellation;

