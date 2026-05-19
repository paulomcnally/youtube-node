---
sidebar_position: 3
---

# Autenticación OAuth

Configura OAuth 2.0 para acciones que requieren permisos de usuario.

## ¿Qué es OAuth?

OAuth 2.0 permite que tu aplicación realice acciones en nombre de un usuario de YouTube (subir videos, comentar, suscribirse, etc.).

## Configuración en Google Cloud

### Paso 1: Crear Credenciales OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Click en **Create Credentials** → **OAuth client ID**
5. Selecciona **Web application**
6. Configura:
   - **Name**: Nombre de tu aplicación
   - **Authorized redirect URIs**: URLs donde Google redirigirá después del login
     - `http://localhost:3000/callback` (desarrollo)
     - `https://tu-dominio.com/callback` (producción)
7. Click en **Create**
8. Guarda el **Client ID** y **Client Secret**

### Paso 2: Configurar Pantalla de Consentimiento

1. Ve a **OAuth consent screen**
2. Selecciona **External** (para uso público) o **Internal** (solo tu organización)
3. Completa la información requerida:
   - App name
   - User support email
   - Developer contact information
4. Guarda y continúa

### Paso 3: Agregar Scopes

1. En la pantalla de consentimiento, ve a **Scopes**
2. Click en **Add or Remove Scopes**
3. Busca y selecciona:
   - `youtube.readonly` - Leer tu cuenta de YouTube
   - `youtube.upload` - Subir videos
   - `youtube` - Gestionar tu cuenta de YouTube
   - `youtube.force-ssl` - Usar conexión segura
4. Guarda los cambios

## Implementación en Código

### Configuración Básica

```typescript
import { YouTubeAuth, YouTubeScopes } from 'youtube-node';

const auth = new YouTubeAuth({
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/callback',
});
```

### Generar URL de Autorización

```typescript
// Generar URL para redirigir al usuario
const authUrl = auth.generateAuthUrl({
  scope: [
    YouTubeScopes.READ_ONLY,
    YouTubeScopes.UPLOAD,
    YouTubeScopes.MANAGE,
  ],
  // Opcional: estado para validación de seguridad
  state: 'random-state-string',
  // Opcional: forzar aprobación incluso si ya autorizó antes
  prompt: 'consent',
  // Opcional: acceso offline (para refresh tokens)
  accessType: 'offline',
});

console.log('Visita esta URL:', authUrl);
```

### Manejar el Callback

```typescript
import express from 'express';

const app = express();

app.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  
  // Validar estado (seguridad CSRF)
  if (state !== 'random-state-string') {
    res.status(400).send('Invalid state');
    return;
  }
  
  try {
    // Intercambiar código por tokens
    const tokens = await auth.getTokens(code);
    
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Expires In:', tokens.expires_in);
    console.log('Scope:', tokens.scope);
    
    // Guardar tokens de forma segura
    await saveTokens(tokens);
    
    res.send('Autorización exitosa! Puedes cerrar esta ventana.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error en la autorización');
  }
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
```

### Usar Tokens con la API

```typescript
import YouTube from 'youtube-node';

async function makeAuthenticatedRequest(accessToken: string) {
  const youTube = new YouTube();
  
  // Configurar el token de acceso
  youTube.setAccessToken(accessToken);
  
  // Ahora puedes hacer requests autenticados
  const myChannel = await youTube.channels.getMyChannel();
  console.log('Mi canal:', myChannel.items?.[0]?.snippet?.title);
  
  // Subir un video
  const upload = await youTube.videos.upload(
    {
      snippet: {
        title: 'Mi Video',
        description: 'Descripción del video',
      },
      status: {
        privacyStatus: 'private',
      },
    },
    '/ruta/al/video.mp4'
  );
  
  return upload;
}
```

### Refrescar Tokens

```typescript
async function refreshAccessToken(refreshToken: string) {
  try {
    const newTokens = await auth.refreshAccessToken(refreshToken);
    
    console.log('Nuevo Access Token:', newTokens.access_token);
    console.log('Nuevo Expires In:', newTokens.expires_in);
    
    // Guardar los nuevos tokens
    await saveTokens(newTokens);
    
    return newTokens;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    throw error;
  }
}

// Verificar y refrescar si es necesario
async function getValidAccessToken() {
  const tokens = await loadTokens();
  
  // Verificar si el token expiró
  const now = Date.now();
  const expiryTime = tokens.expiry_date;
  
  if (now >= expiryTime) {
    console.log('Token expirado, refrescando...');
    const newTokens = await refreshAccessToken(tokens.refresh_token);
    return newTokens.access_token;
  }
  
  return tokens.access_token;
}
```

