@echo off
REM Script de instalación para Oki Doki (Windows)

echo.
echo ==========================================
echo   OKI DOKI - E-Commerce Setup
echo ==========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detectado: 
node --version

echo ✓ npm detectado:
npm --version
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✓ Dependencias instaladas
echo.

REM Verificar MySQL
echo 🔍 Verificando MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MySQL CLI no detectado
    echo.
    echo Para instalar la base de datos manualmente:
    echo 1. Abre MySQL Command Line o MySQL Workbench
    echo 2. Ejecuta: source database.sql;
    echo 3. O: mysql -u root -p ^< database.sql
) else (
    echo ✓ MySQL detectado
    echo.
    set /p response="¿Deseas crear la base de datos ahora? (s/n): "
    
    if /i "%response%"=="s" (
        mysql -u root -p < database.sql
        if errorlevel 1 (
            echo ❌ Error al crear base de datos
            pause
            exit /b 1
        )
        echo ✓ Base de datos creada exitosamente
    )
)

echo.
echo ==========================================
echo   ✅ Instalación completada
echo ==========================================
echo.
echo Para iniciar el servidor:
echo   npm start
echo.
echo Luego accede a: http://localhost:3000
echo.
echo Credenciales de prueba:
echo   Admin: admin@okidoki.com / admin123
echo   Cliente: cliente@ejemplo.com / 123456
echo.
pause
