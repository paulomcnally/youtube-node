import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de Activities de YouTube API
 * https://developers.google.com/youtube/v3/docs/activities
 */
export class ActivitiesResource extends YouTubeResource {
  /**
   * Get activities for a channel or the authenticated user
   * @param options - Activity options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/activities/list
   */
  list(
    options: {
      channelId?: string;
      mine?: boolean;
      home?: boolean;
      maxResults?: number;
      pageToken?: string;
      publishedAfter?: string;
      publishedBefore?: string;
      regionCode?: string;
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
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());

        if (options.channelId) {
          this.addParam('channelId', options.channelId);
        }
        if (options.mine) {
          this.addParam('mine', true);
        }
        if (options.home) {
          this.addParam('home', true);
        }
        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }
        if (options.publishedAfter) {
          this.addParam('publishedAfter', options.publishedAfter);
        }
        if (options.publishedBefore) {
          this.addParam('publishedBefore', options.publishedBefore);
        }
        if (options.regionCode) {
          this.addParam('regionCode', options.regionCode);
        }

        this.request(this.getUrl('activities'), (err, data) => {
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

      this.addParam('part', this.getParts());

      if (options.channelId) {
        this.addParam('channelId', options.channelId);
      }
      if (options.mine) {
        this.addParam('mine', true);
      }
      if (options.home) {
        this.addParam('home', true);
      }
      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }
      if (options.publishedAfter) {
        this.addParam('publishedAfter', options.publishedAfter);
      }
      if (options.publishedBefore) {
        this.addParam('publishedBefore', options.publishedBefore);
      }
      if (options.regionCode) {
        this.addParam('regionCode', options.regionCode);
      }

      this.request(this.getUrl('activities'), (err, data) => {
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
   * List activities (Promise)
   * @param options - Activity options
   * @returns Promise with result
   */
  listAsync(options: {
    channelId?: string;
    mine?: boolean;
    home?: boolean;
    maxResults?: number;
    pageToken?: string;
    publishedAfter?: string;
    publishedBefore?: string;
    regionCode?: string;
  } = {}): Promise<YtResult> {
    return this.list(options) as Promise<YtResult>;
  }
}
