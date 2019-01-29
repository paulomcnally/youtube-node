import {YtResult} from "youtube-node";

declare module "youtube-node" {
  export class YouTube {
    public constructor();

    private parts: Array<string>;
    private url: string;
    public readonly params: Object;

    public addParam(key: string, value: string): void;
    public addPart(name: string): void;
    public clearParams(): void;
    public getById(id: string, callback: (validate?: Error, data?: YtResult) => void): void;
    public getChannelById(id: string, callback: (validate?: Error, data?: YtResult) => void): void;
    public getPlaylistById(id: string, callback: (validate?: Error, data?: YtResult) => void): void;
    public getPlaylistItemsById(id: string, maxResults: number, callback: (validate?: Error) => void, data?: YtResult): void;
    public getParts(): string;
    public getUrl(path: string): string;
    private newError(message: string): Error;
    public related(id: string, maxResults: number, callback: (validate?: Error) => void, data?: YtResult): void;
    public request(url: string, callback: (error?: Error, data?: YtResult) => void): void;
    public search(id: string, maxResults: number, params: Object, callback: (validate?: Error) => void, data?: YtResult): void;
    public setKey(key: string): void;
    public validate(): Error | null;
  }

  type YtContentDetails = {
    duration?: string;
    dimension?: string;
    definition?: string;
    caption?: string;
    licensedContent?: string;
    projection?: string;
  }

  type YtItem = {
    kind?: string;
    etag?: string;
    id?: YtVideoId;
    snippet?: YtSnippet;
    contentDetails?: YtContentDetails;
    status?: YtStatus;
    statistics?: YtStatistics;
  }

  type YtLocalized = {
    title?: string;
    description?: string;
  }

  type YtPageInfo = {
    totalResults?: number;
    resultsPerPage?: number;
  }

  type YtResult = {
    kind?: string;
    etag?: string;
    nextPageToken?: string;
    regionCode?: string;
    pageInfo?: YtPageInfo;
    items?: Array<YtItem>;
  }

  type YtSnippet = {
    publishedAt?: string;
    channelId?: string;
    title?: string;
    description?: string;
    thumbnails?: YtThumbnails;
    channelTitle?: string;
    tags?: Array<string>;
    categoryId?: string;
    liveBroadcastContent?: string;
    localized?: YtLocalized;
  }

  type YtStatistics = {
    viewCount?: string;
    likeCount?: string;
    dislikeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
  }

  type YtStatus = {
    uploadStatus?: string;
    privacyStatus?: string;
    license?: string;
    embeddable?: boolean;
    publicStatsViewable?: boolean;
  }

  type YtThumbnail = {
    url?: string;
    width?: number;
    height?: number;
  }

  type YtThumbnails = {
    default?: YtThumbnail;
    medium?: YtThumbnail;
    high?: YtThumbnail;
    standard?: YtThumbnail;
  }

  type YtVideoId = {
    kind?: string;
    videoId?: string;
  }  
}