## Scopes Disponibles

```typescript
enum YouTubeScopes {
  // Solo lectura
  READ_ONLY = 'https://www.googleapis.com/auth/youtube.readonly',
  
  // Subir videos
  UPLOAD = 'https://www.googleapis.com/auth/youtube.upload',
  
  // Gestión completa (lectura + escritura)
  MANAGE = 'https://www.googleapis.com/auth/youtube',
  
  // Forzar SSL
  FORCE_SSL = 'https://www.googleapis.com/auth/youtube.force-ssl',
  
  // Parte de un partner
  PARTNER = 'https://www.googleapis.com/auth/youtubepartner',
  
  // Contenido de un partner
  PARTNER_CONTENT = 'https://www.googleapis.com/auth/youtubepartner-content-owner-readonly',
}
```

## Ejemplo Completo: Servidor Express

```typescript
import express from 'express';
import session from 'express-session';
import YouTube, { YouTubeAuth, YouTubeScopes } from 'youtube-node';

const app = express();

// Configurar sesiones
app.use(session({
  secret: 'tu-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Configurar OAuth
const auth = new YouTubeAuth({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  redirectUri: 'http://localhost:3000/callback',
});

// Ruta para iniciar autenticación
app.get('/auth', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  req.session!.state = state;
  
  const authUrl = auth.generateAuthUrl({
    scope: [
      YouTubeScopes.READ_ONLY,
      YouTubeScopes.UPLOAD,
    ],
    state,
    accessType: 'offline',
    prompt: 'consent',
  });
  
  res.redirect(authUrl);
});

// Callback de OAuth
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Validar state
  if (state !== req.session!.state) {
    return res.status(400).send('Invalid state');
  }
  
  try {
    const tokens = await auth.getTokens(code as string);
    
    // Guardar en sesión
    req.session!.tokens = tokens;
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Error de autenticación');
  }
});

// Dashboard (requiere autenticación)
app.get('/dashboard', async (req, res) => {
  const tokens = req.session!.tokens;
  
  if (!tokens) {
    return res.redirect('/auth');
  }
  
  try {
    const youTube = new YouTube();
    youTube.setAccessToken(tokens.access_token);
    
    // Obtener información del canal
    const channel = await youTube.channels.getMyChannel();
    
    res.json({
      channel: channel.items?.[0]?.snippet?.title,
      subscribers: channel.items?.[0]?.statistics?.subscriberCount,
      videos: channel.items?.[0]?.statistics?.videoCount,
    });
  } catch (error) {
    res.status(500).send('Error al obtener información');
  }
});

// Subir video
app.post('/upload', async (req, res) => {
  const tokens = req.session!.tokens;
  
  if (!tokens) {
    return res.status(401).send('No autenticado');
  }
  
  try {
    const youTube = new YouTube();
    youTube.setAccessToken(tokens.access_token);
    
    const result = await youTube.videos.upload(
      {
        snippet: {
          title: 'Video subido desde API',
          description: 'Descripción del video',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      '/ruta/al/video.mp4'
    );
    
    res.json({
      success: true,
      videoId: result.items?.[0]?.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir video' });
  }
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session!.destroy(() => {
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
```

## Mejores Prácticas

### Seguridad

```typescript
// 1. Siempre usar HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// 2. Validar state parameter
function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

// 3. Almacenar tokens de forma segura
// Usar base de datos encriptada o gestor de secretos
// Nunca guardar en localStorage del cliente

// 4. Usar PKCE para apps móviles
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

const authUrl = auth.generateAuthUrl({
  scope: [YouTubeScopes.READ_ONLY],
  codeChallenge,
  codeChallengeMethod: 'S256',
});
```

### Manejo de Errores OAuth

```typescript
app.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  
  if (error) {
    console.error('OAuth Error:', error, error_description);
    
    // Manejar errores específicos
    switch (error) {
      case 'access_denied':
        return res.send('El usuario denegó el acceso');
      case 'invalid_scope':
        return res.send('Scope inválido solicitado');
      default:
        return res.send('Error de autenticación');
    }
  }
  
  // Continuar con el flujo normal...
});
```
