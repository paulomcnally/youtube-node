---
sidebar_position: 4
---

# Autenticación

Aprende a autenticar tus solicitudes a la API de YouTube.

## Tipos de Autenticación

YouTube Data API soporta dos tipos de autenticación:

1. **API Key** - Para lectura de datos públicos (búsquedas, videos, canales)
2. **OAuth 2.0** - Para acciones que requieren permisos (subir videos, comentar, etc.)

## Obtener una API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**
4. Ve a "Credenciales" y crea una **API Key**
5. Copia la clave generada

### Video Tutorial

Para una guía visual, puedes ver [este video](https://www.youtube.com/watch?v=Im69kzhpR3I) sobre cómo obtener tu API Key.

## Usar la API Key

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();

// Configurar tu API Key
youTube.setKey('TU_API_KEY_AQUI');

// ¡Listo para usar!
const videos = await youTube.search.query('nodejs', 10);
```

## Autenticación OAuth 2.0

Para acciones que modifican datos (subir videos, comentar, suscribirse), necesitas OAuth 2.0.

### Configurar OAuth en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth"
3. Selecciona "Aplicación web"
4. Agrega URLs de redirección autorizadas
5. Copia el **Client ID** y **Client Secret**

### Usar OAuth en tu Código

```typescript
import { YouTubeAuth, YouTubeScopes } from 'youtube-node';

const auth = new YouTubeAuth({
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/callback',
});

// Generar URL de autorización
const authUrl = auth.generateAuthUrl({
  scope: [
    YouTubeScopes.READ_ONLY,
    YouTubeScopes.UPLOAD,
    YouTubeScopes.MANAGE,
  ],
});

console.log('Visita esta URL:', authUrl);

// Después de obtener el código de autorización
const tokens = await auth.getTokens('CODIGO_DE_AUTORIZACION');

// Usar los tokens
const youTube = new YouTube();
youTube.setKey('TU_API_KEY');
// Configurar el token de acceso para requests OAuth
```

## Scopes de OAuth

Los scopes definen qué permisos solicitas:

| Scope | Descripción |
|-------|-------------|
| `YouTubeScopes.READ_ONLY` | Solo lectura de datos |
| `YouTubeScopes.UPLOAD` | Subir videos |
| `YouTubeScopes.MANAGE` | Gestionar videos/canal |
| `YouTubeScopes.FORCE_SSL` | Requiere conexión segura |

## Configurar Headers Personalizados

Si tu API Key tiene restricciones de referer:

```typescript
const youTube = new YouTube();
youTube.setKey('TU_API_KEY');

// Configurar referer
youTube.setReferer('https://example.com');

// O configurar cualquier header
youTube.setHeader('Referer', 'https://example.com');
youTube.setHeader('X-Custom-Header', 'valor');
```

## Manejo de Errores de Autenticación

```typescript
import { InvalidKeyError, QuotaExceededError } from 'youtube-node';

async function makeRequest() {
  try {
    const result = await youTube.videos.getById('VIDEO_ID');
    return result;
  } catch (error) {
    if (error instanceof InvalidKeyError) {
      console.error('API Key inválida');
    } else if (error instanceof QuotaExceededError) {
      console.error('Cuota excedida. Intenta más tarde.');
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

## Mejores Prácticas

### 🔐 Seguridad

- **Nunca** expongas tu API Key en el código del cliente
- Usa variables de entorno para almacenar claves
- Restringe tu API Key por IP o referer en Google Cloud Console

### ⚡ Optimización de Cuota

- La API de YouTube tiene límites de cuota
- Cachea resultados cuando sea posible
- Usa paginación para grandes conjuntos de datos

```typescript
// Usar variables de entorno
const API_KEY = process.env.YOUTUBE_API_KEY;
const youTube = new YouTube();
youTube.setKey(API_KEY);
```

## Errores Comunes

### "The request did not specify any referer"

Tu API Key tiene restricciones de referer pero no se envió el header:

```typescript
youTube.setReferer('https://yourdomain.com');
```

### "API key not valid"

- Verifica que la clave esté correcta
- Asegúrate de que la YouTube Data API v3 esté habilitada
- Verifica las restricciones de la clave

### "Daily Limit Exceeded"

Has excedido tu cuota diaria. Opciones:
- Espera hasta mañana
- Solicita más cuota en Google Cloud Console
- Optimiza tus requests
