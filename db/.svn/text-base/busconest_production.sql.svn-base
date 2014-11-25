-- MySQL dump 10.11
--
-- Host: localhost    Database: busconest_production
-- ------------------------------------------------------
-- Server version	5.0.32-Debian_7etch8-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clasificacion_documento_academico`
--

DROP TABLE IF EXISTS `clasificacion_documento_academico`;
CREATE TABLE `clasificacion_documento_academico` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `nombre` varchar(255) NOT NULL,
  `nombre_corto` varchar(20) NOT NULL,
  `nombre_largo` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `clasificacion_documento_academico`
--

LOCK TABLES `clasificacion_documento_academico` WRITE;
/*!40000 ALTER TABLE `clasificacion_documento_academico` DISABLE KEYS */;
INSERT INTO `clasificacion_documento_academico` VALUES (1,'TRABAJO ESPECIAL DE GRADO','TEG','TRABAJO ESPECIAL DE GRADO'),(2,'SEMINARIO','SEMINARIO','SEMINARIO'),(3,'PASANTIA','PASANTIA','PASANTIA');
/*!40000 ALTER TABLE `clasificacion_documento_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
CREATE TABLE `documento` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `clasificacion_documento_academico_id` int(10) unsigned NOT NULL,
  `archivo` longblob NOT NULL,
  `metadata` longtext NOT NULL,
  `peso_numerico1` int(10) unsigned NOT NULL default '0',
  `peso_numerico2` int(10) unsigned NOT NULL default '0',
  `peso_numerico3` int(10) unsigned NOT NULL default '0',
  `peso_numerico4` int(10) unsigned NOT NULL default '0',
  `procesado` tinyint(1) default '0',
  `md5` text,
  `publico` char(1) default NULL,
  PRIMARY KEY  (`id`),
  KEY `documento_FKIndex2` (`clasificacion_documento_academico_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `documento`
--

LOCK TABLES `documento` WRITE;
/*!40000 ALTER TABLE `documento` DISABLE KEYS */;
/*!40000 ALTER TABLE `documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_palabra`
--

DROP TABLE IF EXISTS `documento_palabra`;
CREATE TABLE `documento_palabra` (
  `documento_id` int(10) unsigned NOT NULL,
  `palabra_id` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_contenido` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_titulo` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_palabras_clave` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_resumen` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_autor` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`documento_id`,`palabra_id`),
  KEY `documento_has_palabra_FKIndex1` (`documento_id`),
  KEY `documento_has_palabra_FKIndex2` (`palabra_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `documento_palabra`
--

LOCK TABLES `documento_palabra` WRITE;
/*!40000 ALTER TABLE `documento_palabra` DISABLE KEYS */;
/*!40000 ALTER TABLE `documento_palabra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `palabra`
--

DROP TABLE IF EXISTS `palabra`;
CREATE TABLE `palabra` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `texto` varchar(45) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `indice_unico_texto` (`texto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `palabra`
--

LOCK TABLES `palabra` WRITE;
/*!40000 ALTER TABLE `palabra` DISABLE KEYS */;
/*!40000 ALTER TABLE `palabra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametro_general`
--

DROP TABLE IF EXISTS `parametro_general`;
CREATE TABLE `parametro_general` (
  `id` varchar(45) NOT NULL,
  `valor` varchar(45) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parametro_general`
--

LOCK TABLES `parametro_general` WRITE;
/*!40000 ALTER TABLE `parametro_general` DISABLE KEYS */;
INSERT INTO `parametro_general` VALUES ('host_conest_admin','http://conest.ciens.ucv.ve:9001'),('host_conest_estudiantes','https://estudiantes.ciens.ucv.ve'),('login_administrador','admin'),('password_administrador','adminbcnest'),('procesado_automatico','no');
/*!40000 ALTER TABLE `parametro_general` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2009-05-01 19:39:56
