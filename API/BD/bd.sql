-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.5.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para APLIJ
CREATE DATABASE IF NOT EXISTS `APLIJ` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `APLIJ`;

-- Volcando estructura para tabla APLIJ.libro
CREATE TABLE IF NOT EXISTS `libro` (
  idLibro INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(7) UNIQUE,                -- ISBN sin guiones (10 o 13 dígitos)
  titulo VARCHAR(100) NOT NULL,                -- Título del libro
  autor VARCHAR(100) NOT NULL,                 -- Autor del libro
  cantidad INT NOT NULL , -- Cantidad disponible (no negativa)
  fechaIngreso DATE NOT NULL                   -- Fecha de ingreso del libro
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.libro: ~2 rows (aproximadamente)
INSERT INTO Libro (isbn, titulo, autor, cantidad, fechaIngreso)
VALUES
('9783143', 'Cien Años de Soledad', 'Gabriel García Márquez', 5, '2025-09-23'),
('9780262', 'Introducción a Algoritmos', 'Thomas H. Cormen', 3, '2025-09-22');

-- Volcando estructura para tabla APLIJ.miembro
CREATE TABLE IF NOT EXISTS `miembro` (
  `idMiembro` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(12) NOT NULL,
  `idSolicitud` int(11) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`idMiembro`),
  KEY `cedula` (`cedula`),
  KEY `idSolicitud` (`idSolicitud`),
  CONSTRAINT `miembro_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `usuario` (`cedula`),
  CONSTRAINT `miembro_ibfk_2` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitudmembresia` (`idSolicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.miembro: ~3 rows (aproximadamente)
INSERT INTO `miembro` (`idMiembro`, `cedula`, `idSolicitud`, `estado`) VALUES
	(1, '01-2345-6789', 1, 'activo'),
	(2, '10-0000-0000', 2, 'inactivo'),
	(3, '5-238-2394', 10, 'inactivo');

-- Volcando estructura para tabla APLIJ.pagarcuota
CREATE TABLE IF NOT EXISTS `pagarcuota` (
  `idPago` int(11) NOT NULL AUTO_INCREMENT,
  `idMiembro` int(11) NOT NULL,
  `fechaPago` date NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idPago`),
  KEY `idMiembro` (`idMiembro`),
  CONSTRAINT `pagarcuota_ibfk_1` FOREIGN KEY (`idMiembro`) REFERENCES `miembro` (`idMiembro`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.pagarcuota: ~2 rows (aproximadamente)
INSERT INTO `pagarcuota` (`idPago`, `idMiembro`, `fechaPago`, `monto`) VALUES
	(1, 1, '2025-09-23', 50.00),
	(2, 2, '2025-09-23', 75.00);

-- Volcando estructura para tabla APLIJ.solicitudmembresia
CREATE TABLE IF NOT EXISTS `solicitudmembresia` (
  `idSolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(12) NOT NULL,
  `fechaSolicitud` date NOT NULL,
  `estado` enum('pendiente','aceptada','rechazada') DEFAULT 'pendiente',
  PRIMARY KEY (`idSolicitud`),
  KEY `cedula` (`cedula`),
  CONSTRAINT `solicitudmembresia_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `usuario` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.solicitudmembresia: ~3 rows (aproximadamente)
INSERT INTO `solicitudmembresia` (`idSolicitud`, `cedula`, `fechaSolicitud`, `estado`) VALUES
	(1, '01-2345-6789', '2025-09-23', 'aceptada'),
	(2, '10-0000-0000', '2025-09-22', 'rechazada'),
	(10, '5-238-2394', '2025-10-03', 'rechazada');

-- Volcando estructura para tabla APLIJ.taller
CREATE TABLE IF NOT EXISTS `Taller` (
    idTaller INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    tipo ENUM('Literatura', 'Práctico', 'Arte', 'Ciencia', 'Tecnología') NOT NULL,
    ubicacion VARCHAR (100) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM ('Activo', 'Finalizado') DEFAULT 'Activo',
    detalles VARCHAR (150) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.taller: ~2 rows (aproximadamente)
INSERT INTO Taller (nombre, tipo, ubicacion, fecha, hora, estado, detalles)
VALUES
('Taller de Escritura Creativa', 'Literatura', 'Sala 101', '2025-10-05', '10:00:00', 'Finalizado', 'Ven a leer'),
('Taller de Pintura', 'Arte', 'Aula de Arte', '2025-10-06', '14:30:00', 'Finalizado', 'Demuestra al artista');

-- Volcando estructura para tabla APLIJ.tipousuario
CREATE TABLE IF NOT EXISTS `tipousuario` (
  `idTipoUsuario` tinyint(4) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idTipoUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- Volcando datos para la tabla APLIJ.tipousuario: ~4 rows (aproximadamente)
INSERT INTO `tipousuario` (`idTipoUsuario`, `nombre`) VALUES
	(1, 'Administrador'),
	(2, 'Contador'),
	(3, 'Miembro'),
	(4, 'No Miembro');

-- Volcando estructura para tabla APLIJ.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `cedula` varchar(12) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `clave` varchar(15) NOT NULL,
  `idTipoUsuario` tinyint(4) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idTipoUsuario` (`idTipoUsuario`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idTipoUsuario`) REFERENCES `tipousuario` (`idTipoUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla APLIJ.usuario: ~6 rows (aproximadamente)
INSERT INTO `usuario` (`idUsuario`, `cedula`, `nombre`, `telefono`, `correo`, `clave`, `idTipoUsuario`) VALUES
	(1, '01-2345-6789', 'Juan Pérez', '6123-4567', 'juan.perez@email.com', '123456', 3),
	(2, '10-0000-0000', 'María Gómez', '0507-612-3456', 'maria.gomez@email.com', 'abcdef', 3),
	(3, '4-828-2349', 'bethel beitia', '123-456-7890', 'b.m.b.r0304@gmail.com', 'temp123', 2),
	(4, '8-392-239', 'juan pancho de pollo asado', '345-2456-2457', 'pollo.asado@gmail.com', '456789', 3),
	(10, '8-999-9999', 'admin', '6000-0000', 'admin@academia.com', 'admin123', 1),
	(14, '5-238-2394', 'pedro escobar', '6123-4567', 'pedrito@email.com', 'pedrito26V', 3);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
