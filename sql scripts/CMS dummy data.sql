USE CMD;

INSERT INTO Users
(username,password,firstName,lastName,phoneNumber,email,roleType)
VALUES
('sheldonjames',SHA2('cameron',265),'James','Cameron','0197885625','100075176@studets.swinburne.edu.my','Admin'),
('johnAdams',SHA2('johnAdams',265),'John','Adams','+0823445432','','Normal');

INSERT INTO Plantations
(plantationID,plantName,plantDescription)
VALUES
('MKCH','Misai Kuching','Flower plant near the alloza pond, used for herbal tea'),
('CHILI','Red Chili','Plant next to the papayas, used for making tonics for chickens');

INSERT INTO conditionlevels
(plantationID,dateTime,airTemp,humidity,windSpeed,lightIntensity,soilTemp,soilMoisture)
VALUES
('MKCH','2018-04-07 23:00:00.047',22,62,11,0,26,58),
('MKCH','2018-04-07 22:00:00.047',23,64,11,0,26,58),
('MKCH','2018-04-07 21:00:00.047',24,65,11,0,26,56),
('MKCH','2018-04-07 20:00:00.047',25,67,11,0,26,54),
('MKCH','2018-04-07 19:00:00.047',27,70,12,500,28,53),
('MKCH','2018-04-07 18:00:00.047',26,64,9,10000,28,56),
('MKCH','2018-04-07 17:00:00.047',25,65,10,24000,26,57),
('MKCH','2018-04-07 16:00:00.047',26,67,10,50000,26,56),
('MKCH','2018-04-07 15:00:00.047',28,65,10,49000,26,58),
('MKCH','2018-04-07 14:00:00.047',30,75,10,50000,26,55),
('MKCH','2018-04-07 13:00:00.047',29,75,10,50000,26,56),
('MKCH','2018-04-07 12:00:00.047',27,76,10,50000,26,55),
('MKCH','2018-04-07 11:00:00.047',26,70,10,30000,26,65),
('MKCH','2018-04-07 10:00:00.047',28,70,10,24000,26,54),
('MKCH','2018-04-07 9:00:00.047',27,66,10,15000,26,62),
('MKCH','2018-04-07 8:00:00.047',26,66,10,10000,26,62),
('MKCH','2018-04-07 7:00:00.047',25,67,10,900,26,62),
('MKCH','2018-04-07 6:00:00.047',25,64,10,150,26,62),
('MKCH','2018-04-07 5:00:00.047',25,63,10,0,26,62),
('MKCH','2018-04-07 4:00:00.047',24,60,10,0,26,62),
('MKCH','2018-04-07 3:00:00.047',24,57,10,0,26,62),
('MKCH','2018-04-07 2:00:00.047',22,56,10,0,26,62),
('MKCH','2018-04-07 1:00:00.047',23,56,10,0,26,62),
('MKCH','2018-04-07 0:00:00.047',22,60,10,0,26,62);

INSERT INTO OptimumLevels
(plantationID,airTemp,humidity,windSpeed,lightIntensity,soilTemp,soilMoisture)
VALUES
('MKCH','25-30','50-80','0-60','25000-50000','24-35','50-70');
