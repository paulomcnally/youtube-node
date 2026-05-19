import { YouTubeResource } from './base';
import { Callback, YtResult, VideoResource, VideoStatus } from '../../types';

/**
 * Recurso de Videos de YouTube API
 * https://developers.google.com/youtube/v3/docs/videos
 */
export class VideosResource extends YouTubeResource {
  /**
   * Video data from ID
   * @param id - Video ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
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
        this.addPart('statistics');
        this.addPart('status');

        this.addParam('part', this.getParts());
        this.addParam('id', id);

        this.request(this.getUrl('videos'), callback);

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
      this.addPart('statistics');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('videos'), (err, data) => {
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
   * Video data from ID (Promise)
   * @param id - Video ID
   * @returns Promise with result
   * @deprecated Use getById() without callback instead
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.getById(id) as Promise<YtResult>;
  }

  /**
   * Videos data from most popular list
   * @param maxResults - Maximum results
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  getMostPopular(maxResults: number, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      // Modo callback (backward compatible)
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');

        this.addParam('part', this.getParts());
        this.addParam('maxResults', maxResults);
        this.addParam('chart', 'mostPopular');

        this.request(this.getUrl('videos'), callback);

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

      this.addParam('part', this.getParts());
      this.addParam('maxResults', maxResults);
      this.addParam('chart', 'mostPopular');

      this.request(this.getUrl('videos'), (err, data) => {
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
   * Most popular videos (Promise)
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use getMostPopular() without callback instead
   */
  getMostPopularAsync(maxResults: number): Promise<YtResult> {
    return this.getMostPopular(maxResults) as Promise<YtResult>;
  }

  /**
   * Videos data from most popular list by videoCategoryId
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  getMostPopularByCategory(
    maxResults: number,
    videoCategoryId: string | number,
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      // Modo callback (backward compatible)
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');

        this.addParam('part', this.getParts());
        this.addParam('maxResults', maxResults);
        this.addParam('chart', 'mostPopular');
        this.addParam('videoCategoryId', videoCategoryId);

        this.request(this.getUrl('videos'), callback);

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

      this.addParam('part', this.getParts());
      this.addParam('maxResults', maxResults);
      this.addParam('chart', 'mostPopular');
      this.addParam('videoCategoryId', videoCategoryId);

      this.request(this.getUrl('videos'), (err, data) => {
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
   * Most popular videos by category (Promise)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @returns Promise with result
   * @deprecated Use getMostPopularByCategory() without callback instead
   */
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult> {
    return this.getMostPopularByCategory(maxResults, videoCategoryId) as Promise<YtResult>;
  }

  /**
   * Update video metadata (requires OAuth)
   * @param videoResource - Video resource with updated data
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/videos/update
   */
  update(videoResource: VideoResource, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('status');
        this.addPart('contentDetails');
        this.addPart('recordingDetails');
        this.addPart('localizations');

        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('videos'), videoResource, callback);

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
      this.addPart('status');
      this.addPart('contentDetails');
      this.addPart('recordingDetails');
      this.addPart('localizations');

      this.addParam('part', this.getParts());

      this.requestPut(this.getUrl('videos'), videoResource, (err, data) => {
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
   * Update video metadata (Promise)
   * @param videoResource - Video resource with updated data
   * @returns Promise with result
   */
  updateAsync(videoResource: VideoResource): Promise<YtResult> {
    return this.update(videoResource) as Promise<YtResult>;
  }

  /**
   * Update video status/privacy (helper method)
   * @param videoId - Video ID
   * @param status - Status object or privacy status string
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  updateStatus(
    videoId: string,
    status: VideoStatus | 'public' | 'private' | 'unlisted',
    callback?: Callback,
  ): Promise<YtResult> | void {
    const statusObj: VideoStatus = typeof status === 'string'
      ? { privacyStatus: status }
      : status;

    const videoResource: VideoResource = {
      id: videoId,
      status: statusObj,
    };

    return this.update(videoResource, callback);
  }

  /**
   * Update video status/privacy (Promise)
   * @param videoId - Video ID
   * @param status - Status object or privacy status string
   * @returns Promise with result
   */
  updateStatusAsync(videoId: string, status: VideoStatus | 'public' | 'private' | 'unlisted'): Promise<YtResult> {
    return this.updateStatus(videoId, status) as Promise<YtResult>;
  }
}
