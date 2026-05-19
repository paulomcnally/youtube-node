import { YouTubeResource } from './base';
import { Callback, YtResult, SubscriptionResource } from '../../types';

/**
 * Subscriptions Resource for YouTube API
 * https://developers.google.com/youtube/v3/docs/subscriptions
 */
export class SubscriptionsResource extends YouTubeResource {
  /**
   * Subscribe to a channel (OAuth required)
   * @param channelId - Channel ID to subscribe to
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  subscribeToChannel(channelId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    const subscriptionResource: SubscriptionResource = {
      snippet: {
        resourceId: {
          kind: 'youtube#channel',
          channelId,
        },
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('subscriptions'), subscriptionResource, callback);

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

      this.addParam('part', this.getParts());

      this.requestPost(this.getUrl('subscriptions'), subscriptionResource, (err, data) => {
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
   * Subscribe to a channel (Promise)
   * @param channelId - Channel ID to subscribe to
   * @returns Promise with result
   */
  subscribeToChannelAsync(channelId: string): Promise<YtResult> {
    return this.subscribeToChannel(channelId) as Promise<YtResult>;
  }

  /**
   * Unsubscribe from a subscription (OAuth required)
   * @param subscriptionId - Subscription ID to cancel
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  unsubscribe(subscriptionId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addParam('id', subscriptionId);

        this.requestDelete(this.getUrl('subscriptions'), callback);

        this.clearParams();
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addParam('id', subscriptionId);

      this.requestDelete(this.getUrl('subscriptions'), (err, data) => {
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
   * Unsubscribe from a subscription (Promise)
   * @param subscriptionId - Subscription ID to cancel
   * @returns Promise with result
   */
  unsubscribeAsync(subscriptionId: string): Promise<YtResult> {
    return this.unsubscribe(subscriptionId) as Promise<YtResult>;
  }

  /**
   * Find subscription by channel ID and unsubscribe (OAuth required)
   * This is a helper method that first lists subscriptions to find the subscription ID
   * @param channelId - Channel ID to unsubscribe from
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  findAndUnsubscribe(channelId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        // First, list subscriptions to find the subscription ID
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());
        this.addParam('mine', true);
        this.addParam('maxResults', 50);

        this.request(this.getUrl('subscriptions'), (err, data) => {
          this.clearParams();
          this.clearParts();

          if (err) {
            callback(err);
            return;
          }

          const items = data?.items || [];
          const subscription = items.find(
            (item) => item.snippet?.resourceId?.channelId === channelId,
          );

          if (!subscription || !subscription.id) {
            callback(new Error(`Subscription not found for channel ID: ${channelId}`));
            return;
          }

          // Unsubscribe using the found subscription ID
          const subscriptionId = typeof subscription.id === 'string' ? subscription.id : subscription.id.videoId;
          if (!subscriptionId) {
            callback(new Error(`Invalid subscription ID for channel ID: ${channelId}`));
            return;
          }
          this.unsubscribe(subscriptionId, callback);
        });
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      // First, list subscriptions to find the subscription ID
      this.clearParams();
      this.addPart('snippet');
      this.addParam('part', this.getParts());
      this.addParam('mine', true);
      this.addParam('maxResults', 50);

      this.request(this.getUrl('subscriptions'), (err, data) => {
        this.clearParams();
        this.clearParts();

        if (err) {
          reject(err);
          return;
        }

        const items = data?.items || [];
        const subscription = items.find(
          (item) => item.snippet?.resourceId?.channelId === channelId,
        );

        if (!subscription || !subscription.id) {
          reject(new Error(`Subscription not found for channel ID: ${channelId}`));
          return;
        }

        // Unsubscribe using the found subscription ID
        const subscriptionId = typeof subscription.id === 'string' ? subscription.id : subscription.id.videoId;
        if (!subscriptionId) {
          reject(new Error(`Invalid subscription ID for channel ID: ${channelId}`));
          return;
        }
        const result = this.unsubscribe(subscriptionId);
        if (result && typeof (result as Promise<YtResult>).then === 'function') {
          (result as Promise<YtResult>).then(resolve).catch(reject);
        }
      });
    });
  }

  /**
   * Find and unsubscribe (Promise)
   * @param channelId - Channel ID to unsubscribe from
   * @returns Promise with result
   */
  findAndUnsubscribeAsync(channelId: string): Promise<YtResult> {
    return this.findAndUnsubscribe(channelId) as Promise<YtResult>;
  }

