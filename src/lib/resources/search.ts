import { YouTubeResource } from './base';
import { Callback, SearchParams, YtResult } from '../../types';

/**
 * Recurso de Search de YouTube API
 * https://developers.google.com/youtube/v3/docs/search
 */
export class SearchResource extends YouTubeResource {
  /**
   * Videos data from query
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters or callback
   * @param callback - Callback function
   */
  query(query: string, maxResults: number, params: SearchParams | Callback, callback?: Callback): void {
    let cb: Callback;
    let parameters: SearchParams;

    if (typeof params !== 'object') {
      if (typeof params === 'function') {
        cb = params;
      } else {
        cb = () => {};
      }
      parameters = {};
    } else {
      cb = callback!;
      parameters = params;
    }

    const validate = this.validate();

    if (validate !== null) {
      cb(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('q', query);
      this.addParam('maxResults', maxResults);

      Object.keys(parameters).forEach((paramKey) => {
        if (parameters[paramKey] !== undefined) {
          this.addParam(paramKey, parameters[paramKey]!);
        }
      });

      this.request(this.getUrl('search'), cb);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Videos data from query (Promise)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters
   * @returns Promise with result
   */
  queryAsync(query: string, maxResults: number, params: SearchParams = {}): Promise<YtResult> {
    return this.promisify(this.query.bind(this), query, maxResults, params);
  }

  /**
   * Videos data from query (legacy alias)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters or callback
   * @param callback - Callback function
   * @deprecated Use query() instead
   */
  search(query: string, maxResults: number, params: SearchParams | Callback, callback?: Callback): void {
    return this.query(query, maxResults, params, callback);
  }

  /**
   * Videos data from query (Promise, legacy alias)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters
   * @returns Promise with result
   * @deprecated Use queryAsync() instead
   */
  searchAsync(query: string, maxResults: number, params: SearchParams = {}): Promise<YtResult> {
    return this.queryAsync(query, maxResults, params);
  }

  /**
   * Videos data from query
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   */
  related(id: string, maxResults: number, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('relatedToVideoId', id);
      this.addParam('maxResults', maxResults);
      this.addParam('type', 'video');
      this.addParam('order', 'relevance');

      this.request(this.getUrl('search'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Related videos (Promise)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  relatedAsync(id: string, maxResults: number): Promise<YtResult> {
    return this.promisify(this.related.bind(this), id, maxResults);
  }
}
