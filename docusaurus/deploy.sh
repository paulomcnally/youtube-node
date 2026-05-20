#!/bin/bash

# Script para desplegar la documentación a GitHub Pages manualmente

echo "🚀 Desplegando documentación a GitHub Pages..."

# Ir al directorio de docusaurus
cd "$(dirname "$0")"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Construir el sitio
echo "🔨 Construyendo el sitio..."
npm run build

# Desplegar a GitHub Pages
echo "📤 Desplegando a GitHub Pages..."
npm run deploy

echo "✅ Despliegue completado!"
echo "🌐 Tu documentación está disponible en: https://paulomcnally.github.io/youtube-node/"
