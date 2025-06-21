/*
SQLyog Trial v13.1.9 (64 bit)
MySQL - 5.7.36 : Database - adele_new_source
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `t_rate_history` */

DROP TABLE IF EXISTS `t_rate_history`;

CREATE TABLE `t_rate_history` (
  `rate_history_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `offer_detail_id` bigint(20) DEFAULT NULL,
  `rate_history_tenor_regular` decimal(15,0) DEFAULT NULL,
  `rate_history_rate_regular` decimal(15,5) DEFAULT NULL,
  `rate_history_premium_regular` decimal(15,2) DEFAULT NULL,
  `rate_history_extra_premi` decimal(15,2) DEFAULT NULL,
  `rate_history_tenor_combination` decimal(15,0) DEFAULT NULL,
  `rate_history_rate_combination` decimal(15,5) DEFAULT NULL,
  `rate_history_premium_combination` decimal(15,2) DEFAULT NULL,
  `rate_history_is_original` int(1) DEFAULT '0' COMMENT '0: no, 1: yes',
  `rate_history_created_by` varchar(50) DEFAULT NULL,
  `rate_history_created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`rate_history_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
