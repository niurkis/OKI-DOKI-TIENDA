CREATE DATABASE IF NOT EXISTS okidokibd;

USE okidokibd;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
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

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  asunto VARCHAR(200),
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías
INSERT IGNORE INTO categorias (nombre, slug) VALUES 
('Zapatos para dama', 'zapatos-dama'),
('Bolsos de mano', 'bolsos-mano'),
('Sandalias', 'sandalias'),
('Tenis casuales', 'tenis-casuales'),
('Botas en cuero', 'botas-cuero');

-- Insertar productos de demostración
INSERT IGNORE INTO productos (nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado) VALUES 
('Zapatos de Tacón Negro', 'Elegantes zapatos de tacón en cuero genuino negro. Perfectos para ocasiones formales y eventos especiales.', 129.99, 159.99, 'img/zapatos-tacon.jpg', 1, 15, true),
('Bolsa Tote Clásica', 'Bolsa tote espaciosa en cuero sintético de alta calidad. Compartimento principal y bolsillos internos.', 89.99, NULL, 'img/bolsa-tote.jpg', 2, 25, true),
('Sandalias Planas Negras', 'Sandalias planas cómodas con diseño minimalista. Suela flexible para uso diario.', 49.99, 59.99, 'img/sandalias-negro.jpg', 3, 30, true),
('Tenis Blancos Urbanos', 'Tenis casuales blancos estilo urbano. Suela con amortiguación para comodidad todo el día.', 79.99, NULL, 'img/tenis-blancos.jpg', 4, 40, false),
('Botas Chelsea Negras', 'Botas Chelsea en cuero genuino con elástico lateral. Diseño atemporal que combina con todo.', 189.99, 219.99, 'img/botas-chelsea.jpg', 5, 12, true),
('Mocasines Negros', 'Mocasines clásicos sin cordones en cuero negro. Suela de goma antideslizante.', 99.99, NULL, 'img/mocasines.jpg', 1, 20, false),
('Bolso Cruzado Pequeño', 'Bolso cruzado compacto con correa ajustable. Ideal para salidas nocturnas.', 59.99, 69.99, 'img/bolso-cruzado.jpg', 2, 35, false),
('Sandalias con Tacón Bajo', 'Sandalias elegantes con tacón bajo de 3cm. Cierre de hebilla en el tobillo.', 69.99, NULL, 'img/sandalias-tacon.jpg', 3, 22, false),
('Tenis Negros Deportivos', 'Tenis deportivos negros con diseño aerodinámico. Transpirables y ligeros.', 85.99, 95.99, 'img/tenis-negros.jpg', 4, 18, false),
('Botas Altas Militar', 'Botas altas estilo militar con cordones. Suela gruesa antideslizante para todo terreno.', 159.99, NULL, 'img/botas-militar.jpg', 5, 8, false);

-- Insertar usuarios demo (las contraseñas son en texto plano porque se actualizarán después con bcrypt)
-- Admin: contraseña será hasheada desde la API o aplicación
-- Este es solo para inicialización, se recomienda cambiar en producción
INSERT IGNORE INTO usuarios (nombre, correo, password, rol) VALUES 
('Administrador', 'admin@okidoki.com', '$2b$10$JdKn0K0A8jOjVf5r0l5kU.6jVjdW5J.H0mJ0J0J0J0J0J0J0J0J0', 'admin'),
('Usuario Demo', 'cliente@ejemplo.com', '$2b$10$8jE9R5QqJ8P0L5K9J2M3L.8q9P3J2L4M5N6O7P8Q9R0S1T2U3V4W5', 'cliente');

-- Nota: Los hash anteriores son ejemplos. Para cambiar contraseñas:
-- admin@okidoki.com: admin123 -> hash con bcrypt
-- cliente@ejemplo.com: 123456 -> hash con bcrypt

