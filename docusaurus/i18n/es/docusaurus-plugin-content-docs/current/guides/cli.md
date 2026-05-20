---
sidebar_position: 5
---

# CLI (Interfaz de Línea de Comandos)

Usa `youtube-node` directamente desde tu terminal.

## Instalación Global

Para usar la CLI, instala el paquete globalmente:

```bash
npm install -g youtube-node
```

O usa npx (no requiere instalación):

```bash
npx youtube-node <comando>
```

## Comandos Disponibles

### Buscar Videos

```bash
youtube search
```

Te pedirá:
- **API Key**: Tu clave de YouTube Data API
- **Query**: Término de búsqueda
- **Max Results**: Número máximo de resultados (1-50)

**Ejemplo de salida:**
```
? API Key: ****************************
? Query: nodejs tutorial
? Max Results: 10

🔍 Buscando: "nodejs tutorial"...

1. Node.js Tutorial for Beginners
   ID: abc123def456
   Canal: Programming with Mosh
   ---
2. Learn Node.js in 1 Hour
   ID: xyz789abc012
   Canal: Codevolution
   ---
```

### Obtener Video por ID

```bash
youtube id
```

Te pedirá:
- **API Key**: Tu clave de API
- **Video ID**: ID del video de YouTube

**Ejemplo de salida:**
```
? API Key: ****************************
? Video ID: dQw4w9WgXcQ

📹 Información del Video:
   Título: Never Gonna Give You Up
   Canal: Rick Astley
   Vistas: 1,234,567,890
   Likes: 12,345,678
   Publicado: 2009-10-25T06:57:33Z
```

## Configuración de API Key

Para no tener que ingresar la API Key cada vez, puedes usar una variable de entorno:

```bash
export YOUTUBE_API_KEY="tu-api-key-aqui"
youtube search
```

O crear un archivo `.env`:

```
YOUTUBE_API_KEY=tu-api-key-aqui
```

## Uso Programático

La CLI usa la misma librería, así que cualquier función disponible en la API también está disponible en la CLI.

### Ejemplo de Script

```bash
#!/bin/bash

# Configurar API Key
export YOUTUBE_API_KEY="your-key-here"

# Buscar videos sobre un tema
echo "Buscando tutoriales de Node.js..."
youtube search << EOF
nodejs tutorial
10
EOF

# Obtener información de un video específico
echo "Obteniendo información del video..."
youtube id << EOF
dQw4w9WgXcQ
EOF
```

## Colores y Formato

La CLI usa colores para mejorar la legibilidad:

- 🟢 Verde: Operaciones exitosas
- 🔴 Rojo: Errores
- 🟡 Amarillo: Advertencias
- 🔵 Azul: Información

Para deshabilitar colores:

```bash
FORCE_COLOR=0 youtube search
```

## Ejemplos de Uso

### Buscar y Descargar Info

```bash
# Buscar videos y guardar IDs
youtube search > search_results.txt

# Extraer IDs y obtener detalles
grep "ID:" search_results.txt | sed 's/ID: //' | while read videoId; do
  youtube id <<< $videoId
done
```

### Automatización con Cron

```bash
# Guardar este script como /home/user/bin/check_popular.sh
#!/bin/bash
export YOUTUBE_API_KEY="your-key"
echo "=== Videos Populares $(date) ===" >> ~/popular_videos.log
youtube search <<< $'popular videos\n5' >> ~/popular_videos.log
```

```bash
# Ejecutar cada hora con cron
crontab -e
0 * * * * /home/user/bin/check_popular.sh
```

## Errores Comunes en CLI

### "API Key is required"

La API Key no se proporcionó. Usa la variable de entorno:

```bash
export YOUTUBE_API_KEY="your-key"
```

### "Invalid API Key"

Verifica que:
1. La clave esté correctamente copiada
2. La YouTube Data API v3 esté habilitada en Google Cloud Console
3. No haya restricciones de IP que bloqueen tu conexión

### "Quota exceeded"

Has excedido tu cuota diaria. Opciones:
- Esperar hasta mañana
- Crear una nueva API Key
- Solicitar aumento de cuota en Google Cloud Console

## Desarrollo

Para contribuir a la CLI o modificarla:

```bash
# Clonar repositorio
git clone https://github.com/paulomcnally/youtube-node.git
cd youtube-node

# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar CLI local
node dist/bin/youtube.js search
```

## Alternativas a la CLI

Si necesitas más funcionalidades, considera:

1. **Script de Node.js**: Para automatización compleja
2. **Postman/curl**: Para testing rápido
3. **Google APIs Explorer**: Para explorar la API en el navegador
