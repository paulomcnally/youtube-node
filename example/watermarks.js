/**
 * Ejemplo: Marcas de Agua (requiere OAuth)
 *
 * Este ejemplo muestra cómo gestionar marcas de agua para videos.
 *
 * Nota: Para usar estos métodos necesitas un token de OAuth con permisos
 * de escritura en YouTube.
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');
const path = require('path');

const youtube = new YouTube();

console.log('=== Ejemplo: Marcas de Agua ===\n');

// Restricciones de las marcas de agua
console.log('Restricciones:');
console.log('- Formato: PNG o JPEG');
console.log('- Tamaño máximo: 1MB');
console.log('- Dimensiones recomendadas: 150x150 px');
console.log('');

// Tipos de timing
console.log('Tipos de timing:');
console.log('- fromStart: Desde el inicio del video');
console.log('- fromEnd: Desde el final del video');
console.log('- custom: Posición personalizada');
console.log('');

// Ejemplo: Establecer marca de agua
async function setWatermarkExample() {
  try {
    const channelId = 'YOUR_CHANNEL_ID';
    const imagePath = './watermark.png'; // Ruta a tu imagen

    // Configuración del timing
    const timing = {
      type: 'fromStart',    // 'fromStart' | 'fromEnd' | 'custom'
      offsetMs: 5000,       // Aparece a los 5 segundos
      durationMs: 10000,    // Dura 10 segundos
    };

    console.log('=== Establecer marca de agua ===');
    console.log('Requiere OAuth con permisos de escritura');
    console.log('');
    console.log('Parámetros:');
    console.log(`  Channel ID: ${channelId}`);
    console.log(`  Imagen: ${imagePath}`);
    console.log(`  Timing: ${JSON.stringify(timing, null, 2)}`);
    console.log('');

    // Verificar que el archivo existe
    if (!fs.existsSync(imagePath)) {
      console.log('Nota: Crea un archivo watermark.png para probar este ejemplo');
      console.log('');
    }

    // const result = await youtube.watermarks.set(channelId, imagePath, timing);
    // console.log('Marca de agua establecida:', result);

    // También puedes usar un Buffer directamente
    // const imageBuffer = fs.readFileSync(imagePath);
    // const result = await youtube.watermarks.set(channelId, imageBuffer, timing);
  } catch (error) {
    console.error('Error al establecer marca de agua:', error.message);
  }
}

// Ejemplo: Eliminar marca de agua
async function unsetWatermarkExample() {
  try {
    const channelId = 'YOUR_CHANNEL_ID';

    console.log('=== Eliminar marca de agua ===');
    console.log('Requiere OAuth con permisos de escritura');
    console.log(`  Channel ID: ${channelId}`);
    console.log('');

    // const result = await youtube.watermarks.unset(channelId);
    // console.log('Marca de agua eliminada:', result);
  } catch (error) {
    console.error('Error al eliminar marca de agua:', error.message);
  }
}

// Ejemplos de diferentes configuraciones de timing
console.log('=== Configuraciones de Timing ===\n');

console.log('1. Aparecer al inicio durante 10 segundos:');
console.log(JSON.stringify({
  type: 'fromStart',
  offsetMs: 0,
  durationMs: 10000,
}, null, 2));
console.log('');

console.log('2. Aparecer 5 segundos antes del final:');
console.log(JSON.stringify({
  type: 'fromEnd',
  offsetMs: 5000,
  durationMs: 5000,
}, null, 2));
console.log('');

console.log('3. Aparecer en el minuto 2 durante 15 segundos:');
console.log(JSON.stringify({
  type: 'custom',
  offsetMs: 120000,
  durationMs: 15000,
}, null, 2));
console.log('');

// Ejecutar ejemplos
setWatermarkExample();
setTimeout(() => unsetWatermarkExample(), 2000);

console.log('=== Referencia ===');
console.log('Documentación: https://developers.google.com/youtube/v3/docs/watermarks');
