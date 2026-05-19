import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de i18nRegions de YouTube API
 * https://developers.google.com/youtube/v3/docs/i18nRegions
 */
export class I18nRegionsResource extends YouTubeResource {
  /**
   * Get supported regions
   * @param options - Region options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/i18nRegions/list
   */
  list(
    options: {
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

        if (options.hl) {
          this.addParam('hl', options.hl);
        }

        this.request(this.getUrl('i18nRegions'), (err, data) => {
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

      if (options.hl) {
        this.addParam('hl', options.hl);
      }

      this.request(this.getUrl('i18nRegions'), (err, data) => {
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
   * List regions (Promise)
   * @param options - Region options
   * @returns Promise with result
   */
  listAsync(options: {
    hl?: string;
  } = {}): Promise<YtResult> {
    return this.list(options) as Promise<YtResult>;
  }
}
