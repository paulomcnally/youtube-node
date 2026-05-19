import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de VideoCategories de YouTube API
 * https://developers.google.com/youtube/v3/docs/videoCategories
 */
export class VideoCategoriesResource extends YouTubeResource {
  /**
   * Get video categories
   * @param options - Category options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/videoCategories/list
   */
  list(
    options: {
      regionCode?: string;
      id?: string;
      hl?: string;
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

        this.addPart('snippet');

        this.addParam('part', this.getParts());

        if (options.regionCode) {
          this.addParam('regionCode', options.regionCode);
        }
        if (options.id) {
          this.addParam('id', options.id);
        }
        if (options.hl) {
          this.addParam('hl', options.hl);
        }

        this.request(this.getUrl('videoCategories'), (err, data) => {
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

      this.addParam('part', this.getParts());

      if (options.regionCode) {
        this.addParam('regionCode', options.regionCode);
      }
      if (options.id) {
        this.addParam('id', options.id);
      }
      if (options.hl) {
        this.addParam('hl', options.hl);
      }

      this.request(this.getUrl('videoCategories'), (err, data) => {
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
   * List video categories (Promise)
   * @param options - Category options
   * @returns Promise with result
   */
  listAsync(options: {
    regionCode?: string;
    id?: string;
    hl?: string;
  } = {}): Promise<YtResult> {
    return this.list(options) as Promise<YtResult>;
  }
}
