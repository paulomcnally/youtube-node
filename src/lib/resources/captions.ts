import axios, { AxiosRequestConfig } from 'axios';
import { YouTubeResource } from './base';
import {
  Callback, YtResult, CaptionResource, CaptionUploadOptions,
} from '../../types';

/**
 * Captions Resource for YouTube API
 * https://developers.google.com/youtube/v3/docs/captions
 */
export class CaptionsResource extends YouTubeResource {
  /**
   * List captions for a video
   * @param videoId - Video ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  list(videoId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());
        this.addParam('videoId', videoId);

        this.request(this.getUrl('captions'), (err, data) => {
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
      this.addParam('videoId', videoId);

      this.request(this.getUrl('captions'), (err, data) => {
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
   * List captions for a video (Promise)
   * @param videoId - Video ID
   * @returns Promise with result
   */
  listAsync(videoId: string): Promise<YtResult> {
    return this.list(videoId) as Promise<YtResult>;
  }

  /**
   * Upload caption to a video (OAuth required)
   * @param videoId - Video ID
   * @param language - Language code (e.g., 'es', 'en')
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Upload options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  upload(
    videoId: string,
    language: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const captionResource: CaptionResource = {
      snippet: {
        videoId,
        language,
        name: options.name,
        isDraft: options.isDraft ?? false,
        isAutoSynced: options.isAutoSynced ?? false,
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.uploadCaptionWithFile(captionResource, captionFile, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.uploadCaptionWithFile(captionResource, captionFile, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Upload caption to a video (Promise)
   * @param videoId - Video ID
   * @param language - Language code
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Upload options
   * @returns Promise with result
   */
  uploadAsync(
    videoId: string,
    language: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
  ): Promise<YtResult> {
    return this.upload(videoId, language, captionFile, options) as Promise<YtResult>;
  }

  /**
   * Helper method to upload caption with file data
   */
  private uploadCaptionWithFile(
    captionResource: CaptionResource,
    captionFile: string | Buffer,
    callback: Callback,
  ): void {
    this.clearParams();
    this.addPart('snippet');
    this.addParam('part', this.getParts());

    const url = this.getUrl('captions');

    // Build multipart request
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataStr = JSON.stringify(captionResource);
    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadataStr}`;

    let content: Buffer;
    let mediaPart: string;

    if (Buffer.isBuffer(captionFile)) {
      content = captionFile;
      mediaPart = `${delimiter}Content-Type: application/octet-stream\r\n\r\n`;
    } else {
      // Assume it's a string content
      content = Buffer.from(captionFile, 'utf-8');
      mediaPart = `${delimiter}Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
    }

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
  }

  /**
   * Update caption (OAuth required)
   * @param captionId - Caption ID
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Update options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  update(
    captionId: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const captionResource: CaptionResource = {
      id: captionId,
      snippet: {
        name: options.name,
        isDraft: options.isDraft,
        isAutoSynced: options.isAutoSynced,
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.updateCaptionWithFile(captionResource, captionFile, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.updateCaptionWithFile(captionResource, captionFile, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Update caption (Promise)
   * @param captionId - Caption ID
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Update options
   * @returns Promise with result
   */
  updateAsync(
    captionId: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
  ): Promise<YtResult> {
    return this.update(captionId, captionFile, options) as Promise<YtResult>;
  }

  /**
   * Helper method to update caption with file data
   */
  private updateCaptionWithFile(
    captionResource: CaptionResource,
    captionFile: string | Buffer,
    callback: Callback,
  ): void {
    this.clearParams();
    this.addPart('snippet');
    this.addParam('part', this.getParts());

    const url = this.getUrl('captions');

    // Build multipart request
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataStr = JSON.stringify(captionResource);
    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadataStr}`;

    let content: Buffer;
    let mediaPart: string;

    if (Buffer.isBuffer(captionFile)) {
      content = captionFile;
      mediaPart = `${delimiter}Content-Type: application/octet-stream\r\n\r\n`;
    } else {
      content = Buffer.from(captionFile, 'utf-8');
      mediaPart = `${delimiter}Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
    }

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
    };

    axios.put<YtResult>(url, multipartBody, config)
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
   * Delete caption (OAuth required)
   * @param captionId - Caption ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  delete(captionId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', captionId);

        this.requestDelete(this.getUrl('captions'), (err, data) => {
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
      this.addParam('id', captionId);

      this.requestDelete(this.getUrl('captions'), (err, data) => {
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
   * Delete caption (Promise)
   * @param captionId - Caption ID
   * @returns Promise with result
   */
  deleteAsync(captionId: string): Promise<YtResult> {
    return this.delete(captionId) as Promise<YtResult>;
  }

  /**
   * Set caption draft status (OAuth required)
   * @param captionId - Caption ID
   * @param isDraft - Draft status
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  setDraftStatus(captionId: string, isDraft: boolean, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    const captionResource: CaptionResource = {
      id: captionId,
      snippet: {
        isDraft,
      },
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addPart('snippet');
        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('captions'), captionResource, (err, data) => {
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

      this.requestPut(this.getUrl('captions'), captionResource, (err, data) => {
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
   * Set caption draft status (Promise)
   * @param captionId - Caption ID
   * @param isDraft - Draft status
   * @returns Promise with result
   */
  setDraftStatusAsync(captionId: string, isDraft: boolean): Promise<YtResult> {
    return this.setDraftStatus(captionId, isDraft) as Promise<YtResult>;
  }

  /**
   * Download caption content
   * @param captionId - Caption ID
   * @param format - Format (srt, sbv, scc, ttml, vtt) or null for default
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<string> if no callback, void otherwise
   */
  download(
    captionId: string,
    format: 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt' | null = null,
    options: {
      tlang?: string;
    } | Callback = {},
    cb?: Callback,
  ): Promise<string> | void {
    const validate = this.validate();

    // Handle case where options is actually the callback
    let downloadOptions: { tlang?: string } = {};
    let callback: Callback | undefined = cb;

    if (typeof options === 'function') {
      callback = options;
      downloadOptions = {};
    } else {
      downloadOptions = options;
    }

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.clearParams();
        this.addParam('id', captionId);

        if (format) {
          this.addParam('tfmt', format);
        }

        if (downloadOptions.tlang) {
          this.addParam('tlang', downloadOptions.tlang);
        }

        const url = `${this.getUrl('captions')}&alt=media`;

        axios.get<string>(url, { responseType: 'text' })
          .then((response) => {
            this.clearParams();
            callback(null, { items: [{ snippet: { description: response.data } }] } as unknown as YtResult);
          })
          .catch((error) => {
            this.clearParams();
            callback(error);
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
      this.addParam('id', captionId);

      if (format) {
        this.addParam('tfmt', format);
      }

      if (downloadOptions.tlang) {
        this.addParam('tlang', downloadOptions.tlang);
      }

      const url = `${this.getUrl('captions')}&alt=media`;

      axios.get<string>(url, { responseType: 'text' })
        .then((response) => {
          this.clearParams();
          resolve(response.data);
        })
        .catch((error) => {
          this.clearParams();
          reject(error);
        });
    });
  }

  /**
   * Download caption content (Promise)
   * @param captionId - Caption ID
   * @param format - Format (srt, sbv, scc, ttml, vtt) or null for default
   * @param options - Optional parameters
   * @returns Promise with caption content
   */
  downloadAsync(
    captionId: string,
    format: 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt' | null = null,
    options: {
      tlang?: string;
    } = {},
  ): Promise<string> {
    return this.download(captionId, format, options, undefined) as Promise<string>;
  }
}
