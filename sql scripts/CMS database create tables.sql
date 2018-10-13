DROP DATABASE CMD;
CREATE DATABASE CMD;
USE CMD;

-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
CREATE TABLE Users(
userID INT NOT NULL auto_increment,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
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
plantDescription VARCHAR(255),
numOfPlants VARCHAR(255),
nodeNumber VARCHAR(10),
PRIMARY KEY (plantationID)
);

-- -----------------------------------------------------
-- Table PlantationYields
-- -----------------------------------------------------
CREATE TABLE PlantationYields(
plantationID varchar(10) NOT NULL,
monthYear DATE NOT NULL,
yield varchar(50) NOT NULL,
PRIMARY KEY (plantationID,monthYear),
FOREIGN KEY (plantationID) REFERENCES Plantations(plantationID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table ConditionLevels
-- -----------------------------------------------------
CREATE TABLE ConditionLevels(
plantationID varchar(10) NOT NULL,
dateTime TIMESTAMP NOT NULL,
airTemp FLOAT,
humidity FLOAT,
lightIntensity FLOAT,
soilMoisture FLOAT,
PRIMARY KEY (plantationID, dateTime),
FOREIGN KEY (plantationID) REFERENCES Plantations(plantationID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table OptimumLevels
-- -----------------------------------------------------
CREATE TABLE OptimumLevels(
plantationID varchar(10) NOT NULL,
airTemp varchar(20),
humidity varchar(20),
lightIntensity varchar(20),
soilMoisture varchar(20),
PRIMARY KEY (plantationID),
FOREIGN KEY (plantationID) REFERENCES Plantations(plantationID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Notifications
-- -----------------------------------------------------
CREATE TABLE NotfMsgs(
msgID INT NOT NULL auto_increment,
fullMsg VARCHAR (1000) NOT NULL,
dateTime TIMESTAMP NOT NULL,
admin VARCHAR(50) NOT NULL,
type VARCHAR(15) NOT NULL,
PRIMARY KEY(msgID)
);

-- -----------------------------------------------------
-- Table NotifyUsers
-- -----------------------------------------------------
CREATE TABLE NotfUsers(
msgID INT,
userID INT NOT NULL,
ifread TINYINT(1) NOT NULL,
PRIMARY KEY(msgID, userID),
FOREIGN KEY (msgID) REFERENCES NotfMsgs(msgID) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (userID) REFERENCES Users(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Trigger NotifyUsersTrigger
-- -----------------------------------------------------
DELIMITER $$
DROP TRIGGER IF EXISTS notifyuserstrigger $$
CREATE TRIGGER notifyuserstrigger AFTER INSERT ON notfmsgs
 FOR EACH ROW BEGIN
INSERT INTO notfusers (msgID, userID, ifRead)
    SELECT new.msgID, users.userID, 0
            FROM users;
END $$
DELIMITER ;