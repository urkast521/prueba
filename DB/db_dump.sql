-- Creacion o uso  de la base de datos y la tabla de usuarios
CREATE DATABASE IF NOT EXISTS db_users;
USE db_users;


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Nombre Completo
    correo VARCHAR(100) NOT NULL UNIQUE, -- Correo unico
    passw VARCHAR(255) NOT NULL,
    estado INT NOT NULL DEFAULT 1 -- 1: activo, 0: inactivo
);
