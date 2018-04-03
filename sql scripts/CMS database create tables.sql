CREATE DATABASE CMD;
USE CMD;

-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
CREATE TABLE Users(
userID INT NOT NULL auto_increment,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(20) NOT NULL,
firstName VARCHAR(20) NOT NULL,
lastName VARCHAR(20) NOT NULL,
phoneNumber VARCHAR(50),
email VARCHAR(255),
roleType VARCHAR(10) NOT NULL,
CHECK (accountType = 'Normal' OR accountType = 'Admin'),
PRIMARY KEY (userID)
);

-- -----------------------------------------------------
-- Table Plantations
-- -----------------------------------------------------
CREATE TABLE Plantations(
plantationID varchar(10) NOT NULL,
plantName VARCHAR(255) NOT NULL,
plantDescription VARCHAR(255) NOT NULL,
PRIMARY KEY (plantationID)
);

-- -----------------------------------------------------
-- Table ConditionLevels
-- -----------------------------------------------------
CREATE TABLE ConditionLevels(
plantationID varchar(10) NOT NULL,
dateTime TIMESTAMP NOT NULL,
airTemp FLOAT,
humidity FLOAT,
windSpeed FLOAT,
lightIntensity FLOAT,
soilTemp FLOAT,
soilMoisture FLOAT,
PRIMARY KEY (plantationID, dateTime),
FOREIGN KEY (plantationID) REFERENCES Plantations(plantationID)
);

-- -----------------------------------------------------
-- Table OptimumLevels
-- -----------------------------------------------------
CREATE TABLE OptimumLevels(
plantationID varchar(10) NOT NULL,
airTemp varchar(20),
humidity varchar(20),
windSpeed varchar(20),
lightIntensity varchar(20),
soilTemp varchar(20),
soilMoisture varchar(20),
PRIMARY KEY (plantationID),
FOREIGN KEY (plantationID) REFERENCES Plantations(plantationID)
);