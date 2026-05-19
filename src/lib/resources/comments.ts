import { YouTubeResource } from './base';
import {
  Callback, YtResult,
} from '../../types';

/**
 * Recurso de Comments/CommentThreads de YouTube API
 * https://developers.google.com/youtube/v3/docs/comments
 * https://developers.google.com/youtube/v3/docs/commentThreads
 */
export class CommentsResource extends YouTubeResource {
  /**
   * List comments for a video or channel
   * @param videoId - Video ID (optional if channelId provided)
   * @param channelId - Channel ID (optional if videoId provided)
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  list(videoId?: string, channelId?: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addPart('replies');
        this.addParam('part', this.getParts());

        if (videoId) {
          this.addParam('videoId', videoId);
        } else if (channelId) {
          this.addParam('channelId', channelId);
        } else {
          callback(new Error('Either videoId or channelId is required'));
          return undefined;
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
      this.addPart('snippet');
      this.addPart('replies');
      this.addParam('part', this.getParts());

      if (videoId) {
        this.addParam('videoId', videoId);
      } else if (channelId) {
        this.addParam('channelId', channelId);
      } else {
        reject(new Error('Either videoId or channelId is required'));
        return;
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
   * List comments (Promise)
   * @param videoId - Video ID
   * @param channelId - Channel ID
   * @returns Promise with result
   */
  listAsync(videoId?: string, channelId?: string): Promise<YtResult> {
    return this.list(videoId, channelId) as Promise<YtResult>;
  }

  /**
   * Add a top-level comment to a video (OAuth required)
   * @param videoId - Video ID
   * @param text - Comment text
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  add(
    videoId: string,
    text: string,
    options: {
      channelId?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const commentThreadResource = {
      snippet: {
        videoId,
        channelId: options.channelId,
        topLevelComment: {
          snippet: {
            textOriginal: text,
          },
        },
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('commentThreads'), commentThreadResource, (err, data) => {
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
      this.addPart('snippet');
      this.addParam('part', this.getParts());

      this.requestPost(this.getUrl('commentThreads'), commentThreadResource, (err, data) => {
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
   * Add comment (Promise)
   * @param videoId - Video ID
   * @param text - Comment text
   * @param options - Optional parameters
   * @returns Promise with result
   */
  addAsync(
    videoId: string,
    text: string,
    options: {
      channelId?: string;
    } = {},
  ): Promise<YtResult> {
    return this.add(videoId, text, options) as Promise<YtResult>;
  }

  /**
   * Reply to an existing comment (OAuth required)
   * @param parentCommentId - Parent comment ID
   * @param text - Reply text
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  reply(parentCommentId: string, text: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    const commentResource = {
      snippet: {
        parentId: parentCommentId,
        textOriginal: text,
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('comments'), commentResource, (err, data) => {
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
      this.addPart('snippet');
      this.addParam('part', this.getParts());

      this.requestPost(this.getUrl('comments'), commentResource, (err, data) => {
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
   * Reply to comment (Promise)
   * @param parentCommentId - Parent comment ID
   * @param text - Reply text
   * @returns Promise with result
   */
  replyAsync(parentCommentId: string, text: string): Promise<YtResult> {
    return this.reply(parentCommentId, text) as Promise<YtResult>;
  }

  /**
   * Update a comment (OAuth required)
   * @param commentId - Comment ID
   * @param text - New comment text
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  update(commentId: string, text: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    const commentResource = {
      id: commentId,
      snippet: {
        textOriginal: text,
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('comments'), commentResource, (err, data) => {
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
      this.addPart('snippet');
      this.addParam('part', this.getParts());

      this.requestPut(this.getUrl('comments'), commentResource, (err, data) => {
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
   * Update comment (Promise)
   * @param commentId - Comment ID
   * @param text - New comment text
   * @returns Promise with result
   */
  updateAsync(commentId: string, text: string): Promise<YtResult> {
    return this.update(commentId, text) as Promise<YtResult>;
  }

