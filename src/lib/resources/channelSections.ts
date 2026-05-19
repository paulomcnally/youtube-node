import { YouTubeResource } from './base';
import { Callback, YtResult, ChannelSectionResource } from '../../types';

/**
 * Recurso de ChannelSections de YouTube API
 * https://developers.google.com/youtube/v3/docs/channelSections
 */
export class ChannelSectionsResource extends YouTubeResource {
  /**
   * List channel sections
   * @param channelId - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  list(channelId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());
        this.addParam('channelId', channelId);

        this.request(this.getUrl('channelSections'), callback);

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
      this.addParam('channelId', channelId);

      this.request(this.getUrl('channelSections'), (err, data) => {
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
   * List channel sections (Promise)
   * @param channelId - Channel ID
   * @returns Promise with result
   */
  listAsync(channelId: string): Promise<YtResult> {
    return this.list(channelId) as Promise<YtResult>;
  }

  /**
   * Create channel section (requires OAuth)
   * @param sectionResource - Channel section resource
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  create(sectionResource: ChannelSectionResource, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());

        this.requestPost(this.getUrl('channelSections'), sectionResource, callback);

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

      this.requestPost(this.getUrl('channelSections'), sectionResource, (err, data) => {
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
   * Create channel section (Promise)
   * @param sectionResource - Channel section resource
   * @returns Promise with result
   */
  createAsync(sectionResource: ChannelSectionResource): Promise<YtResult> {
    return this.create(sectionResource) as Promise<YtResult>;
  }

  /**
   * Update channel section (requires OAuth)
   * @param sectionId - Section ID
   * @param sectionResource - Channel section resource
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  update(
    sectionId: string,
    sectionResource: ChannelSectionResource,
    callback?: Callback,
  ): Promise<YtResult> | void {
    const resource = { ...sectionResource, id: sectionId };
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');
        this.addPart('contentDetails');

        this.addParam('part', this.getParts());

        this.requestPut(this.getUrl('channelSections'), resource, callback);

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

      this.requestPut(this.getUrl('channelSections'), resource, (err, data) => {
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
   * Update channel section (Promise)
   * @param sectionId - Section ID
   * @param sectionResource - Channel section resource
   * @returns Promise with result
   */
  updateAsync(sectionId: string, sectionResource: ChannelSectionResource): Promise<YtResult> {
    return this.update(sectionId, sectionResource) as Promise<YtResult>;
  }

  /**
   * Delete channel section (requires OAuth)
   * @param sectionId - Section ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  delete(sectionId: string, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addParam('id', sectionId);

        this.requestDelete(this.getUrl('channelSections'), callback);

        this.clearParams();
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.addParam('id', sectionId);

      this.requestDelete(this.getUrl('channelSections'), (err, data) => {
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
   * Delete channel section (Promise)
   * @param sectionId - Section ID
   * @returns Promise with result
   */
  deleteAsync(sectionId: string): Promise<YtResult> {
    return this.delete(sectionId) as Promise<YtResult>;
  }
}
