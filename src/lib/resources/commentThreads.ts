import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de CommentThreads de YouTube API
 * https://developers.google.com/youtube/v3/docs/commentThreads
 */
export class CommentThreadsResource extends YouTubeResource {
  /**
   * Get comment threads for a video or channel
   * @param options - Comment thread options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/commentThreads/list
   */
  list(
    options: {
      videoId?: string;
      channelId?: string;
      maxResults?: number;
      order?: 'time' | 'relevance';
      pageToken?: string;
      searchTerms?: string;
      moderationStatus?: 'heldForReview' | 'likelySpam' | 'published';
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
        this.addPart('replies');

        this.addParam('part', this.getParts());

        if (options.videoId) {
          this.addParam('videoId', options.videoId);
        }
        if (options.channelId) {
          this.addParam('channelId', options.channelId);
        }
        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.order) {
          this.addParam('order', options.order);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }
        if (options.searchTerms) {
          this.addParam('searchTerms', options.searchTerms);
        }
        if (options.moderationStatus) {
          this.addParam('moderationStatus', options.moderationStatus);
        }

        this.request(this.getUrl('commentThreads'), (err, data) => {
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
      this.addPart('replies');

      this.addParam('part', this.getParts());

      if (options.videoId) {
        this.addParam('videoId', options.videoId);
      }
      if (options.channelId) {
        this.addParam('channelId', options.channelId);
      }
      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.order) {
        this.addParam('order', options.order);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }
      if (options.searchTerms) {
        this.addParam('searchTerms', options.searchTerms);
      }
      if (options.moderationStatus) {
        this.addParam('moderationStatus', options.moderationStatus);
      }

      this.request(this.getUrl('commentThreads'), (err, data) => {
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
   * List comment threads (Promise)
   * @param options - Comment thread options
   * @returns Promise with result
   */
  listAsync(options: {
    videoId?: string;
    channelId?: string;
    maxResults?: number;
    order?: 'time' | 'relevance';
    pageToken?: string;
    searchTerms?: string;
    moderationStatus?: 'heldForReview' | 'likelySpam' | 'published';
  } = {}): Promise<YtResult> {
    return this.list(options) as Promise<YtResult>;
  }
}
