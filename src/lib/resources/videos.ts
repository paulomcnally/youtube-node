import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de Videos de YouTube API
 * https://developers.google.com/youtube/v3/docs/videos
 */
export class VideosResource extends YouTubeResource {
  /**
   * Video data from ID
   * @param id - Video ID
   * @param callback - Callback function
   */
  getById(id: string, callback: Callback): void {
    const validate = this.validate();

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
  }

  /**
   * Video data from ID (Promise)
   * @param id - Video ID
   * @returns Promise with result
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.promisify(this.getById.bind(this), id);
  }

  /**
   * Videos data from most popular list
   * @param maxResults - Maximum results
   * @param callback - Callback function
   */
  getMostPopular(maxResults: number, callback: Callback): void {
    const validate = this.validate();

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
  }

  /**
   * Most popular videos (Promise)
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  getMostPopularAsync(maxResults: number): Promise<YtResult> {
    return this.promisify(this.getMostPopular.bind(this), maxResults);
  }

  /**
   * Videos data from most popular list by videoCategoryId
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @param callback - Callback function
   */
  getMostPopularByCategory(maxResults: number, videoCategoryId: string | number, callback: Callback): void {
    const validate = this.validate();

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
  }

  /**
   * Most popular videos by category (Promise)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @returns Promise with result
   */
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult> {
    return this.promisify(this.getMostPopularByCategory.bind(this), maxResults, videoCategoryId);
  }
}
