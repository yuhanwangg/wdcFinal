-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: WDCProject
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `WDCProject`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `WDCProject` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `WDCProject`;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `adminID` int NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`adminID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (3,'Georgia','McLeod','testEmail2@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$qJErDWThE0DkSx/uhWCtig$QLa9WIe1CxzuWk6GMte8DNSUckKKhEqqTNwFjnQmZMg'),(4,'Lucy','Fidock','lucy.fidock@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$mFngQY9wSd+jwHlhNV9ysA$34OW+AcyN+U+TSKl+FN7/nWH4UZk5PGIJH9MFFdxmpE');
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branch`
--

DROP TABLE IF EXISTS `Branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `branchID` int NOT NULL,
  `branchName` varchar(255) DEFAULT NULL,
  `suburb` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `orgID` int NOT NULL,
  `instated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`branchID`),
  KEY `orgID` (`orgID`),
  CONSTRAINT `Branch_ibfk_1` FOREIGN KEY (`orgID`) REFERENCES `Organisations` (`orgID`) ON DELETE CASCADE,
  CONSTRAINT `fk_organisation_branches` FOREIGN KEY (`orgID`) REFERENCES `Organisations` (`orgID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,'Red Cross','Norwood','SA','5067','Australia',1,1),(2,'Mary Potter Foundation','Adelaide','SA','5000','Australia',2,1),(3,'Norwood Branch','Norwood','SA','5067','Australia',2,1),(4,'Adelaide Branch','Norwood','SA','5067','Australia',2,1),(5,'Henley Beach Branch','Norwood','SA','5067','Australia',2,1),(6,'Sydney Branch','Sydney','NSW','5067','Australia',2,0),(8,'Main Branch',NULL,NULL,NULL,NULL,3,1),(9,'Adelaide Branch','Norwood','SA','5067','Australia',3,1);
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FollowedBranches`
--

DROP TABLE IF EXISTS `FollowedBranches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FollowedBranches` (
  `userID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `emailSubscribed` tinyint NOT NULL DEFAULT '1',
  KEY `userID` (`userID`),
  KEY `branchID` (`branchID`),
  KEY `idx_branchID` (`branchID`),
  KEY `idx_userID` (`userID`),
  CONSTRAINT `FollowedBranches_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `FollowedBranches_ibfk_2` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FollowedBranches`
--

LOCK TABLES `FollowedBranches` WRITE;
/*!40000 ALTER TABLE `FollowedBranches` DISABLE KEYS */;
INSERT INTO `FollowedBranches` VALUES (3,8,1),(3,5,1),(1,1,1),(1,2,1),(1,3,1),(1,5,1),(5,8,1),(5,4,1),(5,2,1),(5,1,1),(6,1,1),(6,2,1),(6,3,1),(6,4,1),(6,5,1),(6,8,1);
/*!40000 ALTER TABLE `FollowedBranches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Opportunities`
--

DROP TABLE IF EXISTS `Opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Opportunities` (
  `oppID` int NOT NULL AUTO_INCREMENT,
  `oppName` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `commitment` varchar(500) DEFAULT NULL,
  `suitability` varchar(500) DEFAULT NULL,
  `training` varchar(500) DEFAULT NULL,
  `requirements` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `dates` varchar(255) DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `private` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`oppID`),
  KEY `branchID` (`branchID`),
  KEY `idx_branchID` (`branchID`),
  CONSTRAINT `fk_organisation_opportunities` FOREIGN KEY (`branchID`) REFERENCES `Opportunities` (`branchID`) ON DELETE CASCADE,
  CONSTRAINT `Opportunities_ibfk_1` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Opportunities`
--

LOCK TABLES `Opportunities` WRITE;
/*!40000 ALTER TABLE `Opportunities` DISABLE KEYS */;
INSERT INTO `Opportunities` VALUES (4,'Giving','Food Bank, Shelters','64, Zoo Lane, Nelson County, Virginia, 22958, United States','1-2 hours','teenagers','no training','no requirements','we are going to be giving food to people','we are going to be giving food to people in homeless shelters around zoo lane','14 and 15th of June 2024',8,37.91663179,-78.85839271,0),(5,'Victorian Ocean Cleanup (SECRET)','Ocean Cleanup','Sunshine Road, West Footscray, Melbourne, City of Maribyrnong, Victoria, 3012, Australia','2-4 hours','Adults 18+','Swimming','Must know scuba diving','Cleaning up garbage near Melbourne waters','Cleaning up garbage near Melbourne waters to save the ocean and do good.','30th of June',8,-37.80192330,144.88078220,1),(6,'food giving','Shelters','Norwood Parade, Beaconsfield, Mackay, Mackay Regional, Queensland, Australia','1-2 hours','all ages','non','like food','help us serve people food','Over the course of 1 to 2 hours, you can serve people food. For free.','19th November 2025',3,-21.08285640,149.16038320,0),(7,'Op shop','Aged Care','Norwood, Adelaide, The City of Norwood Payneham and St Peters, South Australia, 5067, Australia','Full day','18+ ','till training and register','friendly and helpful','Run the op shop for a day','For a whole day you can run the op shop. Enjoy it, it can be a fun way to engage with your community.','20th September 2024',3,-34.92134670,138.63208690,0),(8,'Pick shellos','Ocean Cleanup, Animal Shelter, Health, Youth Group','Henley Beach, Adelaide, City of Charles Sturt, South Australia, 5022, Australia','2-4 hours','all ages','none','like shells','pick up shells and make pretty things','Join us to collect shells and you can make bracelets or shell art!','1st Jan 2025',5,-34.91588020,138.49869530,1);
/*!40000 ALTER TABLE `Opportunities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Organisations`
--

DROP TABLE IF EXISTS `Organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Organisations` (
  `orgID` int NOT NULL,
  `orgName` varchar(255) DEFAULT NULL,
  `orgSite` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `description` varchar(750) DEFAULT NULL,
  `imgPath` varchar(1024) DEFAULT NULL,
  `googleUser` tinyint DEFAULT '0',
  PRIMARY KEY (`orgID`),
  UNIQUE KEY `orgName` (`orgName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Organisations`
--

LOCK TABLES `Organisations` WRITE;
/*!40000 ALTER TABLE `Organisations` DISABLE KEYS */;
INSERT INTO `Organisations` VALUES (1,'Red Cross','https://www.redcross.org.au/','redcross@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$A1ylzpcvtWMg6sichQjoJg$TY2+feRC9aPc8SHSd4O8TqcoLvmqSj7D6wYLvJVffIo','\nThe Red Cross is a global humanitarian network providing emergency assistance, disaster relief, and education in communities worldwide. Founded in 1863 by Henry Dunant, it operates under principles of neutrality, impartiality, and independence. With a presence in over 190 countries, the Red Cross delivers lifesaving aid during crises, supports health services, and promotes humanitarian values. Its volunteers and staff are dedicated to alleviating human suffering through initiatives like blood donations, first aid training, and disaster preparedness. Red Cross strives to protect human dignity and support vulnerable populations in times of need.','organisation_logos/1718195206958.png',0),(2,'Mary Potter Foundation','https://www.marypotter.org.au/get-involved/volunteering/','mp@icloud.com','$argon2id$v=19$m=65536,t=3,p=4$x3MyeAnjdnLKehw9NiS2qg$tE/Kfv6KYgMOUFKnYsCslErvt90sZcxg8XWMUUWHKqI','If you have some spare time and would like to help the Foundation at our events or sell lottery tickets on our behalf, we’d love to hear from you.','organisation_logos/1718195435591.png',0),(3,'Georgia McLeod','www.puppies.com','georgia.mcleod314@gmail.com',NULL,'We like to help people ','organisation_logos/1718197592509.png',1);
/*!40000 ALTER TABLE `Organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RSVPD`
--

DROP TABLE IF EXISTS `RSVPD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RSVPD` (
  `userID` int DEFAULT NULL,
  `oppID` int DEFAULT NULL,
  KEY `userID` (`userID`),
  KEY `oppID` (`oppID`),
  KEY `idx_userID` (`userID`),
  KEY `idx_oppID` (`oppID`),
  CONSTRAINT `RSVPD_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `RSVPD_ibfk_2` FOREIGN KEY (`oppID`) REFERENCES `Opportunities` (`oppID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSVPD`
--

LOCK TABLES `RSVPD` WRITE;
/*!40000 ALTER TABLE `RSVPD` DISABLE KEYS */;
INSERT INTO `RSVPD` VALUES (6,4),(6,5),(6,7),(6,8),(5,7),(5,5),(3,4),(3,5),(3,6);
/*!40000 ALTER TABLE `RSVPD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Updates`
--

DROP TABLE IF EXISTS `Updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Updates` (
  `updateID` int NOT NULL,
  `updateName` varchar(255) DEFAULT NULL,
  `updateMsg` varchar(500) DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `dateCreated` varchar(50) DEFAULT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`updateID`),
  KEY `branchID` (`branchID`),
  CONSTRAINT `fk_branch_updates` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`) ON DELETE CASCADE,
  CONSTRAINT `Updates_ibfk_1` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Updates`
--

LOCK TABLES `Updates` WRITE;
/*!40000 ALTER TABLE `Updates` DISABLE KEYS */;
INSERT INTO `Updates` VALUES (1,'first update','woah what a great update',8,'June 12, 2024 at 10:50 PM',0),(2,'Scuba diving clean up coming soon !!!','You are a member of our organisation so we are just reminding you of the event we posted!',8,'June 12, 2024 at 11:00 PM',1),(3,'email update','you will recieve this as an email because you have joined our account',8,'June 12, 2024 at 11:15 PM',0),(4,'New branch instated!','Congrats on our approval :thumbsup:',9,'June 13, 2024 at 12:40 AM',0);
/*!40000 ALTER TABLE `Updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `userID` int NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `DOB` varchar(20) DEFAULT NULL,
  `suburb` varchar(50) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `googleUser` tinyint DEFAULT '0',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Sophie','Smith','31/12/1999','Glenelg','SA','5062','Australia','ss@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$Aq8EqUzbX5L5ezrnQEmBIQ$+UhTXqfKmJYRsAfWQPliu7YCpeYxmJ4ZG1FU69kCawg',0),(3,'Yuhan','Wang','20/02/2002','Rostrevor','SA','5073','Australia','wyuhan18@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$lj9zZIX33XO+ggpGSH/6Iw$/WZv6S40Qpcd2v9R76Zm0TZl/MZL9iUpaZ8GwFc5w8g',0),(5,'Ivan','Tchaikovsky','08/08/2004','St Peters','SA','5040','Australia','ivanT@icloud.com','$argon2id$v=19$m=65536,t=3,p=4$9vF7BYYmzA/DiF8zPUwveg$hTnitq0M05GrOiJik+KOvcurHJJfWG3BeVYEocvdlJ0',0),(6,'Arthur','Kirkland','21/04/1926','Small London','Big London','1000','England','arthur.kirkland@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$8nYLoe3Z4MMp5iL98BDjKQ$r8T/9+3oiqpQHmwgaQTuLWkIht/XpBaZ4EmLTrGVDIQ',0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-12 16:02:51
