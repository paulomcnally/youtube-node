import * as fs from 'fs';
import * as queryString from 'querystring';
import axios, { AxiosRequestConfig } from 'axios';
import {
  Callback, YtResult, ChannelResource, ChannelBannerResult,
} from '../../types';
import { YouTubeResource } from './base';

/**
 * Channels Resource for YouTube API
 * https://developers.google.com/youtube/v3/docs/channels
 */
export class ChannelsResource extends YouTubeResource {
  /**
   * Get channel data based on ID
   * @param id - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  getById(id: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      // Callback mode (backward compatible)
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('statistics');
        this.addPart('status');

        this.addParam('part', this.getParts());
        this.addParam('id', id);

        this.request(this.getUrl('channels'), callback);
      }
      return undefined;
    }

    // Promise mode
    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('statistics');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('channels'), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Get channel data based on ID (Promise)
   * @param id - Channel ID
   * @returns Promise with result
   * @deprecated Use getById() without callback instead
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.getById(id) as Promise<YtResult>;
  }

  /**
   * Update channel metadata (OAuth required)
   * @param channelResource - Channel resource with updated data
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/channels/update
   */
  update(channelResource: ChannelResource, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('status');
        this.addPart('brandingSettings');
        this.addPart('localizations');

        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('channels'), channelResource, (err, data) => {
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
      this.addPart('status');
      this.addPart('brandingSettings');
      this.addPart('localizations');

      this.addParam('part', this.getParts());

      this.requestPut(this.getUrl('channels'), channelResource, (err, data) => {
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
   * Update channel metadata (Promise)
   * @param channelResource - Channel resource with updated data
   * @returns Promise with result
   */
  updateAsync(channelResource: ChannelResource): Promise<YtResult> {
    return this.update(channelResource) as Promise<YtResult>;
  }

  /**
   * Upload channel banner image (OAuth required)
   * @param imageData - Image data (Buffer, file path, or stream)
   * @param callback - Optional callback function
   * @returns Promise<ChannelBannerResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/channelBanners/insert
   */
  uploadBanner(imageData: Buffer | string, callback?: Callback): Promise<ChannelBannerResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.uploadBannerImage(imageData, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.uploadBannerImage(imageData, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data as ChannelBannerResult);
        }
      });
    });
  }

  /**
   * Upload channel banner image (Promise)
   * @param imageData - Image data (Buffer, file path, or stream)
   * @returns Promise with result containing banner URL
   */
  uploadBannerAsync(imageData: Buffer | string): Promise<ChannelBannerResult> {
    return this.uploadBanner(imageData) as Promise<ChannelBannerResult>;
  }

  /**
   * Helper method to upload banner image
   */
  private uploadBannerImage(imageData: Buffer | string, callback: Callback): void {
    this.clearParams();

    const url = `${this.url}channelBanners/insert?${queryString.stringify(this.params)}`;

    let content: Buffer;
    let contentType: string;

    if (typeof imageData === 'string') {
      // It's a file path
      try {
        content = fs.readFileSync(imageData);
        contentType = 'image/jpeg'; // Assume JPEG, could be improved
      } catch (err) {
        callback(err as Error);
        return;
      }
    } else if (Buffer.isBuffer(imageData)) {
      content = imageData;
      contentType = 'image/jpeg';
    } else {
      callback(new Error('Invalid image data'));
      return;
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': contentType,
        'Content-Length': content.length,
      },
    };

    axios.post<ChannelBannerResult>(url, content, config)
      .then((response) => {
        this.clearParams();
        callback(null, response.data as YtResult);
      })
      .catch((error) => {
        this.clearParams();
        callback(error);
      });
  }

  /**
   * Update channel banner using banner URL (helper method)
   * @param channelId - Channel ID
   * @param bannerUrl - Banner URL from uploadBanner result
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  updateBanner(channelId: string, bannerUrl: string, callback?: Callback): Promise<YtResult> | void {
    const channelResource: ChannelResource = {
      id: channelId,
      brandingSettings: {
        image: {
          bannerExternalUrl: bannerUrl,
        },
      },
    };

    return this.update(channelResource, callback);
  }

  /**
   * Update channel banner using banner URL (Promise)
   * @param channelId - Channel ID
   * @param bannerUrl - Banner URL from uploadBanner result
   * @returns Promise with result
   */
  updateBannerAsync(channelId: string, bannerUrl: string): Promise<YtResult> {
    return this.updateBanner(channelId, bannerUrl) as Promise<YtResult>;
  }

  /**
   * Get channel by username (legacy) or handle
   * @param username - Username (e.g., 'GoogleDevelopers') or handle (e.g., '@YouTube')
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/channels/list
   */
  getByUsername(username: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    // Remove @ prefix if present (handle format)
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('statistics');
        this.addPart('status');

        this.addParam('part', this.getParts());
        this.addParam('forUsername', cleanUsername);

        this.request(this.getUrl('channels'), callback);

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

      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('statistics');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('forUsername', cleanUsername);

      this.request(this.getUrl('channels'), (err, data) => {
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
   * Get channel by username (Promise)
   * @param username - Username or handle
   * @returns Promise with result
   */
  getByUsernameAsync(username: string): Promise<YtResult> {
    return this.getByUsername(username) as Promise<YtResult>;
  }

  /**
   * Get the authenticated user's channel (OAuth required)
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * https://developers.google.com/youtube/v3/docs/channels/list
   */
  getMyChannel(callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.clearParts();

        this.addPart('snippet');
        this.addPart('contentDetails');
        this.addPart('statistics');
        this.addPart('status');
        this.addPart('brandingSettings');

        this.addParam('part', this.getParts());
        this.addParam('mine', true);

        this.request(this.getUrl('channels'), callback);

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

      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('statistics');
      this.addPart('status');
      this.addPart('brandingSettings');

      this.addParam('part', this.getParts());
      this.addParam('mine', true);

      this.request(this.getUrl('channels'), (err, data) => {
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
   * Get the authenticated user's channel (Promise)
   * @returns Promise with result
   */
  getMyChannelAsync(): Promise<YtResult> {
    return this.getMyChannel() as Promise<YtResult>;
  }
}
