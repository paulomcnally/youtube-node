---
sidebar_position: 6
---

# Suscripciones

Gestiona suscripciones a canales de YouTube.

## Listar Suscripciones

### `subscriptions.list(options)`

Lista las suscripciones del usuario autenticado (requiere OAuth).

```typescript
async function listMySubscriptions() {
  try {
    // Obtener mis suscripciones
    const subscriptions = await youTube.subscriptions.list({
      mine: true,
      maxResults: 50,
      order: 'alphabetical', // 'alphabetical', 'relevance', 'unread'
    });
    
    console.log(`Estás suscrito a ${subscriptions.items?.length} canales`);
    
    subscriptions.items?.forEach((sub, index) => {
      console.log(`\n${index + 1}. ${sub.snippet?.title}`);
      console.log(`   ID del canal: ${sub.snippet?.resourceId?.channelId}`);
      console.log(`   Descripción: ${sub.snippet?.description?.substring(0, 100)}...`);
      console.log(`   Suscrito desde: ${sub.snippet?.publishedAt}`);
      console.log(`   Publicaciones nuevas: ${sub.contentDetails?.newItemCount}`);
      console.log(`   Total de items: ${sub.contentDetails?.totalItemCount}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Listar Suscriptores de un Canal

```typescript
async function listChannelSubscribers(channelId: string) {
  try {
    // Solo funciona si eres el dueño del canal (requiere OAuth)
    const mySubscribers = await youTube.subscriptions.list({
      mySubscribers: true,
      maxResults: 50,
    });
    
    console.log(`Tienes ${mySubscribers.items?.length} suscriptores visibles`);
    
    mySubscribers.items?.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.subscriberSnippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Suscribirse a un Canal (Requiere OAuth)

### `subscriptions.subscribeToChannel(channelId)`

Suscribe al usuario autenticado a un canal.

```typescript
async function subscribeToChannel() {
  try {
    const result = await youTube.subscriptions.subscribeToChannel('CHANNEL_ID');
    
    console.log('¡Suscripción exitosa!');
    console.log('ID de suscripción:', result.items?.[0]?.id);
    console.log('Canal:', result.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Cancelar Suscripción (Requiere OAuth)

### `subscriptions.unsubscribe(subscriptionId)`

Cancela una suscripción usando el ID de suscripción.

```typescript
async function unsubscribe() {
  try {
    await youTube.subscriptions.unsubscribe('SUBSCRIPTION_ID');
    console.log('Suscripción cancelada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `subscriptions.findAndUnsubscribe(channelId)`

Encuentra y cancela la suscripción a un canal (más conveniente).

```typescript
async function unsubscribeFromChannel() {
  try {
    await youTube.subscriptions.findAndUnsubscribe('CHANNEL_ID');
    console.log('Suscripción cancelada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de una Suscripción

```typescript
interface Subscription {
  kind: 'youtube#subscription';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
    resourceId: {
      kind: 'youtube#channel';
      channelId: string;
    };
    channelId: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: 'all' | 'uploads';
  };
  subscriberSnippet?: {
    title: string;
    description: string;
    channelId: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}
```

## Ejemplos Completos

### Gestionar Suscripciones

```typescript
class SubscriptionManager {
  constructor(private youtube: YouTube) {}
  
  // Obtener todas las suscripciones con paginación
  async getAllSubscriptions() {
    const allSubs: any[] = [];
    let pageToken: string | undefined;
    
    do {
      const subs = await this.youtube.subscriptions.list({
        mine: true,
        maxResults: 50,
        pageToken,
      });
      
      allSubs.push(...(subs.items || []));
      pageToken = subs.nextPageToken;
    } while (pageToken);
    
    return allSubs;
  }
  
  // Verificar si está suscrito a un canal
  async isSubscribed(channelId: string) {
    try {
      const subs = await this.youtube.subscriptions.list({
        mine: true,
        forChannelId: channelId,
      });
      
      return subs.items && subs.items.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  // Buscar suscripción por nombre
  async findSubscription(channelName: string) {
    const subs = await this.getAllSubscriptions();
    
    return subs.filter(sub => 
      sub.snippet?.title.toLowerCase().includes(channelName.toLowerCase())
    );
  }
  
  // Toggle suscripción
  async toggleSubscription(channelId: string) {
    const isSubscribed = await this.isSubscribed(channelId);
    
    if (isSubscribed) {
      await this.youtube.subscriptions.findAndUnsubscribe(channelId);
      return { action: 'unsubscribed', channelId };
    } else {
      const result = await this.youtube.subscriptions.subscribeToChannel(channelId);
      return { action: 'subscribed', channelId, subscriptionId: result.items?.[0]?.id };
    }
  }
  
  // Exportar suscripciones
  async exportSubscriptions() {
    const subs = await this.getAllSubscriptions();
    
    return subs.map(sub => ({
      channelId: sub.snippet?.resourceId?.channelId,
      channelTitle: sub.snippet?.title,
      description: sub.snippet?.description,
      subscribedAt: sub.snippet?.publishedAt,
      thumbnails: sub.snippet?.thumbnails,
      contentDetails: sub.contentDetails,
    }));
  }
  
  // Estadísticas de suscripciones
  async getSubscriptionStats() {
    const subs = await this.getAllSubscriptions();
    
    const stats = {
      total: subs.length,
      withNewContent: subs.filter(s => (s.contentDetails?.newItemCount || 0) > 0).length,
      totalItems: subs.reduce((acc, s) => acc + (s.contentDetails?.totalItemCount || 0), 0),
      subscriptionsByDate: subs.reduce((acc, s) => {
        const date = new Date(s.snippet?.publishedAt || '').toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
    
    return stats;
  }
}

// Uso
const manager = new SubscriptionManager(youTube);
const allSubs = await manager.getAllSubscriptions();
const stats = await manager.getSubscriptionStats();
```

### Suscribirse a Múltiples Canales

```typescript
async function subscribeToMultiple(channelIds: string[]) {
  const results = {
    successful: [] as string[],
    failed: [] as { channelId: string; error: string }[],
  };
  
  for (const channelId of channelIds) {
    try {
      await youTube.subscriptions.subscribeToChannel(channelId);
      results.successful.push(channelId);
      console.log(`✅ Suscrito a: ${channelId}`);
    } catch (error: any) {
      results.failed.push({ channelId, error: error.message });
      console.log(`❌ Error con ${channelId}: ${error.message}`);
    }
    
    // Esperar un poco entre solicitudes para evitar rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

// Uso
const channelsToSubscribe = ['CHANNEL_ID_1', 'CHANNEL_ID_2', 'CHANNEL_ID_3'];
const result = await subscribeToMultiple(channelsToSubscribe);
console.log(`Suscrito a ${result.successful.length} canales`);
console.log(`Fallaron ${result.failed.length} canales`);
```

### Limpiar Suscripciones Inactivas

```typescript
async function cleanInactiveSubscriptions(
  options: {
    minTotalItems?: number;
    maxNewItems?: number;
    dryRun?: boolean;
  } = {}
) {
  try {
    const subs = await youTube.subscriptions.list({
      mine: true,
      maxResults: 50,
    });
    
    const toUnsubscribe: any[] = [];
    
    subs.items?.forEach((sub) => {
      const totalItems = sub.contentDetails?.totalItemCount || 0;
      const newItems = sub.contentDetails?.newItemCount || 0;
      
      // Criterios para considerar inactivo
      const isInactive = 
        (options.minTotalItems !== undefined && totalItems < options.minTotalItems) ||
        (options.maxNewItems !== undefined && newItems > options.maxNewItems);
      
      if (isInactive) {
        toUnsubscribe.push({
          id: sub.id,
          channelId: sub.snippet?.resourceId?.channelId,
          title: sub.snippet?.title,
          totalItems,
          newItems,
        });
      }
    });
    
    console.log(`Encontradas ${toUnsubscribe.length} suscripciones inactivas`);
    
    if (options.dryRun) {
      console.log('Modo simulación - no se realizarán cambios');
      return toUnsubscribe;
    }
    
    // Cancelar suscripciones
    const results = {
      cancelled: [] as string[],
      errors: [] as { channel: string; error: string }[],
    };
    
    for (const sub of toUnsubscribe) {
      try {
        await youTube.subscriptions.unsubscribe(sub.id);
        results.cancelled.push(sub.title);
        console.log(`❌ Cancelada suscripción a: ${sub.title}`);
      } catch (err: any) {
        results.errors.push({ channel: sub.title, error: err.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Uso - Primero en modo simulación
const inactive = await cleanInactiveSubscriptions({
  minTotalItems: 10,
  maxNewItems: 100,
  dryRun: true,
});

// Luego real
const cleaned = await cleanInactiveSubscriptions({
  minTotalItems: 10,
  maxNewItems: 100,
  dryRun: false,
});
```
