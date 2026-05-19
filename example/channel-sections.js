/**
 * Ejemplo: Secciones de Canal (requiere OAuth)
 *
 * Este ejemplo muestra cómo gestionar las secciones de un canal de YouTube.
 *
 * Nota: Para usar estos métodos necesitas un token de OAuth con permisos
 * de escritura en YouTube.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Ejemplo: Secciones de Canal ===\n');

// Tipos de sección disponibles
const sectionTypes = [
  'allPlaylists',      // Todas las playlists
  'completedEvents',   // Eventos completados
  'likedPlaylists',    // Playlists marcadas como me gusta
  'likes',             // Videos marcados como me gusta
  'liveEvents',        // Eventos en vivo
  'multipleChannels',  // Canales múltiples
  'multiplePlaylists', // Playlists múltiples
  'popularUploads',    // Subidas populares
  'postedPlaylists',   // Playlists publicadas
  'postedVideos',      // Videos publicados
  'recentActivity',    // Actividad reciente
  'recentPosts',       // Posts recientes
  'recentUploads',     // Subidas recientes
  'singlePlaylist',    // Playlist única
  'subscriptions',     // Suscripciones
  'upcomingEvents',    // Eventos próximos
];

console.log('Tipos de sección disponibles:');
sectionTypes.forEach(type => console.log(`  - ${type}`));

// Ejemplo: Listar secciones de un canal
async function listChannelSections() {
  try {
    const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers

    console.log(`\nObteniendo secciones del canal: ${channelId}`);

    const result = await youtube.channelSections.list(channelId);

    console.log(`Total de secciones: ${result.items?.length || 0}`);

    if (result.items) {
      result.items.forEach((section, index) => {
        console.log(`\n[${index + 1}] Sección:`);
        console.log(`  ID: ${section.id}`);
        console.log(`  Tipo: ${section.snippet?.type}`);
        console.log(`  Título: ${section.snippet?.title || 'Sin título'}`);
        console.log(`  Posición: ${section.snippet?.position}`);

        if (section.contentDetails?.playlists) {
          console.log(`  Playlists: ${section.contentDetails.playlists.join(', ')}`);
        }
        if (section.contentDetails?.channels) {
          console.log(`  Canales: ${section.contentDetails.channels.join(', ')}`);
        }
      });
    }
  } catch (error) {
    console.error('Error al obtener secciones:', error.message);
  }
}

// Ejemplo: Crear una nueva sección (requiere OAuth)
async function createChannelSectionExample() {
  try {
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist',
        title: 'Mi Playlist Destacada',
        position: 0,
      },
      contentDetails: {
        playlists: ['PLAYLIST_ID_HERE'],
      },
    };

    console.log('\n=== Crear sección ===');
    console.log('Requiere OAuth con permisos de escritura');
    console.log('Ejemplo de sectionResource:');
    console.log(JSON.stringify(sectionResource, null, 2));

    // const result = await youtube.channelSections.create(sectionResource);
    // console.log('Sección creada:', result);
  } catch (error) {
    console.error('Error al crear sección:', error.message);
  }
}

// Ejemplo: Actualizar una sección (requiere OAuth)
async function updateChannelSectionExample() {
  try {
    const sectionId = 'SECTION_ID_HERE';
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist',
        title: 'Título Actualizado',
        position: 1,
      },
    };

    console.log('\n=== Actualizar sección ===');
    console.log('Requiere OAuth con permisos de escritura');
    console.log('Ejemplo:');
    console.log(`ID: ${sectionId}`);
    console.log(JSON.stringify(sectionResource, null, 2));

    // const result = await youtube.channelSections.update(sectionId, sectionResource);
    // console.log('Sección actualizada:', result);
  } catch (error) {
    console.error('Error al actualizar sección:', error.message);
  }
}

// Ejemplo: Eliminar una sección (requiere OAuth)
async function deleteChannelSectionExample() {
  try {
    const sectionId = 'SECTION_ID_HERE';

    console.log('\n=== Eliminar sección ===');
    console.log('Requiere OAuth con permisos de escritura');
    console.log(`ID a eliminar: ${sectionId}`);

    // const result = await youtube.channelSections.delete(sectionId);
    // console.log('Sección eliminada:', result);
  } catch (error) {
    console.error('Error al eliminar sección:', error.message);
  }
}

// Ejecutar ejemplos
listChannelSections();
setTimeout(() => createChannelSectionExample(), 2000);
setTimeout(() => updateChannelSectionExample(), 4000);
setTimeout(() => deleteChannelSectionExample(), 6000);

console.log('\n=== Límites ===');
console.log('- Máximo 10 secciones por canal');
console.log('- Se requiere OAuth para crear, actualizar o eliminar');

console.log('\n=== Referencia ===');
console.log('Documentación: https://developers.google.com/youtube/v3/docs/channelSections');
