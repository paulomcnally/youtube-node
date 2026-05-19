/**
 * Ejemplo de Subscriptions (Suscribirse/Cancelar suscripción)
 * Requiere OAuth
 * 
 * Issue #83
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTA: Para operaciones OAuth, necesitas configurar el token de acceso
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers channel

// Suscribirse a un canal
async function subscribeExample() {
  try {
    const result = await youtube.subscriptions.subscribeToChannel(CHANNEL_ID);
    console.log('Suscrito exitosamente:', result);
    
    // Guardar el subscriptionId para poder cancelar después
    if (result.items && result.items[0]) {
      console.log('Subscription ID:', result.items[0].id);
    }
  } catch (error) {
    console.error('Error al suscribirse:', error);
  }
}

// Cancelar suscripción usando subscriptionId
async function unsubscribeExample() {
  const subscriptionId = 'SUBSCRIPTION_ID'; // Obtener del resultado de subscribe
  
  try {
    await youtube.subscriptions.unsubscribe(subscriptionId);
    console.log('Suscripción cancelada exitosamente');
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
  }
}

// Buscar y cancelar suscripción usando channelId (helper)
async function findAndUnsubscribeExample() {
  try {
    await youtube.subscriptions.findAndUnsubscribe(CHANNEL_ID);
    console.log('Suscripción cancelada exitosamente');
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
  }
}

// Listar mis suscripciones
async function listSubscriptionsExample() {
  try {
    const result = await youtube.subscriptions.list({
      mine: true,
      maxResults: 10,
    });
    console.log('Mis suscripciones:', result.items);
  } catch (error) {
    console.error('Error al listar suscripciones:', error);
  }
}

// Ejemplo con callbacks (legacy)
function subscribeCallbackExample() {
  youtube.subscriptions.subscribeToChannel(CHANNEL_ID, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Suscrito:', result);
  });
}

// Ejecutar ejemplos
// subscribeExample();
// unsubscribeExample();
// findAndUnsubscribeExample();
// listSubscriptionsExample();
