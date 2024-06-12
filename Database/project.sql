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
INSERT INTO `Admin` VALUES (1,'Admin','Admin','admin@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$MplNzhLBUH4LMTkg86kHhQ$PNnE6/n7uBrQLR8/sT7aWJ6vW/FZxMghqxPB58VW1EU'),(2,'Admin2','Admin2','admin2@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$oTawQX2ITGXkn5OEWjV5Vw$o0WAQvHbjz50rPRt2w1G9kjzD1vw1J8ssO0vsb3qtF8');
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
INSERT INTO `Branch` VALUES (3,'Adelaide Branch','Adelaide','SA','5000','Australia',1,1),(6,'Melbourne','Melbourne','VIC','5067','Australia',1,1),(7,'YuhanCorp','so ','cool','6969','yapcity',2,1),(8,'Sydney Branch','Sydney','NSW','2000','Australia',2,1),(9,'Brisbane Branch','Brisbane','QLD','4000','Australia',2,1),(10,'hkas','Adelaide','SA','5073','Australia',2,0),(11,'another one','hsadk','jkasd','600','njasd',2,0),(12,'one more','prett','please','696420','yooo',2,0),(13,'one more','prett','please','38942','yooo',2,0),(14,'yoo','gran','turismo','900','jdlsf',2,0),(15,'one mroe','test','opls','904','jdnsf',2,0),(16,'yoo','Adelaide','SA','5073','Australia',2,0),(17,'Noddy Corp','Norwood','SA','5067','Australia',3,1);
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
INSERT INTO `FollowedBranches` VALUES (3,6,1),(3,3,1),(2,7,1),(3,9,1),(4,3,1);
/*!40000 ALTER TABLE `FollowedBranches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Opportunities`
--

DROP TABLE IF EXISTS `Opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Opportunities` (
  `oppID` int NOT NULL,
  `oppName` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `commitment` varchar(500) DEFAULT NULL,
  `suitability` varchar(500) DEFAULT NULL,
  `training` varchar(500) DEFAULT NULL,
  `requirements` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `dates` varchar(255) DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  PRIMARY KEY (`oppID`),
  KEY `branchID` (`branchID`),
  KEY `idx_branchID` (`branchID`),
  CONSTRAINT `fk_organisation_opportunities` FOREIGN KEY (`branchID`) REFERENCES `Opportunities` (`branchID`) ON DELETE CASCADE,
  CONSTRAINT `Opportunities_ibfk_1` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Opportunities`
--

LOCK TABLES `Opportunities` WRITE;
/*!40000 ALTER TABLE `Opportunities` DISABLE KEYS */;
INSERT INTO `Opportunities` VALUES (1,'Walk the dogs','Community Service','14 Osmond Terrace Norwood SA 5067','everyone','no training','walking','walk the dogs on a leash',NULL,'you can sometimes let the dogs off leash but pls dont','5th october 1997',17);
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
INSERT INTO `Organisations` VALUES (1,'Red Cross','redcross.org.au','redCross@gmail.com','redCrossPassword','Here at Red Cross we love to help people, and you should too! This is not a threat, we just really think you should help people! Join our wonderful community today.','images_assets/exampleLogo.png',0),(2,'YuhanCorp','www.big.com','test@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$rfpLc+G5JRxVDEk5Z7I03A$fBt7WOBVrC9tuSC4Cb6CYUGfQ2Jrxvq9FucSno+GE8g','i am so big','organisation_logos/1718022083666.png',0),(3,'Noddy Corp','https://en.wikipedia.org/wiki/Dog','test5@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$spq5UdyzsQn9gQRX2sE/DQ$dJv3iAdc0O7gQiNSjTMumqhI3W9fkez+F9VYOAaQobs','we are fancy','organisation_logos/1718147128838.png',0);
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
  CONSTRAINT `fk_opportunity_rsvpd` FOREIGN KEY (`oppID`) REFERENCES `RSVPD` (`oppID`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_rsvpd` FOREIGN KEY (`userID`) REFERENCES `RSVPD` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `RSVPD_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `RSVPD_ibfk_2` FOREIGN KEY (`oppID`) REFERENCES `Opportunities` (`oppID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSVPD`
--

LOCK TABLES `RSVPD` WRITE;
/*!40000 ALTER TABLE `RSVPD` DISABLE KEYS */;
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
INSERT INTO `Updates` VALUES (2,'Leprechauns!!!','Everyone, they are back! Come catch a leprechaun with us today and you won\'t ever need to volunteer again because we will be able to pay you in gold! (All gold profits found will go straight to us, pls do not keep any).',3,'June 4, 2024 at 10:03 AM',0),(3,'New Events','Hi everyone! Exciting stuff is happening, we are going to be created 5 new volunteering events - keep an eye on this space!!',3,'June 4, 2024 at 10:04 AM',0),(4,'test 1','testing 1',3,'June 4, 2024 at 10:04 AM',0),(5,'test 2','testing 2',3,'June 4, 2024 at 10:04 AM',0),(6,'test 3','testing 3',3,'June 4, 2024 at 10:04 AM',0),(7,'jamie\'s hand','yes',7,'June 10, 2024 at 9:51 PM',0),(8,'jamie\'s hand','yes',7,'June 10, 2024 at 9:51 PM',0),(9,'YAY','yesYAY',7,'June 10, 2024 at 9:52 PM',0),(10,'dsfsdfd','dsfsdf',8,'June 11, 2024 at 3:01 AM',0),(11,'for everyone','for everyone',17,'June 12, 2024 at 9:19 AM',0),(12,'for members','for members',17,'June 12, 2024 at 9:20 AM',0),(13,'members only','members',17,'this is a data',1);
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
INSERT INTO `User` VALUES (1,'Georgia','McL','2004','Norwood','SA','5067','Australia','myemail@gmail.com','password',0),(2,'Lucy','Fidock','03/06/2004','Rostrevor','SA','5073','Australia','lucy.fidock@mail','mypass',0),(3,'Yuhan Wang','',NULL,NULL,NULL,NULL,NULL,'wyuhan18@gmail.com',NULL,1),(4,'Georgia McLeod','',NULL,NULL,NULL,NULL,NULL,'georgia.mcleod314@gmail.com',NULL,1);
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

-- Dump completed on 2024-06-12  0:12:27
