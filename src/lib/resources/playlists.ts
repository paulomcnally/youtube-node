import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de Playlists de YouTube API
 * https://developers.google.com/youtube/v3/docs/playlists
 */
export class PlaylistsResource extends YouTubeResource {
  /**
   * Playlists data from Playlist Id
   * @param id - Playlist ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlists/list
   */
  getById(id: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      // Modo callback (backward compatible)
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('status');
        this.addPart('player');
        this.addPart('id');

        this.addParam('part', this.getParts());
        this.addParam('id', id);

        this.request(this.getUrl('playlists'), callback);

        this.clearParams();
        this.clearParts();
      }
      return undefined;
    }

    // Modo Promise
    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('status');
      this.addPart('player');
      this.addPart('id');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('playlists'), (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Playlists data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @returns Promise with result
   * @deprecated Use getById() without callback instead
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.getById(id) as Promise<YtResult>;
  }

  /**
   * Playlists data from Playlist Id
   * @param id - Playlist ID
   * @param maxResults - Maximum results or callback
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlistItems/list
   */
  getItemsById(id: string, maxResults?: number | Callback, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    // Determinar si maxResults es un callback
    const isCallback = typeof maxResults === 'function';
    const cb = isCallback ? (maxResults as Callback) : callback;
    const maxRes = isCallback ? null : (maxResults as number | undefined);

    if (cb) {
      // Modo callback (backward compatible)
      if (validate !== null) {
        cb(validate);
      } else {
        this.addPart('contentDetails');
        this.addPart('id');
        this.addPart('snippet');
        this.addPart('status');

        this.addParam('part', this.getParts());
        this.addParam('playlistId', id);

        if (maxRes) {
          this.addParam('maxResults', maxRes);
        }

        this.request(this.getUrl('playlistItems'), cb);

        this.clearParams();
        this.clearParts();
      }
      return undefined;
    }

    // Modo Promise
    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addPart('contentDetails');
      this.addPart('id');
      this.addPart('snippet');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('playlistId', id);

      if (maxRes) {
        this.addParam('maxResults', maxRes);
      }

      this.request(this.getUrl('playlistItems'), (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Playlists items data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use getItemsById() without callback instead
   */
  getItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult> {
    return this.getItemsById(id, maxResults) as Promise<YtResult>;
  }

  /**
   * Get playlists by channel ID
   * @param channelId - Channel ID
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlists/list
   */
  getByChannel(
    channelId: string,
    options: {
      maxResults?: number;
      pageToken?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('status');
        this.addPart('player');
        this.addPart('id');

        this.addParam('part', this.getParts());
        this.addParam('channelId', channelId);

        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }

        this.request(this.getUrl('playlists'), callback);

        this.clearParams();
        this.clearParts();
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('status');
      this.addPart('player');
      this.addPart('id');

      this.addParam('part', this.getParts());
      this.addParam('channelId', channelId);

      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }

      this.request(this.getUrl('playlists'), (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Get playlists by channel ID (Promise)
   * @param channelId - Channel ID
   * @param options - Optional parameters
   * @returns Promise with result
   */
  getByChannelAsync(
    channelId: string,
    options: {
      maxResults?: number;
      pageToken?: string;
    } = {},
  ): Promise<YtResult> {
    return this.getByChannel(channelId, options) as Promise<YtResult>;
  }

  /**
   * Create a new playlist (OAuth required)
   * @param title - Playlist title
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlists/insert
   */
  insert(
    title: string,
    options: {
      description?: string;
      privacyStatus?: 'public' | 'private' | 'unlisted';
      tags?: string[];
      defaultLanguage?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const playlistResource = {
      snippet: {
        title,
        ...(options.description && { description: options.description }),
        ...(options.tags && { tags: options.tags }),
        ...(options.defaultLanguage && { defaultLanguage: options.defaultLanguage }),
      },
      status: {
        privacyStatus: options.privacyStatus || 'private',
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('status');
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('playlists'), playlistResource, (err, data) => {
          this.clearParams();
          this.clearParts();
          callback(err, data);
        });
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('status');
      this.addPart('contentDetails');

      this.addParam('part', this.getParts());

      this.requestPost(this.getUrl('playlists'), playlistResource, (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Create playlist (Promise)
   * @param title - Playlist title
   * @param options - Optional parameters
   * @returns Promise with result
   */
  insertAsync(
    title: string,
    options: {
      description?: string;
      privacyStatus?: 'public' | 'private' | 'unlisted';
      tags?: string[];
      defaultLanguage?: string;
    } = {},
  ): Promise<YtResult> {
    return this.insert(title, options) as Promise<YtResult>;
  }

  /**
   * Update a playlist (OAuth required)
   * @param playlistId - Playlist ID
   * @param options - Update options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlists/update
   */
  update(
    playlistId: string,
    options: {
      title?: string;
      description?: string;
      privacyStatus?: 'public' | 'private' | 'unlisted';
      tags?: string[];
      defaultLanguage?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const playlistResource: Record<string, unknown> = {
      id: playlistId,
    };

    if (options.title || options.description || options.tags || options.defaultLanguage) {
      playlistResource.snippet = {};
      if (options.title) {
        (playlistResource.snippet as Record<string, unknown>).title = options.title;
      }
      if (options.description) {
        (playlistResource.snippet as Record<string, unknown>).description = options.description;
      }
      if (options.tags) {
        (playlistResource.snippet as Record<string, unknown>).tags = options.tags;
      }
      if (options.defaultLanguage) {
        (playlistResource.snippet as Record<string, unknown>).defaultLanguage = options.defaultLanguage;
      }
    }

    if (options.privacyStatus) {
      playlistResource.status = {
        privacyStatus: options.privacyStatus,
      };
    }

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('status');

        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('playlists'), playlistResource, (err, data) => {
          this.clearParams();
          this.clearParts();
          callback(err, data);
        });
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('status');

      this.addParam('part', this.getParts());

      this.requestPut(this.getUrl('playlists'), playlistResource, (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Update playlist (Promise)
   * @param playlistId - Playlist ID
   * @param options - Update options
   * @returns Promise with result
   */
  updateAsync(
    playlistId: string,
    options: {
      title?: string;
      description?: string;
      privacyStatus?: 'public' | 'private' | 'unlisted';
      tags?: string[];
      defaultLanguage?: string;
    } = {},
  ): Promise<YtResult> {
    return this.update(playlistId, options) as Promise<YtResult>;
  }

  /**
   * Delete a playlist (OAuth required)
   * @param playlistId - Playlist ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlists/delete
   */
  delete(playlistId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', playlistId);

        this.requestDelete(this.getUrl('playlists'), (err, data) => {
          this.clearParams();
          callback(err, data);
        });
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.clearParams();
      this.addParam('id', playlistId);

      this.requestDelete(this.getUrl('playlists'), (err, data) => {
        this.clearParams();

        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Delete playlist (Promise)
   * @param playlistId - Playlist ID
   * @returns Promise with result
   */
  deleteAsync(playlistId: string): Promise<YtResult> {
    return this.delete(playlistId) as Promise<YtResult>;
  }
}
