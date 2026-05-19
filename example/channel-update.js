/**
 * Ejemplo de Channels Update (Actualizar canal y banner)
 * Requiere OAuth
 * 
 * Issue #84
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTA: Para operaciones OAuth, necesitas configurar el token de acceso
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const CHANNEL_ID = 'YOUR_CHANNEL_ID';

// Actualizar metadatos del canal
async function updateChannelExample() {
  try {
    const result = await youtube.channels.update({
      id: CHANNEL_ID,
      brandingSettings: {
        channel: {
          title: 'Nuevo Título del Canal',
          description: 'Nueva descripción del canal',
          keywords: 'tecnología, programación, javascript',
          defaultLanguage: 'es',
          country: 'MX',
        },
      },
    });
    console.log('Canal actualizado:', result);
  } catch (error) {
    console.error('Error al actualizar canal:', error);
  }
}

// Subir banner de canal
async function uploadBannerExample() {
  try {
    // Subir la imagen del banner
    const bannerResult = await youtube.channels.uploadBanner('./banner.jpg');
    console.log('Banner subido:', bannerResult);
    
    if (bannerResult.url) {
      // Actualizar el canal con la URL del banner
      await youtube.channels.updateBanner(CHANNEL_ID, bannerResult.url);
      console.log('Banner actualizado en el canal');
    }
  } catch (error) {
    console.error('Error al subir banner:', error);
  }
}

// Actualizar banner en un solo paso
async function updateBannerCompleteExample() {
  try {
    const result = await youtube.channels.uploadBanner('./banner.jpg');
    
    if (result.url) {
      await youtube.channels.update({
        id: CHANNEL_ID,
        brandingSettings: {
          image: {
            bannerExternalUrl: result.url,
          },
        },
      });
      console.log('Banner actualizado exitosamente');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejemplo con callbacks (legacy)
function updateChannelCallbackExample() {
  youtube.channels.update({
    id: CHANNEL_ID,
    brandingSettings: {
      channel: {
        title: 'Nuevo Título',
        description: 'Nueva descripción',
      },
    },
  }, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Canal actualizado:', result);
  });
}

// Ejecutar ejemplos
// updateChannelExample();
// uploadBannerExample();
// updateBannerCompleteExample();
