---
sidebar_position: 2
---

# Paginación

Aprende a trabajar con grandes conjuntos de datos usando paginación.

## Conceptos Básicos

La API de YouTube devuelve resultados paginados cuando hay muchos items. Usa `nextPageToken` y `prevPageToken` para navegar.

```typescript
interface PaginatedResult {
  items: any[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  nextPageToken?: string;
  prevPageToken?: string;
}
```

## Paginación Manual

### Navegación Básica

```typescript
async function paginatedSearch() {
  try {
    // Primera página
    const firstPage = await youTube.search.query('nodejs', 50);
    console.log(`Total: ${firstPage.pageInfo?.totalResults}`);
    console.log(`Primera página: ${firstPage.items?.length} items`);
    
    // Segunda página
    if (firstPage.nextPageToken) {
      const secondPage = await youTube.search.query('nodejs', 50, {
        pageToken: firstPage.nextPageToken,
      });
      console.log(`Segunda página: ${secondPage.items?.length} items`);
      
      // Tercera página
      if (secondPage.nextPageToken) {
        const thirdPage = await youTube.search.query('nodejs', 50, {
          pageToken: secondPage.nextPageToken,
        });
        console.log(`Tercera página: ${thirdPage.items?.length} items`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Bucle de Paginación

```typescript
async function getAllSearchResults(query: string, maxPages: number = 10) {
  const allResults: any[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;
  
  do {
    try {
      const result = await youTube.search.query(query, 50, {
        pageToken,
      });
      
      if (result.items) {
        allResults.push(...result.items);
      }
      
      pageToken = result.nextPageToken;
      pageCount++;
      
      console.log(`Página ${pageCount}: ${result.items?.length} items`);
      
      // Respetar límites de la API
      if (pageCount < maxPages && pageToken) {
        await sleep(100); // Pequeña pausa entre requests
      }
    } catch (error) {
      console.error(`Error en página ${pageCount}:`, error.message);
      break;
    }
  } while (pageToken && pageCount < maxPages);
  
  return {
    totalFetched: allResults.length,
    pages: pageCount,
    items: allResults,
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Paginación con Generadores

### Async Generator

```typescript
async function* searchGenerator(query: string) {
  let pageToken: string | undefined;
  let pageCount = 0;
  
  do {
    const result = await youTube.search.query(query, 50, {
      pageToken,
    });
    
    yield {
      items: result.items || [],
      pageInfo: result.pageInfo,
      pageNumber: ++pageCount,
    };
    
    pageToken = result.nextPageToken;
    
    if (pageToken) {
      await sleep(100);
    }
  } while (pageToken);
}

// Uso
async function processAllResults() {
  for await (const page of searchGenerator('nodejs tutorial')) {
    console.log(`Procesando página ${page.pageNumber}...`);
    
    for (const item of page.items) {
      // Procesar cada item
      await processItem(item);
    }
  }
}
```

## Paginación de Playlists

### Obtener Todos los Items de una Playlist

```typescript
async function getAllPlaylistItems(playlistId: string) {
  const allItems: any[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;
  
  do {
    const result = await youTube.playlistItems.list(playlistId, {
      maxResults: 50,
      pageToken,
    });
    
    if (result.items) {
      allItems.push(...result.items);
    }
    
    pageToken = result.nextPageToken;
    pageCount++;
    
    console.log(`Playlist - Página ${pageCount}: ${result.items?.length} items`);
  } while (pageToken);
  
  return {
    total: allItems.length,
    pages: pageCount,
    items: allItems,
  };
}
```

## Paginación de Comentarios

### Obtener Todos los Comentarios

```typescript
async function getAllComments(videoId: string) {
  const allComments: any[] = [];
  let pageToken: string | undefined;
  
  do {
    const result = await youTube.commentThreads.list({
      videoId,
      maxResults: 100,
      pageToken,
      order: 'time',
    });
    
    if (result.items) {
      allComments.push(...result.items);
    }
    
    pageToken = result.nextPageToken;
  } while (pageToken);
  
  return allComments;
}
```

## Métodos de Paginación de la Clase YouTube

### `getAllResults(endpoint, options)`

Obtiene automáticamente todos los resultados de un endpoint.

```typescript
// Obtener todos los resultados de búsqueda
const allSearchResults = await youTube.getAllResults('search', {
  q: 'nodejs tutorial',
  maxResults: 50,
});

// Obtener todos los videos populares
const allPopular = await youTube.getAllResults('videos', {
  chart: 'mostPopular',
  maxResults: 50,
});

// Obtener todos los items de una playlist
const allItems = await youTube.getAllResults('playlistItems', {
  playlistId: 'PLAYLIST_ID',
  maxResults: 50,
});
```

### `paginate(endpoint, options)`

Async generator para paginación.

```typescript
// Iterar sobre todas las páginas
for await (const page of youTube.paginate('search', {
  q: 'nodejs',
  maxResults: 50,
})) {
  console.log(`Página con ${page.items?.length} resultados`);
  
  for (const item of page.items || []) {
    await processItem(item);
  }
}
```

## Paginación con Callbacks (Legacy)

```typescript
// Para compatibilidad con código antiguo
function getAllPagesWithCallback() {
  const allItems: any[] = [];
  
  function fetchPage(pageToken?: string) {
    const params: any = { maxResults: 50 };
    if (pageToken) params.pageToken = pageToken;
    
    youTube.search.query('nodejs', 50, params, (error, result) => {
      if (error) {
        console.error('Error:', error.message);
        return;
      }
      
      if (result?.items) {
        allItems.push(...result.items);
      }
      
      if (result?.nextPageToken) {
        fetchPage(result.nextPageToken);
      } else {
        console.log('Todos los items:', allItems.length);
      }
    });
  }
  
  fetchPage();
}
```

## Estrategias de Paginación

### Con Límite de Páginas

```typescript
async function getLimitedResults(query: string, maxPages: number = 5) {
  const results: any[] = [];
  let pageToken: string | undefined;
  
  for (let page = 0; page < maxPages; page++) {
    const result = await youTube.search.query(query, 50, {
      pageToken,
    });
    
    results.push(...(result.items || []));
    pageToken = result.nextPageToken;
    
    if (!pageToken) break;
  }
  
  return results;
}
```

### Con Límite de Tiempo

```typescript
async function getResultsWithTimeout(
  query: string, 
  maxTimeMs: number = 30000
) {
  const results: any[] = [];
  let pageToken: string | undefined;
  const startTime = Date.now();
  
  do {
    // Verificar timeout
    if (Date.now() - startTime > maxTimeMs) {
      console.log('⏱️ Timeout alcanzado');
      break;
    }
    
    const result = await youTube.search.query(query, 50, { pageToken });
    results.push(...(result.items || []));
    pageToken = result.nextPageToken;
    
  } while (pageToken);
  
  return results;
}
```

### Con Límite de Cuota

```typescript
class QuotaAwarePaginator {
  private quotaUsed = 0;
  private readonly quotaLimit: number;
  
  constructor(quotaLimit: number = 10000) {
    this.quotaLimit = quotaLimit;
  }
  
  async* paginate(query: string) {
    let pageToken: string | undefined;
    const unitsPerRequest = 100; // search.list = 100 unidades
    
    do {
      // Verificar cuota restante
      if (this.quotaUsed + unitsPerRequest > this.quotaLimit) {
        console.log('⚠️ Cuota casi agotada');
        break;
      }
      
      const result = await youTube.search.query(query, 50, { pageToken });
      
      this.quotaUsed += unitsPerRequest;
      
      yield {
        items: result.items || [],
        pageInfo: result.pageInfo,
        quotaUsed: this.quotaUsed,
        quotaRemaining: this.quotaLimit - this.quotaUsed,
      };
      
      pageToken = result.nextPageToken;
    } while (pageToken);
  }
  
  getQuotaUsed() {
    return this.quotaUsed;
  }
}
```

## Ejemplos Completos

### Buscador Paginado

```typescript
class PaginatedSearcher {
  constructor(private youtube: YouTube) {}
  
  async search(
    query: string, 
    options: {
      maxPages?: number;
      filters?: any;
    } = {}
  ) {
    const results: any[] = [];
    let pageToken: string | undefined;
    const maxPages = options.maxPages || 5;
    
    for (let page = 0; page < maxPages; page++) {
      const searchParams: any = {
        pageToken,
        ...options.filters,
      };
      
      const result = await this.youtube.search.query(query, 50, searchParams);
      
      results.push(...(result.items || []));
      
      console.log(`📄 Página ${page + 1}: ${result.items?.length} items (Total: ${results.length})`);
      
      pageToken = result.nextPageToken;
      if (!pageToken) {
        console.log('✅ Fin de resultados');
        break;
      }
    }
    
    return {
      query,
      totalResults: results.length,
      pages: Math.ceil(results.length / 50),
      items: results.map(item => ({
        id: item.id?.videoId || item.id?.channelId || item.id?.playlistId,
        type: item.id?.kind?.replace('youtube#', ''),
        title: item.snippet?.title,
        channel: item.snippet?.channelTitle,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
      })),
    };
  }
  
  // Buscar con procesamiento en streaming
  async* searchStreaming(
    query: string,
    options: { maxPages?: number; filters?: any } = {}
  ) {
    let pageToken: string | undefined;
    const maxPages = options.maxPages || 5;
    
    for (let page = 0; page < maxPages; page++) {
      const result = await this.youtube.search.query(query, 50, {
        pageToken,
        ...options.filters,
      });
      
      yield {
        page: page + 1,
        items: result.items || [],
        hasMore: !!result.nextPageToken,
      };
      
      pageToken = result.nextPageToken;
      if (!pageToken) break;
    }
  }
}

// Uso
const searcher = new PaginatedSearcher(youTube);

// Búsqueda normal
const results = await searcher.search('nodejs tutorial', { maxPages: 3 });

// Búsqueda en streaming
for await (const page of searcher.searchStreaming('nodejs')) {
  console.log(`Página ${page.page}: ${page.items.length} items`);
  for (const item of page.items) {
    await processItem(item);
  }
}
```
