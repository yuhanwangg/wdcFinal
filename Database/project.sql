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
INSERT INTO `Branch` VALUES (3,'Adelaide Branch','Adelaide','SA','5000','Australia',1,1),(5,'Norwood','Norwood','SA','5067','Australia',1,1),(6,'Melbourne','Melbourne','VIC','5067','Australia',1,0);
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
  CONSTRAINT `fk_branches_followed` FOREIGN KEY (`branchID`) REFERENCES `FollowedBranches` (`branchID`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_branches_followed` FOREIGN KEY (`userID`) REFERENCES `FollowedBranches` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `FollowedBranches_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `FollowedBranches_ibfk_2` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FollowedBranches`
--

LOCK TABLES `FollowedBranches` WRITE;
/*!40000 ALTER TABLE `FollowedBranches` DISABLE KEYS */;
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
  `oppType` varchar(255) DEFAULT NULL,
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
  `password` varchar(255) NOT NULL,
  `description` varchar(750) DEFAULT NULL,
  `imgPath` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`orgID`),
  UNIQUE KEY `orgName` (`orgName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Organisations`
--

LOCK TABLES `Organisations` WRITE;
/*!40000 ALTER TABLE `Organisations` DISABLE KEYS */;
INSERT INTO `Organisations` VALUES (1,'Red Cross','redcross.org.au','redCross@gmail.com','redCrossPassword','Here at Red Cross we love to help people, and you should too! This is not a threat, we just really think you should help people! Join our wonderful community today.','images_assets/exampleLogo.png');
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
INSERT INTO `Updates` VALUES (2,'Leprechauns!!!','Everyone, they are back! Come catch a leprechaun with us today and you won\'t ever need to volunteer again because we will be able to pay you in gold! (All gold profits found will go straight to us, pls do not keep any).',3,'June 4, 2024 at 10:03 AM'),(3,'New Events','Hi everyone! Exciting stuff is happening, we are going to be created 5 new volunteering events - keep an eye on this space!!',3,'June 4, 2024 at 10:04 AM'),(4,'test 1','testing 1',3,'June 4, 2024 at 10:04 AM'),(5,'test 2','testing 2',3,'June 4, 2024 at 10:04 AM'),(6,'test 3','testing 3',3,'June 4, 2024 at 10:04 AM'),(7,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM'),(8,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM'),(9,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM'),(10,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM'),(11,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM'),(12,'New Post','this is a testing new post',5,'June 6, 2024 at 2:52 PM');
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
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Georgia','McL','2004','Norwood','SA','5067','Australia','myemail@gmail.com','password');
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

-- Dump completed on 2024-06-06  5:22:55
