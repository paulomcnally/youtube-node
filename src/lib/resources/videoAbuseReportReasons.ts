import { YouTubeResource } from './base';
import { Callback, YtResult, VideoReport } from '../../types';

/**
 * VideoAbuseReportReasons Resource for YouTube API
 * https://developers.google.com/youtube/v3/docs/videoAbuseReportReasons
 */
export class VideoAbuseReportReasonsResource extends YouTubeResource {
  /**
   * List video abuse report reasons
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  list(callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.addPart('snippet');

        this.addParam('part', this.getParts());

        this.request(this.getUrl('videoAbuseReportReasons'), callback);

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

      this.addParam('part', this.getParts());

      this.request(this.getUrl('videoAbuseReportReasons'), (err, data) => {
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
   * List video abuse report reasons (Promise)
   * @returns Promise with result
   */
  listAsync(): Promise<YtResult> {
    return this.list() as Promise<YtResult>;
  }

  /**
   * Report abusive video (requires OAuth)
   * @param videoId - Video ID to report
   * @param reasonId - Reason ID
   * @param options - Optional report details
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  report(
    videoId: string,
    reasonId: string,
    options?: {
      secondaryReasonId?: string;
      comments?: string;
      language?: string;
    },
    callback?: Callback,
  ): Promise<YtResult> | void {
    const validate = this.validate();

    const reportData: VideoReport = {
      videoId,
      reasonId,
      ...options,
    };

    if (callback) {
      if (validate !== null) {
        callback(validate);
      } else {
        this.requestPost(this.getUrl('videos/reportAbuse'), reportData, callback);
      }
      return undefined;
    }

    return new Promise((resolve, reject) => {
      if (validate !== null) {
        reject(validate);
        return;
      }

      this.requestPost(this.getUrl('videos/reportAbuse'), reportData, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data!);
        }
      });
    });
  }

  /**
   * Report abusive video (Promise)
   * @param videoId - Video ID to report
   * @param reasonId - Reason ID
   * @param options - Optional report details
   * @returns Promise with result
   */
  reportAsync(
    videoId: string,
    reasonId: string,
    options?: {
      secondaryReasonId?: string;
      comments?: string;
      language?: string;
    },
  ): Promise<YtResult> {
    return this.report(videoId, reasonId, options) as Promise<YtResult>;
  }
}
