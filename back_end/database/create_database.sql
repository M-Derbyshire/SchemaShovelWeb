-- MySQL Script generated by MySQL Workbench
-- Fri May 28 16:22:30 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema SchemaShovelWebAPI
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `SchemaShovelWebAPI` ;

-- -----------------------------------------------------
-- Schema SchemaShovelWebAPI
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SchemaShovelWebAPI` DEFAULT CHARACTER SET utf8 ;
USE `SchemaShovelWebAPI` ;

-- -----------------------------------------------------
-- Table `SchemaShovelWebAPI`.`database`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SchemaShovelWebAPI`.`database` ;

CREATE TABLE IF NOT EXISTS `SchemaShovelWebAPI`.`database` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SchemaShovelWebAPI`.`schema`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SchemaShovelWebAPI`.`schema` ;

CREATE TABLE IF NOT EXISTS `SchemaShovelWebAPI`.`schema` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `databaseID` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`),
  INDEX `schema_database_idx` (`databaseID` ASC) VISIBLE,
  CONSTRAINT `schema_database`
    FOREIGN KEY (`databaseID`)
    REFERENCES `SchemaShovelWebAPI`.`database` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SchemaShovelWebAPI`.`table`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SchemaShovelWebAPI`.`table` ;

CREATE TABLE IF NOT EXISTS `SchemaShovelWebAPI`.`table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `schemaID` INT NULL,
  `description` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`),
  INDEX `table_schema_idx` (`schemaID` ASC) VISIBLE,
  CONSTRAINT `table_schema`
    FOREIGN KEY (`schemaID`)
    REFERENCES `SchemaShovelWebAPI`.`schema` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SchemaShovelWebAPI`.`column`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SchemaShovelWebAPI`.`column` ;

CREATE TABLE IF NOT EXISTS `SchemaShovelWebAPI`.`column` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `tableID` INT NOT NULL,
  `foreign_key_to_schema_table_name` VARCHAR(100) NULL,
  `description` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`),
  INDEX `column_table_idx` (`tableID` ASC) VISIBLE,
  CONSTRAINT `column_table`
    FOREIGN KEY (`tableID`)
    REFERENCES `SchemaShovelWebAPI`.`table` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `SchemaShovelWebAPI` ;

-- -----------------------------------------------------
-- procedure spDeleteDatabaseRecordAndRelations
-- -----------------------------------------------------

USE `SchemaShovelWebAPI`;
DROP procedure IF EXISTS `SchemaShovelWebAPI`.`spDeleteDatabaseRecordAndRelations`;

DELIMITER $$
USE `SchemaShovelWebAPI`$$
CREATE PROCEDURE `spDeleteDatabaseRecordAndRelations` (
	IN databaseID LONG
)
BEGIN
	-- The current ON DELETE constraints mean all related records will be deleted as well
	DELETE FROM `database`
    WHERE id = databaseID;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
