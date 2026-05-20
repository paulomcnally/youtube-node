---
sidebar_position: 5
---

# Comentarios

Aprende a trabajar con comentarios y threads de videos.

## Listar Comentarios

### `comments.list(videoId?, channelId?)`

Lista los comentarios de un video o canal.

```typescript
async function listComments() {
  try {
    // Comentarios de un video
    const videoComments = await youTube.comments.list('VIDEO_ID');
    
    // Comentarios de un canal
    const channelComments = await youTube.comments.list(undefined, 'CHANNEL_ID');
    
    console.log(`Encontrados ${videoComments.items?.length} comentarios`);
    
    videoComments.items?.forEach((item, index) => {
      const snippet = item.snippet?.topLevelComment?.snippet;
      
      console.log(`\n=== COMENTARIO ${index + 1} ===`);
      console.log('Autor:', snippet?.authorDisplayName);
      console.log('Texto:', snippet?.textDisplay);
      console.log('Likes:', snippet?.likeCount);
      console.log('Publicado:', snippet?.publishedAt);
      console.log('Respuestas:', item.snippet?.totalReplyCount);
      
      // Ver respuestas
      if (item.replies?.comments && item.replies.comments.length > 0) {
        console.log('\n--- Respuestas:');
        item.replies.comments.forEach((reply: any) => {
          console.log(`  → ${reply.snippet?.authorDisplayName}: ${reply.snippet?.textDisplay}`);
        });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `commentThreads.list(options)`

Lista threads de comentarios con más opciones.

```typescript
async function listCommentThreads() {
  try {
    // Threads de un video
    const threads = await youTube.commentThreads.list({
      videoId: 'VIDEO_ID',
      maxResults: 50,
      order: 'relevance', // 'time' o 'relevance'
    });
    
    // Threads de un canal
    const channelThreads = await youTube.commentThreads.list({
      channelId: 'CHANNEL_ID',
      maxResults: 20,
    });
    
    // Buscar comentarios con términos específicos
    const searchThreads = await youTube.commentThreads.list({
      videoId: 'VIDEO_ID',
      searchTerms: 'gracias',
    });
    
    // Filtrar por estado de moderación
    const moderated = await youTube.commentThreads.list({
      videoId: 'VIDEO_ID',
      moderationStatus: 'likelySpam', // 'heldForReview', 'likelySpam', 'published'
    });
    
    console.log(`Threads encontrados: ${threads.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `comments.getComments(options)`

Obtiene comentarios individuales o respuestas.

```typescript
async function getIndividualComments() {
  try {
    // Obtener comentarios específicos por ID
    const byId = await youTube.comments.getComments({
      id: ['COMMENT_ID_1', 'COMMENT_ID_2'],
    });
    
    // Obtener respuestas a un comentario
    const replies = await youTube.comments.getComments({
      parentId: 'PARENT_COMMENT_ID',
      maxResults: 50,
    });
    
    console.log(`Respuestas: ${replies.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Añadir Comentarios (Requiere OAuth)

### `comments.add(videoId, text, options?)`

Añade un comentario a un video.

```typescript
async function addComment() {
  try {
    const result = await youTube.comments.add(
      'VIDEO_ID',
      '¡Excelente video! Me ayudó mucho.',
      {
        channelId: 'CHANNEL_ID', // Opcional
      }
    );
    
    console.log('Comentario añadido');
    console.log('ID:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `comments.reply(parentCommentId, text)`

Responde a un comentario existente.

```typescript
async function replyToComment() {
  try {
    const result = await youTube.comments.reply(
      'PARENT_COMMENT_ID',
      '¡Gracias por tu comentario! Me alegra que te haya sido útil.'
    );
    
    console.log('Respuesta añadida');
    console.log('ID:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Actualizar Comentarios (Requiere OAuth)

### `comments.update(commentId, text)`

Actualiza un comentario existente.

```typescript
async function updateComment() {
  try {
    const result = await youTube.comments.update(
      'COMMENT_ID',
      'Texto actualizado del comentario'
    );
    
    console.log('Comentario actualizado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Eliminar Comentarios (Requiere OAuth)

### `comments.delete(commentId)`

Elimina un comentario.

```typescript
async function deleteComment() {
  try {
    await youTube.comments.delete('COMMENT_ID');
    console.log('Comentario eliminado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Moderación de Comentarios (Requiere OAuth - Solo Propietario del Canal)

### `comments.setModerationStatus(commentIds, status, options?)`

Establece el estado de moderación de comentarios.

```typescript
async function moderateComment() {
  try {
    // Publicar comentario (aprobar)
    await youTube.comments.setModerationStatus(
      'COMMENT_ID',
      'published'
    );
    
    // Retener para revisión
    await youTube.comments.setModerationStatus(
      'COMMENT_ID',
      'heldForReview'
    );
    
    // Rechazar y banear al autor
    await youTube.comments.setModerationStatus(
      'COMMENT_ID',
      'rejected',
      { banAuthor: true }
    );
    
    // Moderar múltiples comentarios a la vez
    await youTube.comments.setModerationStatus(
      ['COMMENT_ID_1', 'COMMENT_ID_2', 'COMMENT_ID_3'],
      'published'
    );
    
    console.log('Estado de moderación actualizado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `comments.markAsSpam(commentId)`

Marca un comentario como spam.

```typescript
async function markAsSpam() {
  try {
    await youTube.comments.markAsSpam('COMMENT_ID');
    console.log('Comentario marcado como spam');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de un Thread de Comentarios

```typescript
interface CommentThread {
  kind: 'youtube#commentThread';
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    videoId: string;
    topLevelComment: {
      kind: 'youtube#comment';
      etag: string;
      id: string;
      snippet: {
        channelId: string;
        videoId: string;
        textDisplay: string;
        textOriginal: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelUrl: string;
        authorChannelId: {
          value: string;
        };
        canRate: boolean;
        viewerRating: string;
        likeCount: number;
        publishedAt: string;
        updatedAt: string;
      };
    };
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
  };
  replies?: {
    comments: Comment[];
  };
}
```

### Estructura de un Comentario

```typescript
interface Comment {
  kind: 'youtube#comment';
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    videoId: string;
    parentId?: string; // Solo en respuestas
    textDisplay: string;
    textOriginal: string;
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
      value: string;
    };
    canRate: boolean;
    viewerRating: string;
    likeCount: number;
    moderationStatus?: string;
    publishedAt: string;
    updatedAt: string;
  };
}
```

## Ejemplos Completos

### Obtener Todos los Comentarios de un Video

```typescript
async function getAllVideoComments(videoId: string) {
  try {
    const allComments: any[] = [];
    let pageToken: string | undefined;
    
    do {
      const threads = await youTube.commentThreads.list({
        videoId,
        maxResults: 100,
        pageToken,
        order: 'time',
      });
      
      for (const thread of threads.items || []) {
        // Comentario principal
        const topComment = thread.snippet?.topLevelComment;
        allComments.push({
          id: topComment?.id,
          type: 'top',
          author: topComment?.snippet?.authorDisplayName,
          authorChannelId: topComment?.snippet?.authorChannelId?.value,
          text: topComment?.snippet?.textDisplay,
          likes: topComment?.snippet?.likeCount,
          publishedAt: topComment?.snippet?.publishedAt,
          replies: thread.snippet?.totalReplyCount,
        });
        
        // Respuestas
        if (thread.replies?.comments) {
          for (const reply of thread.replies.comments) {
            allComments.push({
              id: reply.id,
              type: 'reply',
              parentId: thread.snippet?.topLevelComment?.id,
              author: reply.snippet?.authorDisplayName,
              authorChannelId: reply.snippet?.authorChannelId?.value,
              text: reply.snippet?.textDisplay,
              likes: reply.snippet?.likeCount,
              publishedAt: reply.snippet?.publishedAt,
              replies: 0,
            });
          }
        }
      }
      
      pageToken = threads.nextPageToken;
    } while (pageToken);
    
    return {
      total: allComments.length,
      topLevel: allComments.filter(c => c.type === 'top').length,
      replies: allComments.filter(c => c.type === 'reply').length,
      comments: allComments,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

### Analizar Sentimiento de Comentarios

```typescript
async function analyzeComments(videoId: string) {
  try {
    const comments = await getAllVideoComments(videoId);
    
    if (!comments) return null;
    
    // Palabras clave simples para análisis básico
    const positiveWords = ['excelente', 'gracias', 'mejor', 'bueno', 'genial', 'increíble', 'útil', 'perfecto'];
    const negativeWords = ['malo', 'horrible', 'peor', 'basura', 'odio', 'pésimo', 'inútil'];
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    const authors: Record<string, number> = {};
    const popularComments: any[] = [];
    
    comments.comments.forEach((comment) => {
      const text = comment.text.toLowerCase();
      let score = 0;
      
      positiveWords.forEach(word => {
        if (text.includes(word)) score++;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) score--;
      });
      
      if (score > 0) positive++;
      else if (score < 0) negative++;
      else neutral++;
      
      // Contar comentarios por autor
      authors[comment.author] = (authors[comment.author] || 0) + 1;
      
      // Guardar comentarios populares (más likes)
      if (comment.likes > 5) {
        popularComments.push(comment);
      }
    });
    
    return {
      totalComments: comments.total,
      sentiment: {
        positive,
        negative,
        neutral,
        positivePercentage: ((positive / comments.total) * 100).toFixed(1),
      },
      topAuthors: Object.entries(authors)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5),
      mostLikedComments: popularComments
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10),
      averageLikesPerComment: comments.comments.reduce((acc, c) => acc + c.likes, 0) / comments.total,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

### Responder a Comentarios Masivamente

```typescript
async function autoReplyToComments(
  videoId: string,
  replyText: string,
  options: {
    onlyUnreplied?: boolean;
    maxReplies?: number;
  } = {}
) {
  try {
    const threads = await youTube.commentThreads.list({
      videoId,
      maxResults: 100,
    });
    
    let repliedCount = 0;
    const errors: string[] = [];
    
    for (const thread of threads.items || []) {
      if (options.maxReplies && repliedCount >= options.maxReplies) {
        break;
      }
      
      const topComment = thread.snippet?.topLevelComment;
      const hasReplies = (thread.snippet?.totalReplyCount || 0) > 0;
      
      // Solo responder si no tiene respuestas
      if (options.onlyUnreplied && hasReplies) {
        continue;
      }
      
      try {
        await youTube.comments.reply(
          topComment?.id!,
          replyText
        );
        
        repliedCount++;
        console.log(`Respondido a: ${topComment?.snippet?.authorDisplayName}`);
      } catch (err: any) {
        errors.push(`Error respondiendo a ${topComment?.snippet?.authorDisplayName}: ${err.message}`);
      }
    }
    
    return {
      success: true,
      repliedCount,
      errors,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```
