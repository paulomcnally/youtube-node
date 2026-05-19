import { YouTubeResource } from './base';
import { Callback, YtResult } from '../../types';

/**
 * Recurso de Channels de YouTube API
 * https://developers.google.com/youtube/v3/docs/channels
 */
export class ChannelsResource extends YouTubeResource {
  /**
   * Get channel data based on ID
   * @param id - Channel ID
   * @param callback - Callback function
   */
  getById(id: string, callback: Callback): void {
    const validate = this.validate();

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
  }

  /**
   * Get channel data based on ID (Promise)
   * @param id - Channel ID
   * @returns Promise with result
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.promisify(this.getById.bind(this), id);
  }
}
