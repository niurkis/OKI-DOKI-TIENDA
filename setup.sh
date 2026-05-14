#!/bin/bash

# Script de instalación automática para Oki Doki

echo "=========================================="
echo "  OKI DOKI - E-Commerce Setup"
echo "=========================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detectado: $(node --version)"
echo "✓ npm detectado: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✓ Dependencias instaladas"
echo ""

# Verificar MySQL
echo "🔍 Verificando MySQL..."
if ! command -v mysql &> /dev/null
then
    echo "⚠️  MySQL CLI no detectado"
    echo "Para instalar la base de datos:"
    echo "1. Abre MySQL Workbench o línea de comandos"
    echo "2. Ejecuta: source database.sql;"
    echo "3. O: mysql -u root -p < database.sql"
else
    echo "✓ MySQL detectado"
    echo ""
    echo "¿Deseas crear la base de datos ahora? (s/n)"
    read -r response
    
    if [ "$response" = "s" ] || [ "$response" = "S" ]; then
        mysql -u root -p < database.sql
        if [ $? -eq 0 ]; then
            echo "✓ Base de datos creada exitosamente"
        else
            echo "❌ Error al crear base de datos"
            exit 1
        fi
    fi
fi

echo ""
echo "=========================================="
echo "  ✅ Instalación completada"
echo "=========================================="
echo ""
echo "Para iniciar el servidor:"
echo "  npm start"
echo ""
echo "Luego accede a: http://localhost:3000"
echo ""
echo "Credenciales de prueba:"
echo "  Admin: admin@okidoki.com / admin123"
echo "  Cliente: cliente@ejemplo.com / 123456"
echo ""
