/**
 * Ejemplo: Manejo de errores con Promises
 *
 * Este ejemplo muestra cómo manejar errores cuando se usan Promises.
 */

const YouTube = require('../../dist/index').default;

async function errorHandlingExample() {
  const youtube = new YouTube();

  // No establecemos la API key para provocar un error

  try {
    await youtube.videos.getById('some-video-id');
  } catch (error: any) {
    console.log('Error capturado correctamente:');
    console.log('Tipo:', error.name);
    console.log('Mensaje:', error.message);
    console.log('Es error de YouTube:', error.isYouTubeError);
    console.log('');
  }
}

async function apiErrorExample() {
  const youtube = new YouTube();
  youtube.setKey('INVALID_API_KEY');

  try {
    await youtube.videos.getById('some-video-id');
  } catch (error: any) {
    console.log('Error de API:');
    console.log('Tipo:', error.name);
    console.log('Mensaje:', error.message);
    console.log('Código:', error.code);
    console.log('Status:', error.status);
    console.log('');
  }
}

async function validationErrorExample() {
  const youtube = new YouTube();
  youtube.setKey('YOUR_API_KEY');

  try {
    // Intentar obtener un video con ID inválido o vacío
    await youtube.videos.getById('');
  } catch (error: any) {
    console.log('Error de validación o respuesta:');
    console.log('Tipo:', error.name);
    console.log('Mensaje:', error.message);
  }
}

async function main() {
  console.log('Ejemplos de manejo de errores\n');
  console.log('=============================\n');

  await errorHandlingExample();
  await apiErrorExample();
  await validationErrorExample();
}

main();
