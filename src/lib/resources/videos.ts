import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import {
  Callback, YtResult, VideoResource, VideoStatus, VideoUploadResource, VideoUploadOptions,
} from '../../types';
import { YouTubeResource } from './base';

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

  /**
   * Delete a video (OAuth required)
   * @param videoId - Video ID to delete
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/videos/delete
   */
  delete(videoId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', videoId);

        this.requestDelete(this.getUrl('videos'), (err, data) => {
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
      this.addParam('id', videoId);

      this.requestDelete(this.getUrl('videos'), (err, data) => {
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
   * Delete a video (Promise)
   * @param videoId - Video ID to delete
   * @returns Promise with result
   */
  deleteAsync(videoId: string): Promise<YtResult> {
    return this.delete(videoId) as Promise<YtResult>;
  }

  /**
   * Delete multiple videos (helper method)
   * @param videoIds - Array of video IDs to delete
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  deleteMany(videoIds: string[], callback?: Callback): Promise<YtResult[]> | void {
    if (callback) {
      const results: YtResult[] = [];
      const errors: Error[] = [];

      const deleteNext = (index: number): void => {
        if (index >= videoIds.length) {
          if (errors.length > 0) {
            callback(errors[0], { items: results } as YtResult);
          } else {
            callback(null, { items: results } as YtResult);
          }
          return;
        }

        this.delete(videoIds[index], (err, result) => {
          if (err) {
            errors.push(err);
          } else if (result) {
            results.push(result);
          }
          deleteNext(index + 1);
        });
      };

      deleteNext(0);
      return undefined;
    }

    return Promise.all(videoIds.map((id) => this.delete(id) as Promise<YtResult>));
  }

  /**
   * Delete multiple videos (Promise)
   * @param videoIds - Array of video IDs to delete
   * @returns Promise with results
   */
  deleteManyAsync(videoIds: string[]): Promise<YtResult[]> {
    return this.deleteMany(videoIds) as Promise<YtResult[]>;
  }

  /**
   * Upload a video (OAuth required)
   * @param videoResource - Video metadata
   * @param mediaBody - Path to video file, Buffer, or Stream
   * @param options - Upload options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/videos/insert
   */
  upload(
    videoResource: VideoUploadResource,
    mediaBody: string | Buffer | NodeJS.ReadableStream,
    options: VideoUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.uploadVideoWithFile(videoResource, mediaBody, options, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.uploadVideoWithFile(videoResource, mediaBody, options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Upload a video (Promise)
   * @param videoResource - Video metadata
   * @param mediaBody - Path to video file, Buffer, or Stream
   * @param options - Upload options
   * @returns Promise with result
   */
  uploadAsync(
    videoResource: VideoUploadResource,
    mediaBody: string | Buffer | NodeJS.ReadableStream,
    options: VideoUploadOptions = {},
  ): Promise<YtResult> {
    return this.upload(videoResource, mediaBody, options) as Promise<YtResult>;
  }

  /**
   * Helper method to upload video with file data
   */
  private uploadVideoWithFile(
    videoResource: VideoUploadResource,
    mediaBody: string | Buffer | NodeJS.ReadableStream,
    options: VideoUploadOptions,
    callback: Callback,
  ): void {
    this.clearParams();
    this.clearParts();

    // Set parts to include
    const parts = options.part || ['snippet', 'status'];
    parts.forEach((part) => this.addPart(part));
    this.addParam('part', this.getParts());

    if (options.notifySubscribers !== undefined) {
      this.addParam('notifySubscribers', options.notifySubscribers);
    }

    const url = this.getUrl('videos');

    // Build multipart request
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataStr = JSON.stringify(videoResource);
    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadataStr}`;

    let mediaPart: string;
    let content: Buffer | NodeJS.ReadableStream;

    if (typeof mediaBody === 'string') {
      // It's a file path
      try {
        content = fs.readFileSync(mediaBody);
        const ext = path.extname(mediaBody).toLowerCase();
        const contentType = this.getVideoContentType(ext);
        mediaPart = `${delimiter}Content-Type: ${contentType}\r\n\r\n`;
      } catch (err) {
        callback(err as Error);
        return;
      }
    } else if (Buffer.isBuffer(mediaBody)) {
      content = mediaBody;
      mediaPart = `${delimiter}Content-Type: video/*\r\n\r\n`;
    } else {
      // It's a stream
      content = mediaBody;
      mediaPart = `${delimiter}Content-Type: video/*\r\n\r\n`;
    }

    // Handle stream vs buffer
    if (Buffer.isBuffer(content)) {
      const multipartBody = Buffer.concat([
        Buffer.from(metadataPart, 'utf-8'),
        Buffer.from(mediaPart, 'utf-8'),
        content,
        Buffer.from(closeDelimiter, 'utf-8'),
      ]);

      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      };

      axios.post<YtResult>(url, multipartBody, config)
        .then((response) => {
          this.clearParams();
          this.clearParts();
          callback(null, response.data);
        })
        .catch((error) => {
          this.clearParams();
          this.clearParts();
          callback(error);
        });
    } else {
      // Stream handling - would need more complex implementation
      callback(new Error('Stream upload not yet fully implemented'));
    }
  }

  /**
   * Get content type based on file extension
   */
  private getVideoContentType(ext: string): string {
    const types: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
      '.m4v': 'video/mp4',
      '.3gp': 'video/3gpp',
    };
    return types[ext] || 'video/*';
  }

  /**
   * Check video upload processing status
   * @param videoId - Video ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  checkUploadStatus(videoId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('status');
        this.addPart('processingDetails');

        this.addParam('part', this.getParts());
        this.addParam('id', videoId);

        this.request(this.getUrl('videos'), (err, data) => {
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

      this.addPart('status');
      this.addPart('processingDetails');

      this.addParam('part', this.getParts());
      this.addParam('id', videoId);

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
   * Check video upload processing status (Promise)
   * @param videoId - Video ID
   * @returns Promise with result
   */
  checkUploadStatusAsync(videoId: string): Promise<YtResult> {
    return this.checkUploadStatus(videoId) as Promise<YtResult>;
  }
}
