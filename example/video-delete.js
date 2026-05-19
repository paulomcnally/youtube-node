/**
 * Ejemplo de Videos Delete (Eliminar videos)
 * Requiere OAuth
 * 
 * Issue #87
 * 
 * ⚠️ ADVERTENCIA: Las operaciones de eliminación son PERMANENTES
 * ⚠️ Solo el dueño del video puede eliminarlo
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTA: Para operaciones OAuth, necesitas configurar el token de acceso
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const VIDEO_ID_TO_DELETE = 'VIDEO_ID_HERE';

// Eliminar un solo video
async function deleteVideoExample() {
  try {
    // ⚠️ ADVERTENCIA: Esta operación es PERMANENTE
    console.log('Eliminando video...');
    
    await youtube.videos.delete(VIDEO_ID_TO_DELETE);
    
    console.log('Video eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar video:', error);
  }
}

// Eliminar múltiples videos
async function deleteMultipleVideosExample() {
  const videoIds = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3'];
  
  try {
    // ⚠️ ADVERTENCIA: Esta operación es PERMANENTE
    console.log('Eliminando videos:', videoIds);
    
    const results = await youtube.videos.deleteMany(videoIds);
    
    console.log('Videos eliminados:', results.length);
  } catch (error) {
    console.error('Error al eliminar videos:', error);
  }
}

// Ejemplo con callbacks (legacy)
function deleteVideoCallbackExample() {
  // ⚠️ ADVERTENCIA: Esta operación es PERMANENTE
  youtube.videos.delete(VIDEO_ID_TO_DELETE, (err) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Video eliminado exitosamente');
  });
}

// Ejemplo de confirmación antes de eliminar
async function deleteWithConfirmationExample() {
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  try {
    const answer = await question(
      `¿Estás seguro de que deseas eliminar el video ${VIDEO_ID_TO_DELETE}? (si/no): `
    );
    
    if (answer.toLowerCase() === 'si' || answer.toLowerCase() === 's') {
      await youtube.videos.delete(VIDEO_ID_TO_DELETE);
      console.log('Video eliminado exitosamente');
    } else {
      console.log('Operación cancelada');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

// Ejecutar ejemplos
// deleteVideoExample();
// deleteMultipleVideosExample();
// deleteWithConfirmationExample();
