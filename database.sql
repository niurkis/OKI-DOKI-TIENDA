DROP DATABASE IF EXISTS okidokibd1;
CREATE DATABASE okidokibd1;

USE okidokibd1;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_anterior DECIMAL(10,2) NULL,
  imagen VARCHAR(500),
  categoria_id INT NULL,
  stock INT DEFAULT 0,
  destacado BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categorias (nombre, slug) VALUES 
('Zapatillas', 'zapatillas'),
('Tenis casuales', 'tenis-casuales'),
('Botas de cuero', 'botas-cuero');

INSERT INTO productos (nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado) VALUES 
('Zapatillas Deportivas Negras', 'Zapatillas deportivas en cuero negro con suela amortiguada. Perfectas para el día a día con estilo y comodidad.', 129.99, 159.99, 'img/2.jpeg', 1, 15, true),
('Zapatillas Casuales Blancas', 'Zapatillas casuales blancas en cuero suave. Diseño minimalista y elegante para cualquier ocasión.', 89.99, NULL, 'img/3.jpeg', 1, 25, true),
('Zapatillas Urbanas Premium', 'Zapatillas urbanas de cuero premium con detalles plateados. Comodidad y estilo en cada paso.', 149.99, 179.99, 'img/4.jpeg', 1, 20, true),
('Tenis Casuales Beige', 'Tenis casuales en cuero beige con suela blanca. Ideales para un look relajado y moderno.', 79.99, NULL, 'img/5.jpeg', 2, 30, true),
('Tenis Casuales Clásicos', 'Tenis casuales clásicos en cuero marrón. Cómodos y versátiles para cualquier outfit.', 69.99, 89.99, 'img/6.jpeg', 2, 25, false),
('Tenis Casuales Modernos', 'Tenis casuales modernos en cuero gris. Diseño contemporáneo con suela antideslizante.', 85.99, NULL, 'img/7.jpeg', 2, 18, false),
('Botas de Cuero Chelsea', 'Botas Chelsea en cuero genuino con elástico lateral. Diseño atemporal que combina con todo.', 189.99, 219.99, 'img/8.jpeg', 3, 12, true),
('Botas de Cuero Clásicas', 'Botas clásicas de cuero marrón con cordones. Perfectas para un look sofisticado.', 159.99, NULL, 'img/9.jpeg', 3, 8, false),
('Botas de Cuero Modernas', 'Botas modernas de cuero negro con hebilla. Estilo único y materiales de alta calidad.', 139.99, 169.99, 'img/10.jpeg', 3, 10, false);

INSERT INTO usuarios (nombre, correo, password, rol) VALUES 
('Administrador', 'admin@okidoki.com', 'admin123', 'admin'),
('Usuario Demo', 'cliente@ejemplo.com', '123456', 'cliente');
