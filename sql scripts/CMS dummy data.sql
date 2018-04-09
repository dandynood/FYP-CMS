USE CMD;

INSERT INTO Users
(username,password,firstName,lastName,phoneNumber,email,roleType)
VALUES
('sheldonjames','cameron','James','Cameron','0197885625','100075176@studets.swinburne.edu.my','Admin'),
('johnAdams','johnAdams','John','Adams','+0823445432','','Normal');

INSERT INTO Plantations
(plantationID,plantName,plantDescription)
VALUES
('MKCH','Misai Kuching','Flower plant near the alloza pond, used for herbal tea'),
('CHILI','Red Chili','Plant next to the papayas, used for making tonics for chickens');

INSERT INTO conditionlevels
(plantationID,dateTime,airTemp,humidity,windSpeed,lightIntensity,soilTemp,soilMoisture)
VALUES
('MKCH',2018-04-07 20:00:00.047,28,78,11,27000,26,58),
('MKCH','2018-04-07 18:00:00.047',30,80,9,30000,28,43),
('MKCH','2018-04-07 17:00:00.047',24,60,10,24000,26,62);

INSERT INTO OptimumLevels
(plantationID,airTemp,humidity,windSpeed,lightIntensity,soilTemp,soilMoisture)
VALUES
('MKCH','25-30','50-80','0-60','25000-50000','24-35','50-70');