  /**
   * List subscriptions (OAuth required for 'mine' parameter)
   * @param options - List options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  list(
    options: {
      mine?: boolean;
      channelId?: string;
      forChannelId?: string;
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

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('subscriberSnippet');

        this.addParam('part', this.getParts());

        if (options.mine) {
          this.addParam('mine', true);
        }
        if (options.channelId) {
          this.addParam('channelId', options.channelId);
        }
        if (options.forChannelId) {
          this.addParam('forChannelId', options.forChannelId);
        }
        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }

        this.request(this.getUrl('subscriptions'), (err, data) => {
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
      this.addPart('subscriberSnippet');

      this.addParam('part', this.getParts());

      if (options.mine) {
        this.addParam('mine', true);
      }
      if (options.channelId) {
        this.addParam('channelId', options.channelId);
      }
      if (options.forChannelId) {
        this.addParam('forChannelId', options.forChannelId);
      }
      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }

      this.request(this.getUrl('subscriptions'), (err, data) => {
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
   * List subscriptions (Promise)
   * @param options - List options
   * @returns Promise with result
   */
  listAsync(options: {
    mine?: boolean;
    channelId?: string;
    forChannelId?: string;
    maxResults?: number;
    pageToken?: string;
  } = {}): Promise<YtResult> {
    return this.list(options) as Promise<YtResult>;
  }

  /**
   * Get subscriptions (alias for list with enhanced options)
   * @param options - Get options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/subscriptions/list
   */
  getSubscriptions(
    options: {
      channelId?: string;
      mine?: boolean;
      mySubscribers?: boolean;
      forChannelId?: string;
      maxResults?: number;
      pageToken?: string;
      order?: 'alphabetical' | 'relevance' | 'unread';
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
        this.addPart('subscriberSnippet');

        this.addParam('part', this.getParts());

        if (options.channelId) {
          this.addParam('channelId', options.channelId);
        }
        if (options.mine) {
          this.addParam('mine', true);
        }
        if (options.mySubscribers) {
          this.addParam('mySubscribers', true);
        }
        if (options.forChannelId) {
          this.addParam('forChannelId', options.forChannelId);
        }
        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }
        if (options.order) {
          this.addParam('order', options.order);
        }

        this.request(this.getUrl('subscriptions'), (err, data) => {
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
      this.addPart('subscriberSnippet');

      this.addParam('part', this.getParts());

      if (options.channelId) {
        this.addParam('channelId', options.channelId);
      }
      if (options.mine) {
        this.addParam('mine', true);
      }
      if (options.mySubscribers) {
        this.addParam('mySubscribers', true);
      }
      if (options.forChannelId) {
        this.addParam('forChannelId', options.forChannelId);
      }
      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }
      if (options.order) {
        this.addParam('order', options.order);
      }

      this.request(this.getUrl('subscriptions'), (err, data) => {
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
   * Get subscriptions (Promise)
   * @param options - Get options
   * @returns Promise with result
   */
  getSubscriptionsAsync(options: {
    channelId?: string;
    mine?: boolean;
    mySubscribers?: boolean;
    forChannelId?: string;
    maxResults?: number;
    pageToken?: string;
    order?: 'alphabetical' | 'relevance' | 'unread';
  } = {}): Promise<YtResult> {
    return this.getSubscriptions(options) as Promise<YtResult>;
  }
}
