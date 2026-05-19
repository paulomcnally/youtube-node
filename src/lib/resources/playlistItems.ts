import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de PlaylistItems de YouTube API
 * https://developers.google.com/youtube/v3/docs/playlistItems
 */
export class PlaylistItemsResource extends YouTubeResource {
  /**
   * Get playlist items by playlist ID
   * @param playlistId - Playlist ID
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlistItems/list
   */
  list(
    playlistId: string,
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
        this.clearParams();
        this.clearParts();

        this.addPart('contentDetails');
        this.addPart('id');
        this.addPart('snippet');
        this.addPart('status');

        this.addParam('part', this.getParts());
        this.addParam('playlistId', playlistId);

        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }

        this.request(this.getUrl('playlistItems'), (err, data) => {
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

      this.addPart('contentDetails');
      this.addPart('id');
      this.addPart('snippet');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('playlistId', playlistId);

      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
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
   * List playlist items (Promise)
   * @param playlistId - Playlist ID
   * @param options - Optional parameters
   * @returns Promise with result
   */
  listAsync(
    playlistId: string,
    options: {
      maxResults?: number;
      pageToken?: string;
    } = {},
  ): Promise<YtResult> {
    return this.list(playlistId, options) as Promise<YtResult>;
  }

  /**
   * Add a video to playlist (OAuth required)
   * @param playlistId - Playlist ID
   * @param videoId - Video ID
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlistItems/insert
   */
  insert(
    playlistId: string,
    videoId: string,
    options: {
      position?: number;
      note?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const playlistItemResource = {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId,
        },
        ...(options.position !== undefined && { position: options.position }),
        ...(options.note && { note: options.note }),
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('status');

        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('playlistItems'), playlistItemResource, (err, data) => {
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
      this.addPart('contentDetails');
      this.addPart('status');

      this.addParam('part', this.getParts());

      this.requestPost(this.getUrl('playlistItems'), playlistItemResource, (err, data) => {
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
   * Insert video to playlist (Promise)
   * @param playlistId - Playlist ID
   * @param videoId - Video ID
   * @param options - Optional parameters
   * @returns Promise with result
   */
  insertAsync(
    playlistId: string,
    videoId: string,
    options: {
      position?: number;
      note?: string;
    } = {},
  ): Promise<YtResult> {
    return this.insert(playlistId, videoId, options) as Promise<YtResult>;
  }

  /**
   * Update a playlist item (OAuth required)
   * @param playlistItemId - Playlist item ID
   * @param options - Update options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlistItems/update
   */
  update(
    playlistItemId: string,
    options: {
      playlistId?: string;
      videoId?: string;
      position?: number;
      note?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const playlistItemResource: Record<string, unknown> = {
      id: playlistItemId,
    };

    if (options.playlistId || options.videoId || options.position !== undefined || options.note) {
      playlistItemResource.snippet = {};
      if (options.playlistId) {
        (playlistItemResource.snippet as Record<string, unknown>).playlistId = options.playlistId;
      }
      if (options.videoId) {
        (playlistItemResource.snippet as Record<string, unknown>).resourceId = {
          kind: 'youtube#video',
          videoId: options.videoId,
        };
      }
      if (options.position !== undefined) {
        (playlistItemResource.snippet as Record<string, unknown>).position = options.position;
      }
      if (options.note) {
        (playlistItemResource.snippet as Record<string, unknown>).note = options.note;
      }
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

        this.requestPut(this.getUrl('playlistItems'), playlistItemResource, (err, data) => {
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

      this.requestPut(this.getUrl('playlistItems'), playlistItemResource, (err, data) => {
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
   * Update playlist item (Promise)
   * @param playlistItemId - Playlist item ID
   * @param options - Update options
   * @returns Promise with result
   */
  updateAsync(
    playlistItemId: string,
    options: {
      playlistId?: string;
      videoId?: string;
      position?: number;
      note?: string;
    } = {},
  ): Promise<YtResult> {
    return this.update(playlistItemId, options) as Promise<YtResult>;
  }

  /**
   * Delete a playlist item (OAuth required)
   * @param playlistItemId - Playlist item ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/playlistItems/delete
   */
  delete(playlistItemId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', playlistItemId);

        this.requestDelete(this.getUrl('playlistItems'), (err, data) => {
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
      this.addParam('id', playlistItemId);

      this.requestDelete(this.getUrl('playlistItems'), (err, data) => {
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
   * Delete playlist item (Promise)
   * @param playlistItemId - Playlist item ID
   * @returns Promise with result
   */
  deleteAsync(playlistItemId: string): Promise<YtResult> {
    return this.delete(playlistItemId) as Promise<YtResult>;
  }
}
