/**
 * Ejemplo: Reportar Videos Abusivos (requiere OAuth)
 *
 * Este ejemplo muestra cómo reportar videos por contenido inapropiado.
 *
 * Nota: Para usar estos métodos necesitas un token de OAuth.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Ejemplo: Reportar Videos Abusivos ===\n');

// Ejemplo: Listar razones de reporte
async function listAbuseReportReasons() {
  try {
    console.log('=== Listar razones de reporte ===\n');

    const result = await youtube.videoAbuseReportReasons.list();

    console.log(`Total de razones: ${result.items?.length || 0}`);
    console.log('');

    if (result.items) {
      result.items.forEach((reason, index) => {
        console.log(`[${index + 1}] ${reason.snippet?.label || 'Sin etiqueta'}`);
        console.log(`  ID: ${reason.id}`);

        if (reason.snippet?.secondaryReasons && reason.snippet.secondaryReasons.length > 0) {
          console.log('  Sub-razones:');
          reason.snippet.secondaryReasons.forEach(subReason => {
            console.log(`    - ${subReason.label} (${subReason.id})`);
          });
        }
        console.log('');
      });
    }

    return result;
  } catch (error) {
    console.error('Error al listar razones:', error.message);
    return null;
  }
}

// Ejemplo: Reportar un video (requiere OAuth)
async function reportVideoExample() {
  try {
    const videoId = 'VIDEO_ID_TO_REPORT';
    const reasonId = 'REASON_ID'; // Obtener de listAbuseReportReasons

    const options = {
      secondaryReasonId: 'SECONDARY_REASON_ID', // Opcional
      comments: 'Este video contiene contenido inapropiado porque...',
      language: 'es',
    };

    console.log('=== Reportar video ===');
    console.log('Requiere OAuth');
    console.log('');
    console.log('Parámetros:');
    console.log(`  Video ID: ${videoId}`);
    console.log(`  Reason ID: ${reasonId}`);
    console.log(`  Options: ${JSON.stringify(options, null, 2)}`);
    console.log('');

    // const result = await youtube.videoAbuseReportReasons.report(videoId, reasonId, options);
    // console.log('Video reportado exitosamente:', result);
  } catch (error) {
    console.error('Error al reportar video:', error.message);
  }
}

// Ejemplo: Flujo completo de reporte
async function fullReportFlowExample() {
  console.log('=== Flujo completo de reporte ===\n');
  console.log('1. Obtener la lista de razones:');
  console.log('   const reasons = await youtube.videoAbuseReportReasons.list();');
  console.log('');
  console.log('2. Seleccionar la razón adecuada:');
  console.log('   const reasonId = reasons.items[0].id;');
  console.log('');
  console.log('3. Reportar el video:');
  console.log('   await youtube.videoAbuseReportReasons.report(videoId, reasonId, {');
  console.log('     comments: "Descripción del problema"');
  console.log('   });');
  console.log('');
}

// Razones comunes de reporte
console.log('=== Razones comunes de reporte ===\n');
console.log('Las razones exactas las obtienes de la API, pero típicamente incluyen:');
console.log('  - Contenido sexual o desnudez');
console.log('  - Contenido violento o repulsivo');
console.log('  - Acoso o bullying');
console.log('  - Actividades peligrosas o dañinas');
console.log('  - Abuso de menores');
console.log('  - Promoción del terrorismo');
console.log('  - Spam o contenido engañoso');
console.log('  - Infracción de derechos de autor');
console.log('');

// Ejecutar ejemplos
listAbuseReportReasons();
setTimeout(() => reportVideoExample(), 2000);
setTimeout(() => fullReportFlowExample(), 4000);

console.log('=== Notas importantes ===');
console.log('- Usa este poder con responsabilidad');
console.log('- Solo reporta contenido que realmente viole las políticas');
console.log('- Los reportes falsos pueden tener consecuencias');
console.log('- Se requiere OAuth para reportar videos');
console.log('');

console.log('=== Referencia ===');
console.log('Documentación:');
console.log('  - https://developers.google.com/youtube/v3/docs/videoAbuseReportReasons');
console.log('  - https://developers.google.com/youtube/v3/docs/videos/reportAbuse');
