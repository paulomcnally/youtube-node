/**
 * Ejemplo: Información de canal con async/await
 *
 * Este ejemplo muestra cómo obtener información de un canal
 * usando Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Channel ID de ejemplo (Google Developers)
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

async function getChannelInfo() {
  try {
    console.log('Obteniendo información del canal...\n');

    const channel = await youtube.channels.getById(CHANNEL_ID);

    if (channel.items && channel.items.length > 0) {
      const info = channel.items[0];

      console.log('Información del canal:');
      console.log('======================');
      console.log('Título:', info.snippet?.title);
      console.log('Descripción:', info.snippet?.description?.substring(0, 100) + '...');
      console.log('Subscriptores:', info.statistics?.subscriberCount);
      console.log('Videos:', info.statistics?.videoCount);
      console.log('Vistas totales:', info.statistics?.viewCount);
      console.log('País:', info.snippet?.country);
    } else {
      console.log('Canal no encontrado');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getChannelInfo();
