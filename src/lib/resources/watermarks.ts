import { YouTubeResource } from './base';
import { Callback, YtResult, WatermarkResource, WatermarkTiming } from '../../types';
import * as fs from 'fs';

/**
 * Recurso de Watermarks de YouTube API
 * https://developers.google.com/youtube/v3/docs/watermarks
 */
export class WatermarksResource extends YouTubeResource {
  /**
   * Set watermark for channel (requires OAuth)
   * @param channelId - Channel ID
   * @param imageData - Image data (Buffer, Stream path, or base64 string)
   * @param timing - Watermark timing configuration
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  set(
    channelId: string,
    imageData: Buffer | string,
    timing: WatermarkTiming,
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    // Convertir imageData a base64 si es una ruta de archivo
    let imageBase64: string;
    if (typeof imageData === 'string') {
      try {
        imageBase64 = fs.readFileSync(imageData).toString('base64');
      } catch (err) {
        const error = new Error(`Failed to read image file: ${(err as Error).message}`);
        if (callback) {
          callback(error);
          return undefined;
        }
        return Promise.reject(error);
      }
    } else {
      imageBase64 = imageData.toString('base64');
    }

    const resource: WatermarkResource & { imageData?: string } = {
      timing,
      imageData: imageBase64,
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addParam('channelId', channelId);

        this.requestPost(this.getUrl('watermarks/set'), resource, callback);

        this.clearParams();
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addParam('channelId', channelId);

      this.requestPost(this.getUrl('watermarks/set'), resource, (err, data) => {
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
   * Set watermark for channel (Promise)
   * @param channelId - Channel ID
   * @param imageData - Image data (Buffer, Stream path, or base64 string)
   * @param timing - Watermark timing configuration
   * @returns Promise with result
   */
  setAsync(
    channelId: string,
    imageData: Buffer | string,
    timing: WatermarkTiming,
  ): Promise<YtResult> {
    return this.set(channelId, imageData, timing) as Promise<YtResult>;
  }

  /**
   * Unset/remove watermark from channel (requires OAuth)
   * @param channelId - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  unset(channelId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addParam('channelId', channelId);

        this.requestPost(this.getUrl('watermarks/unset'), {}, callback);

        this.clearParams();
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addParam('channelId', channelId);

      this.requestPost(this.getUrl('watermarks/unset'), {}, (err, data) => {
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
   * Unset/remove watermark from channel (Promise)
   * @param channelId - Channel ID
   * @returns Promise with result
   */
  unsetAsync(channelId: string): Promise<YtResult> {
    return this.unset(channelId) as Promise<YtResult>;
  }
}
