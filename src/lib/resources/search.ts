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
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  query(
    query: string,
    maxResults: number,
    params?: SearchParams | Callback,
    callback?: Callback,
  ): Promise<YtResult> | void {
    // Determinar qué argumento es el callback
    let cb: Callback | undefined;
    let parameters: SearchParams = {};

    if (typeof params === 'function') {
      cb = params;
    } else if (callback) {
      cb = callback;
      parameters = params || {};
    } else if (params && typeof params === 'object') {
      parameters = params;
    }

    const validate = this.validate();

    if (cb) {
      // Modo callback (backward compatible)
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
      this.addParam('q', query);
      this.addParam('maxResults', maxResults);

      Object.keys(parameters).forEach((paramKey) => {
        if (parameters[paramKey] !== undefined) {
          this.addParam(paramKey, parameters[paramKey]!);
        }
      });

      this.request(this.getUrl('search'), (err, data) => {
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
   * Videos data from query (Promise)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters
   * @returns Promise with result
   * @deprecated Use query() without callback instead
   */
  queryAsync(query: string, maxResults: number, params: SearchParams = {}): Promise<YtResult> {
    return this.query(query, maxResults, params) as Promise<YtResult>;
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
    this.query(query, maxResults, params, callback!);
  }

  /**
   * Videos data from query (Promise, legacy alias)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters
   * @returns Promise with result
   * @deprecated Use query() without callback instead
   */
  searchAsync(query: string, maxResults: number, params: SearchParams = {}): Promise<YtResult> {
    return this.queryAsync(query, maxResults, params);
  }

  /**
   * Related videos
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  related(id: string, maxResults: number, callback?: Callback): Promise<YtResult> | void {
    const validate = this.validate();

    if (callback) {
      // Modo callback (backward compatible)
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
      this.addParam('relatedToVideoId', id);
      this.addParam('maxResults', maxResults);
      this.addParam('type', 'video');
      this.addParam('order', 'relevance');

      this.request(this.getUrl('search'), (err, data) => {
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
   * Related videos (Promise)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use related() without callback instead
   */
  relatedAsync(id: string, maxResults: number): Promise<YtResult> {
    return this.related(id, maxResults) as Promise<YtResult>;
  }
}
