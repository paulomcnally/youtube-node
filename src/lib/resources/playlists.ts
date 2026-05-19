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
}
