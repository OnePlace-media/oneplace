-- MySQL Script generated by MySQL Workbench
-- Сб 30 дек 2017 16:14:59
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema oneplace
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `oneplace` ;

-- -----------------------------------------------------
-- Schema oneplace
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `oneplace` DEFAULT CHARACTER SET utf8 ;
USE `oneplace` ;

-- -----------------------------------------------------
-- Table `oneplace`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`users` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`users` (
  `id` CHAR(36) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `role` TINYINT(1) NOT NULL DEFAULT 1,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `emailVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `verificationToken` VARCHAR(64) NULL,
  `online` INT NULL,
  `ip` BIGINT NULL,
  `lang` ENUM('ru', 'en') NOT NULL,
  `created` INT NOT NULL,
  `updated` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `oneplace`.`userIdentity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`userIdentity` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`userIdentity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `provider` VARCHAR(45) NOT NULL,
  `authScheme` VARCHAR(45) NOT NULL,
  `externalId` VARCHAR(128) NOT NULL,
  `profile` JSON NOT NULL,
  `credentials` JSON NOT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NULL,
  `userId` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userIdentity_1_idx` (`userId` ASC),
  CONSTRAINT `fk_userIdentity_1`
    FOREIGN KEY (`userId`)
    REFERENCES `oneplace`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `oneplace`.`userCredential`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`userCredential` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`userCredential` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` CHAR(36) NOT NULL,
  `provider` VARCHAR(45) NOT NULL,
  `authScheme` VARCHAR(45) NOT NULL,
  `externalId` VARCHAR(45) NOT NULL,
  `profile` JSON NOT NULL,
  `credentials` JSON NOT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_UserCredential_1_idx` (`userId` ASC),
  CONSTRAINT `fk_UserCredential_1`
    FOREIGN KEY (`userId`)
    REFERENCES `oneplace`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `oneplace`.`tags`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`tags` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(64) NOT NULL,
  `chain` ENUM('g', 's') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `index2` (`text` ASC, `chain` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `oneplace`.`usertag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`usertag` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`usertag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` CHAR(36) NOT NULL,
  `tagId` INT NOT NULL,
  INDEX `fk_table1_1_idx` (`userId` ASC),
  INDEX `fk_table1_2_idx` (`tagId` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_table1_1`
    FOREIGN KEY (`userId`)
    REFERENCES `oneplace`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_table1_2`
    FOREIGN KEY (`tagId`)
    REFERENCES `oneplace`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `oneplace`.`AccessToken`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`AccessToken` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`AccessToken` (
  `id` CHAR(64) NOT NULL,
  `ttl` INT(11) NOT NULL,
  `created` TIMESTAMP NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `scopes` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_AccessToken_1_idx` (`userId` ASC),
  CONSTRAINT `fk_AccessToken_1`
    FOREIGN KEY (`userId`)
    REFERENCES `oneplace`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `oneplace`.`accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`accounts` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `chain` ENUM('g', 's') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `index2` (`username` ASC, `chain` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `oneplace`.`useraccount`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `oneplace`.`useraccount` ;

CREATE TABLE IF NOT EXISTS `oneplace`.`useraccount` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` CHAR(36) NOT NULL,
  `accountId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_useraccount_1_idx` (`accountId` ASC),
  INDEX `fk_useraccount_2_idx` (`userId` ASC),
  UNIQUE INDEX `index4` (`userId` ASC, `accountId` ASC),
  CONSTRAINT `fk_useraccount_1`
    FOREIGN KEY (`accountId`)
    REFERENCES `oneplace`.`accounts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_useraccount_2`
    FOREIGN KEY (`userId`)
    REFERENCES `oneplace`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
