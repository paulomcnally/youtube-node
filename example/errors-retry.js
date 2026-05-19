/**
 * Ejemplo de uso del sistema de retry y manejo de errores
 */
const YouTube = require('../lib/youtube');

// Configurar con opciones de retry
const youTube = new YouTube({
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    retryCondition: (error) => error.isRetriable(),
    onRetry: (error, attempt) => {
      console.log(`Reintentando (intento ${attempt}): ${error.message}`);
    },
  },
});

youTube.setKey(process.env.YOUTUBE_API_KEY || 'TU_API_KEY');

// Ejemplo 1: Uso con callback
console.log('Ejemplo 1: Búsqueda con callback y retry automático');
youTube.search('Node.js tutorial', 5, (err, result) => {
  if (err) {
    // El error será una instancia de YouTubeError o sus subclases
    if (err instanceof YouTube.QuotaExceededError) {
      console.error('❌ Cuota excedida. Intenta más tarde.');
    } else if (err instanceof YouTube.InvalidKeyError) {
      console.error('❌ La API key es inválida.');
    } else if (err instanceof YouTube.RateLimitError) {
      console.error('❌ Rate limit alcanzado. Espera un momento.');
    } else if (err instanceof YouTube.NetworkError) {
      console.error('❌ Error de red:', err.message);
    } else {
      console.error('❌ Error:', err.message, err.code ? `(código: ${err.code})` : '');
    }
    return;
  }

  console.log(`✅ Encontrados ${result.pageInfo.totalResults} resultados`);
  result.items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.snippet.title}`);
  });
});

// Ejemplo 2: Uso con Promises
console.log('\nEjemplo 2: Uso con Promises y async/await');

async function getVideoInfo(videoId) {
  try {
    const result = await youTube.getByIdAsync(videoId);

    if (result.items && result.items.length > 0) {
      const video = result.items[0];
      console.log('✅ Video encontrado:', video.snippet.title);
      console.log('   Vistas:', video.statistics.viewCount);
      console.log('   Likes:', video.statistics.likeCount);
    } else {
      console.log('⚠️ Video no encontrado');
    }
  } catch (error) {
    // Manejo específico de errores
    if (error.isNotFoundError && error.isNotFoundError()) {
      console.error('❌ El video no existe:', videoId);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Ejemplo 3: Actualizar opciones de retry en runtime
console.log('\nEjemplo 3: Cambiar opciones de retry dinámicamente');
youTube.setRetryOptions({
  retries: 5, // Aumentar a 5 reintentos
  retryDelay: 2000, // Esperar 2 segundos entre intentos
});

// Ejemplo 4: Manejo de errores sin retry
setTimeout(() => {
  console.log('\nEjemplo 4: Creando instancia sin retry (solo para errores 5xx)');
  const youTubeNoRetry = new YouTube({
    retryOptions: {
      retries: 0, // Deshabilitar retry
    },
  });

  youTubeNoRetry.setKey('INVALID_KEY');
  youTubeNoRetry.getById('dQw4w9WgXcQ', (err) => {
    if (err) {
      console.log('Error capturado:', err.name);
      console.log('Mensaje:', err.message);
      console.log('Es error de YouTube:', err.isYouTubeError);
    }
  });
}, 2000);

// Ejecutar ejemplo 2 si hay API key
if (process.env.YOUTUBE_API_KEY) {
  getVideoInfo('dQw4w9WgXcQ');
} else {
  console.log('\n⚠️ Para probar, establece la variable de entorno YOUTUBE_API_KEY');
}
