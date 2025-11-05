CREATE DATABASE IF NOT EXISTS Sistema_de_gestion_de_turnos_online;

USE Sistema_de_gestion_de_turnos_online;

-- Tabla de especialidades médicas
CREATE TABLE Especialidades (
    IdEspecialidad INT PRIMARY KEY AUTO_INCREMENT,
    NombreEspecialidad VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT,
    Activa BOOLEAN DEFAULT TRUE
);

-- Tabla de sedes
CREATE TABLE Sedes (
    IdSede INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Direccion TEXT NOT NULL,
    Telefono VARCHAR(20),
    HorarioApertura TIME,
    HorarioCierre TIME,
    Activa BOOLEAN DEFAULT TRUE
);

-- Tabla de profesionales
CREATE TABLE Profesionales (
    IdProfesional INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Telefono VARCHAR(20),
    Matricula VARCHAR(50) UNIQUE NOT NULL,
    IdEspecialidad INT NOT NULL,
    Activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdEspecialidad) REFERENCES Especialidades (IdEspecialidad)
);

-- Tabla de turnos
CREATE TABLE Turnos (
    IdTurno INT PRIMARY KEY AUTO_INCREMENT,
    IdProfesional INT NOT NULL,
    IdSede INT NOT NULL,
    IdEspecialidad INT NOT NULL,
    NombrePaciente VARCHAR(100) NOT NULL,
    Apellido_Paciente VARCHAR(100) NOT NULL,
    Email_Paciente VARCHAR(100) NOT NULL,
    Telefono_Paciente VARCHAR(20),
    Dni_Paciente VARCHAR(20),
    Fecha_Turno DATE NOT NULL,
    Hora_Turno TIME NOT NULL,
    Estado ENUM(
        'pendiente',
        'confirmado',
        'atendido',
        'cancelado',
        'no_presentado'
    ) DEFAULT 'pendiente',
    Motivo_Consulta TEXT,
    Observaciones TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProfesional) REFERENCES Profesionales (IdProfesional),
    FOREIGN KEY (IdSede) REFERENCES Sedes (IdSede),
    FOREIGN KEY (IdEspecialidad) REFERENCES Especialidades (IdEspecialidad)
);

-- Tabla de reportes
CREATE TABLE Reportes (
    IdReporte INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Tipo VARCHAR(50) NOT NULL,
    FechaGeneracion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GeneradoPor VARCHAR(100),
    FechaInicio DATE,
    FechaFin DATE
);

-- Tabla de usuarios del sistema
CREATE TABLE Usuarios_Sistema (
    IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    NivelAcceso ENUM(
        'admin',
        'recepcion',
        'profesional',
        'visor'
    ) DEFAULT 'visor',
    Activo BOOLEAN DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UltimoLogin TIMESTAMP NULL
);