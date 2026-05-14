# OKI DOKI - E-Commerce Calzado en Cuero

Tienda en línea para venta de calzado y accesorios en cuero de alta calidad.

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js 14+ instalado
- MySQL 5.7+ instalado y funcionando
- npm o yarn

### Pasos de Instalación

#### 1. Clonar y navegar al proyecto
```bash
cd "OKI DOKI TIENDA.worktrees/agents-pagina-web-analisis-y-correcciones"
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar la Base de Datos
```bash
# Abre MySQL desde línea de comandos
mysql -u root -p

# Luego dentro de MySQL, ejecuta:
# source database.sql;
# O copia el contenido de database.sql y pégalo en MySQL
```

Alternativamente, desde línea de comandos:
```bash
mysql -u root -p < database.sql
```

#### 4. Configurar variables de entorno
El archivo `.env` ya está creado con valores por defecto. Si necesitas cambiar las credenciales:
```bash
# Edita .env con tus credenciales MySQL
# DB_HOST=127.0.0.1
# DB_USER=root
# DB_PASSWORD=tu_contraseña
# DB_NAME=okidokibd
# PORT=3000
```

#### 5. Iniciar el servidor
```bash
npm start
```

El servidor iniciará en: **http://localhost:3000**

---

## 📋 Estructura del Proyecto

```
OKI DOKI TIENDA/
├── config/
│   └── db.js                 # Configuración de conexión MySQL
├── controllers/
│   ├── authController.js     # Lógica de autenticación
│   ├── contactoController.js # Manejo de formulario de contacto
│   └── productoController.js # Lógica de productos
├── models/
│   ├── productoModel.js      # Operaciones BD de productos
│   └── usuarioModel.js       # Operaciones BD de usuarios
├── routes/
│   ├── auth.js               # Rutas de autenticación
│   ├── contacto.js           # Rutas de contacto
│   └── productos.js          # Rutas de productos
├── views/
│   ├── index.html            # Página principal
│   ├── carrito.html          # Carrito de compras
│   ├── producto.html         # Detalle de producto
│   ├── contacto.html         # Formulario de contacto
│   └── nosotros.html         # Página "Quiénes Somos"
├── public/
│   ├── css/
│   │   └── style.css         # Estilos principales
│   ├── js/
│   │   └── app.js            # Lógica frontend (JavaScript)
│   └── img/                  # Imágenes del sitio
├── server.js                 # Archivo principal del servidor
├── package.json              # Dependencias del proyecto
├── database.sql              # Script de base de datos
├── .env                      # Variables de entorno
├── .env.example              # Plantilla de .env
└── .gitignore                # Archivos ignorados por Git
```

---

## 🔗 Rutas Disponibles

### Páginas (Frontend)
- `GET /` - Página de inicio
- `GET /carrito` - Carrito de compras
- `GET /producto/:id` - Detalle de producto
- `GET /contacto` - Formulario de contacto
- `GET /nosotros` - Página "Quiénes Somos"

### API - Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/destacados` - Obtener productos destacados
- `GET /api/productos/:id` - Obtener un producto por ID
- `GET /api/productos/categoria/:categoriaId` - Obtener por categoría

### API - Autenticación
- `POST /api/auth/login` - Iniciar sesión
  - Body: `{ correo: string, password: string }`

### API - Contacto
- `POST /api/contacto` - Enviar mensaje de contacto
  - Body: `{ nombre, correo, telefono, asunto, mensaje }`

---

## 🔐 Credenciales de Prueba

**Admin:**
- Correo: `admin@okidoki.com`
- Contraseña: `admin123`

**Cliente:**
- Correo: `cliente@ejemplo.com`
- Contraseña: `123456`

---

## 🎨 Características

✅ Catálogo de productos con categorías  
✅ Carrito de compras (localStorage)  
✅ Sistema de login/autenticación  
✅ Formulario de contacto  
✅ Responsive design (Móvil, tablet, desktop)  
✅ Información sobre la empresa  
✅ Newsletter subscription  
✅ Búsqueda de productos  

---

## 📱 Funcionalidades Frontend

- **Carrito Persistente**: Los productos se guardan en localStorage
- **Interfaz Responsive**: Funciona en dispositivos móviles, tablets y desktop
- **Modal de Login**: Autenticación integrada
- **Toast Notifications**: Mensajes de retroalimentación al usuario
- **Galería de Productos**: Grid responsivo con imágenes de placeholders

---

## 🛡️ Seguridad

✅ Contraseñas hasheadas con bcrypt  
✅ Validación de entrada en servidor  
✅ CORS habilitado  
✅ Variables de entorno para credenciales  
✅ Sanitización de datos  

---

## 🔧 Solución de Problemas

### "Error: connect ECONNREFUSED"
- Verifica que MySQL esté corriendo
- Comprueba que las credenciales en `.env` sean correctas

### "Error: connect EADDRNOTAVAIL"
- Asegúrate de que MySQL esté en el puerto 3306
- Verifica que DB_HOST sea correcto (127.0.0.1 o localhost)

### "Table not found"
- Ejecuta `mysql -u root -p < database.sql` nuevamente
- Verifica que el nombre de la BD sea "okidokibd"

### Productos no cargan
- Abre la consola del navegador (F12)
- Verifica que `/api/productos/destacados` responda correctamente

---

## 📝 Licencia

MIT - Oki Doki 2026

---

## 📞 Contacto

- **Email**: info@okidoki.com.ar
- **Teléfono**: +57 3153598914
- **WhatsApp**: +57 3153598914
- **Dirección**: Calle 20 #21-21, Bucaramanga, Santander

