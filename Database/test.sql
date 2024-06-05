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
  PRIMARY KEY (`adminID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (3,'Bob','Johnson','bjohnson@example.com','admin789'),(4,'Emily','Brown','ebrown@example.com','admin101'),(5,'Michael','Davis','mdavis@example.com','admin202');
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
INSERT INTO `Branch` VALUES (1,'Main Branch','Anytown','State','12345','Country',1,1),(2,'North Branch','Northville','State','54321','Country',1,1),(3,'South Branch','Southville','State','67890','Country',1,1),(4,'West Branch','Westville','State','09876','Country',1,1),(5,'East Branch','Eastville','State','13579','Country',1,1);
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
INSERT INTO `FollowedBranches` VALUES (1,1),(1,1),(1,2),(1,4),(2,1),(3,3),(4,2),(1,1),(1,2),(1,4),(2,1),(3,3),(4,2);
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
INSERT INTO `Opportunities` VALUES (1,'Volunteer at Food Bank','Food, Charity','123 Main St, Anytown','3 hours per week','Anyone can volunteer','Training provided on site','None','path/to/image.jpg','Help sort and pack food items','Volunteering','2024-06-15 to 2024-06-30',1),(2,'Environmental Cleanup Day','Environment, Conservation','456 Elm St, Othertown','Full day event','Suitable for outdoorsy individuals','Safety training required','Must bring own gloves and boots','path/to/image.jpg','Help clean up local parks and waterways','Volunteering','2024-07-10',1),(3,'Tutoring Program','Education, Tutoring','789 Oak St, Anycity','1 hour per week','Suitable for educators or students','Training provided','Must have teaching experience','path/to/image.jpg','Provide tutoring to underprivileged children','Volunteering','Ongoing',1),(4,'Community Garden Project','Gardening, Community','456 Main St, Northville','Flexible','No experience necessary','On-site training','None','path/to/image.jpg','Help maintain a community garden','Volunteering','Ongoing',4),(5,'Animal Shelter Volunteer','Animals, Shelter','789 Elm St, Southville','Flexible','Suitable for animal lovers','Training provided','Must be comfortable with animals','path/to/image.jpg','Assist with animal care and adoption','Volunteering','Ongoing',5);
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
INSERT INTO `Organisations` VALUES (1,'Charity XYZ','http://charityxyz.org','contact@charityxyz.org','orgpassword','We are a charitable organization dedicated to helping those in need.','path/to/image.jpg'),(2,'Environmental Group','http://environmentgroup.org','contact@environmentgroup.org','org456','We are dedicated to preserving and protecting the environment.','path/to/image.jpg'),(3,'Education Foundation','http://educationfoundation.org','contact@educationfoundation.org','org789','We provide educational opportunities and resources to underprivileged communities.','path/to/image.jpg'),(4,'Community Services','http://communityservices.org','contact@communityservices.org','org101','We offer a variety of community services and support programs.','path/to/image.jpg'),(5,'Animal Rescue','http://animalrescue.org','contact@animalrescue.org','org202','We rescue and care for animals in need of homes.','path/to/image.jpg');
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
INSERT INTO `RSVPD` VALUES (1,1),(1,2),(2,3),(3,4),(4,5);
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
  CONSTRAINT `Updates_ibfk_1` FOREIGN KEY (`branchID`) REFERENCES `Branch` (`branchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Updates`
--

LOCK TABLES `Updates` WRITE;
/*!40000 ALTER TABLE `Updates` DISABLE KEYS */;
INSERT INTO `Updates` VALUES (1,'Important Update','This is an important update message.',1,'2024-06-02'),(2,'New Volunteer Program','We are excited to launch our new volunteer program.',1,'2024-06-03'),(3,'Fundraising Event Success','Thanks to everyone who participated in our fundraising event. We raised $5000!',1,'2024-06-04'),(4,'Community Outreach','Join us for a community outreach program this weekend.',1,'2024-06-05'),(5,'Environmental Initiative','Our latest environmental initiative was a great success!',1,'2024-06-06'),(6,'Annual Report Published','Our annual report for 2023 is now available online.',1,'2024-06-07'),(7,'Volunteer Recognition','Congratulations to our volunteers who were recognized at the recent awards ceremony.',1,'2024-06-08'),(8,'New Partnership Announced','We are pleased to announce a new partnership with Green Earth Organization.',1,'2024-06-09'),(9,'Upcoming Event','Don\'t miss our upcoming event next month!',1,'2024-06-10');
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
INSERT INTO `User` VALUES (1,'georgia','mcl','2004','Norwood','SA','5067','Australia','emailgeorgia','mypassword'),(2,'Jane','Doe','2000-01-01','Anytown','State','12345','Country','janedoe@example.com','user123'),(3,'Emma','Johnson','1998-05-15','Downtown','NY','10001','USA','emma@example.com','emma123'),(4,'David','Williams','1990-09-20','Midtown','CA','90210','USA','david@example.com','david123'),(5,'Sophia','Brown','1985-02-10','Uptown','TX','77001','USA','sophia@example.com','sophia123'),(6,'James','Jones','1982-11-30','Suburbia','WA','98101','USA','james@example.com','james123');
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

-- Dump completed on 2024-06-05  4:12:35
