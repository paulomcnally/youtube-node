---
sidebar_position: 10
---

# Categorías de Video

Obtén las categorías de video disponibles en YouTube.

## Listar Categorías

### `videoCategories.list(options?)`

Obtiene todas las categorías de video disponibles.

```typescript
async function listVideoCategories() {
  try {
    // Categorías por región
    const categories = await youTube.videoCategories.list({
      regionCode: 'ES', // España
    });
    
    // Categorías por ID
    const specificCategories = await youTube.videoCategories.list({
      id: ['1', '2', '10', '20'], // IDs específicos
    });
    
    console.log(`Categorías disponibles: ${categories.items?.length}`);
    
    categories.items?.forEach((category) => {
      console.log(`\n${category.id}. ${category.snippet?.title}`);
      console.log(`   Asignable: ${category.snippet?.assignable ? 'Sí' : 'No'}`);
      console.log(`   Canal: ${category.snippet?.channelId}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Categorías Comunes

Aquí están algunas de las categorías más comunes:

| ID | Categoría |
|----|-----------|
| 1 | Film & Animation |
| 2 | Autos & Vehicles |
| 10 | Music |
| 15 | Pets & Animals |
| 17 | Sports |
| 19 | Travel & Events |
| 20 | Gaming |
| 22 | People & Blogs |
| 23 | Comedy |
| 24 | Entertainment |
| 25 | News & Politics |
| 26 | Howto & Style |
| 27 | Education |
| 28 | Science & Technology |
| 29 | Nonprofits & Activism |

## Información de Respuesta

### Estructura de una Categoría

```typescript
interface VideoCategory {
  kind: 'youtube#videoCategory';
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    title: string;
    assignable: boolean;
  };
}
```

## Ejemplos Completos

### Obtener Categorías Asignables

```typescript
async function getAssignableCategories(regionCode: string = 'US') {
  try {
    const categories = await youTube.videoCategories.list({
      regionCode,
    });
    
    const assignable = categories.items
      ?.filter(cat => cat.snippet?.assignable)
      .map(cat => ({
        id: cat.id,
        title: cat.snippet?.title,
      }))
      .sort((a, b) => a.title!.localeCompare(b.title!));
    
    return assignable;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Uso
const categories = await getAssignableCategories('ES');
categories.forEach(cat => {
  console.log(`${cat.id}: ${cat.title}`);
});
```

### Categorizar Videos Populares

```typescript
async function getPopularByAllCategories(regionCode: string = 'US') {
  try {
    // Obtener todas las categorías
    const categories = await youTube.videoCategories.list({ regionCode });
    
    const results: any[] = [];
    
    for (const category of categories.items || []) {
      if (!category.snippet?.assignable) continue;
      
      try {
        const popular = await youTube.videos.getMostPopularByCategory(
          5,
          category.id!
        );
        
        results.push({
          categoryId: category.id,
          categoryName: category.snippet?.title,
          videos: popular.items?.map(v => ({
            id: v.id,
            title: v.snippet?.title,
            views: v.statistics?.viewCount,
          })),
        });
      } catch (err) {
        console.error(`Error con categoría ${category.id}:`, err);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

### Mapeo de Categorías

```typescript
class CategoryMapper {
  private categories: Map<string, string> = new Map();
  
  async loadCategories(regionCode: string = 'US') {
    const categories = await youTube.videoCategories.list({ regionCode });
    
    this.categories.clear();
    categories.items?.forEach(cat => {
      this.categories.set(cat.id!, cat.snippet?.title!);
    });
  }
  
  getCategoryName(id: string): string {
    return this.categories.get(id) || 'Desconocida';
  }
  
  getCategoryId(name: string): string | undefined {
    for (const [id, catName] of this.categories) {
      if (catName.toLowerCase() === name.toLowerCase()) {
        return id;
      }
    }
    return undefined;
  }
  
  getAllCategories(): { id: string; name: string }[] {
    return Array.from(this.categories.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Uso
const mapper = new CategoryMapper();
await mapper.loadCategories('ES');

console.log(mapper.getCategoryName('27')); // "Education"
console.log(mapper.getCategoryId('Music')); // "10"
console.log(mapper.getAllCategories());
```
