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
   * @param callback - Callback function
   * https://developers.google.com/youtube/v3/docs/playlists/list
   */
  getById(id: string, callback: Callback): void {
    const validate = this.validate();

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
  }

  /**
   * Playlists data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @returns Promise with result
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.promisify(this.getById.bind(this), id);
  }

  /**
   * Playlists data from Playlist Id
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * https://developers.google.com/youtube/v3/docs/playlistItems/list
   */
  getItemsById(id: string, maxResults: number | Callback, callback?: Callback): void {
    const validate = this.validate();

    let cb: Callback;
    let maxRes: number | null;

    if (typeof maxResults === 'function') {
      cb = maxResults;
      maxRes = null;
    } else {
      cb = callback!;
      maxRes = maxResults;
    }

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
  }

  /**
   * Playlists items data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  getItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      const callback: Callback = (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      };

      if (maxResults !== undefined) {
        this.getItemsById(id, maxResults, callback);
      } else {
        this.getItemsById(id, callback);
      }
    });
  }
}