  /**
   * Delete a comment (OAuth required)
   * @param commentId - Comment ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  delete(commentId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', commentId);

        this.requestDelete(this.getUrl('comments'), (err, data) => {
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
      this.addParam('id', commentId);

      this.requestDelete(this.getUrl('comments'), (err, data) => {
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
   * Delete comment (Promise)
   * @param commentId - Comment ID
   * @returns Promise with result
   */
  deleteAsync(commentId: string): Promise<YtResult> {
    return this.delete(commentId) as Promise<YtResult>;
  }

  /**
   * Set moderation status for comments (OAuth required, channel owner only)
   * @param commentIds - Comment ID(s)
   * @param status - Moderation status
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  setModerationStatus(
    commentIds: string | string[],
    status: 'published' | 'heldForReview' | 'rejected',
    options: {
      banAuthor?: boolean;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const ids = Array.isArray(commentIds) ? commentIds : [commentIds];

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', ids.join(','));
        this.addParam('moderationStatus', status);

        if (options.banAuthor !== undefined) {
          this.addParam('banAuthor', options.banAuthor);
        }

        this.requestPost(this.getUrl('comments/setModerationStatus'), {}, (err, data) => {
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
      this.addParam('id', ids.join(','));
      this.addParam('moderationStatus', status);

      if (options.banAuthor !== undefined) {
        this.addParam('banAuthor', options.banAuthor);
      }

      this.requestPost(this.getUrl('comments/setModerationStatus'), {}, (err, data) => {
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
   * Set moderation status (Promise)
   * @param commentIds - Comment ID(s)
   * @param status - Moderation status
   * @param options - Optional parameters
   * @returns Promise with result
   */
  setModerationStatusAsync(
    commentIds: string | string[],
    status: 'published' | 'heldForReview' | 'rejected',
    options: {
      banAuthor?: boolean;
    } = {},
  ): Promise<YtResult> {
    return this.setModerationStatus(commentIds, status, options) as Promise<YtResult>;
  }

  /**
   * Mark a comment as spam (OAuth required, channel owner only)
   * @param commentId - Comment ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  markAsSpam(commentId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', commentId);

        this.requestPost(this.getUrl('comments/markAsSpam'), {}, (err, data) => {
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
      this.addParam('id', commentId);

      this.requestPost(this.getUrl('comments/markAsSpam'), {}, (err, data) => {
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
   * Mark as spam (Promise)
   * @param commentId - Comment ID
   * @returns Promise with result
   */
  markAsSpamAsync(commentId: string): Promise<YtResult> {
    return this.markAsSpam(commentId) as Promise<YtResult>;
  }

  /**
   * Get comments (individual comments or replies)
   * @param options - Comment options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/comments/list
   */
  getComments(
    options: {
      id?: string | string[];
      parentId?: string;
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
        this.addPart('id');

        this.addParam('part', this.getParts());

        if (options.id) {
          const ids = Array.isArray(options.id) ? options.id : [options.id];
          this.addParam('id', ids.join(','));
        }
        if (options.parentId) {
          this.addParam('parentId', options.parentId);
        }
        if (options.maxResults) {
          this.addParam('maxResults', options.maxResults);
        }
        if (options.pageToken) {
          this.addParam('pageToken', options.pageToken);
        }

        this.request(this.getUrl('comments'), (err, data) => {
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
      this.addPart('id');

      this.addParam('part', this.getParts());

      if (options.id) {
        const ids = Array.isArray(options.id) ? options.id : [options.id];
        this.addParam('id', ids.join(','));
      }
      if (options.parentId) {
        this.addParam('parentId', options.parentId);
      }
      if (options.maxResults) {
        this.addParam('maxResults', options.maxResults);
      }
      if (options.pageToken) {
        this.addParam('pageToken', options.pageToken);
      }

      this.request(this.getUrl('comments'), (err, data) => {
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
   * Get comments (Promise)
   * @param options - Comment options
   * @returns Promise with result
   */
  getCommentsAsync(options: {
    id?: string | string[];
    parentId?: string;
    maxResults?: number;
    pageToken?: string;
  } = {}): Promise<YtResult> {
    return this.getComments(options) as Promise<YtResult>;
  }
}
