import * as fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import { YouTubeResource } from './base';
import {
  Callback, YtResult,
} from '../../types';

/**
 * Recurso de Thumbnails de YouTube API
 * https://developers.google.com/youtube/v3/docs/thumbnails
 */
export class ThumbnailsResource extends YouTubeResource {
  /**
   * Set custom thumbnail for a video (OAuth required)
   * @param videoId - Video ID
   * @param imageData - Image data (Buffer or file path)
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  set(
    videoId: string,
    imageData: Buffer | string,
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.uploadThumbnail(videoId, imageData, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.uploadThumbnail(videoId, imageData, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Set thumbnail (Promise)
   * @param videoId - Video ID
   * @param imageData - Image data (Buffer or file path)
   * @returns Promise with result
   */
  setAsync(videoId: string, imageData: Buffer | string): Promise<YtResult> {
    return this.set(videoId, imageData) as Promise<YtResult>;
  }

  /**
   * Helper method to upload thumbnail
   */
  private uploadThumbnail(
    videoId: string,
    imageData: Buffer | string,
    callback: Callback,
  ): void {
    this.clearParams();
    this.clearParts();

    this.addParam('videoId', videoId);

    const url = this.getUrl('thumbnails/set');

    // Prepare image data
    let content: Buffer;
    let contentType: string;

    if (typeof imageData === 'string') {
      // It's a file path
      try {
        content = fs.readFileSync(imageData);
        contentType = this.getImageContentType(imageData);
      } catch (err) {
        callback(err as Error);
        return;
      }
    } else if (Buffer.isBuffer(imageData)) {
      content = imageData;
      contentType = 'image/jpeg'; // Default content type
    } else {
      callback(new Error('Invalid image data. Expected Buffer or file path string.'));
      return;
    }

    // Validate image size (max 2MB)
    if (content.length > 2 * 1024 * 1024) {
      callback(new Error('Image size exceeds maximum limit of 2MB'));
      return;
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': contentType,
        'Content-Length': content.length,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    };

    axios.post<YtResult>(url, content, config)
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
  }

  /**
   * Get content type based on file extension
   */
  private getImageContentType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();

    const types: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
    };

    return types[ext || ''] || 'image/jpeg';
  }
}
