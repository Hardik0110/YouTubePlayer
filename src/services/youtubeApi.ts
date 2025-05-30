import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SearchResponse,
  VideoDetailResponse,
  VideoItem,
  YouTubeThumbnail,
} from '../types/index';

// Constants
const API_KEY = 'AIzaSyAHWqMYjoeWtPO6TDnjHagPJ2nbe_x7KiI';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const REQUEST_TIMEOUT = 10_000;
const MAX_RESULTS = 10;
const REGION_CODE = 'IN';

// API client configuration
const youtubeApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  params: { key: API_KEY },
});

// Error handling
class YouTubeApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new YouTubeApiError(
        'YouTube API Error',
        axiosError.response.status,
        axiosError.response.data
      );
    }
    if (axiosError.request) {
      throw new YouTubeApiError('Network error: no response from YouTube API');
    }
    throw new YouTubeApiError(`Request setup error: ${axiosError.message}`);
  }
  throw new YouTubeApiError(`Unexpected error: ${String(error)}`);
}

// Duration parsing
function parseIsoDuration(src: string): number {
  const match = src.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const [_, hours = '0', minutes = '0', seconds = '0'] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

export function formatDuration(iso: string): string {
  const total = parseIsoDuration(iso);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(hours > 0 ? 2 : 1, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

// View count formatting
export function formatViewCount(countStr: string): string {
  const count = parseInt(countStr, 10);
  if (isNaN(count)) return '0 views';
  
  if (count >= 1e9) return `${(count / 1e9).toFixed(1)}B views`;
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M views`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K views`;
  return `${count} views`;
}

// Thumbnail selection
function getBestThumbnail(thumbnails: {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}): { default: string; high: string } {
  const defaultThumb = thumbnails.medium?.url || thumbnails.default?.url || '';
  const highThumb = thumbnails.maxres?.url || thumbnails.high?.url || defaultThumb;
  
  return {
    default: defaultThumb,
    high: highThumb,
  };
}

// Video search
export async function searchVideos(query: string): Promise<VideoItem[]> {
  if (!query.trim()) return [];

  try {
    // Search for videos
    const { data: searchResponse } = await youtubeApi.get<SearchResponse>('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        order: 'viewCount',
        maxResults: MAX_RESULTS,
      },
    });

    // Extract video IDs
    const videoIds = searchResponse.items
      .map(item => item.id.videoId)
      .filter((id): id is string => Boolean(id));

    if (videoIds.length === 0) return [];

    // Get video details
    const { data: detailResponse } = await youtubeApi.get<VideoDetailResponse>('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
      },
    });

    // Map response to VideoItem
    return detailResponse.items.map(item => {
      const duration = parseIsoDuration(item.contentDetails.duration);
      const thumbnails = getBestThumbnail(item.snippet.thumbnails);

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: thumbnails.default,
        thumbnailHigh: thumbnails.high,
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: duration,
      };
    });
  } catch (error) {
    handleApiError(error);
  }
}

// Trending videos
export interface TrendingParams {
  pageParam?: string;
}

export interface TrendingResult {
  videos: VideoItem[];
  nextPageToken?: string;
}

export async function getTrendingVideos(
  { pageParam }: TrendingParams = {}
): Promise<TrendingResult> {
  try {
    const { data } = await youtubeApi.get<VideoDetailResponse>('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: REGION_CODE,
        maxResults: MAX_RESULTS * 2,
        pageToken: pageParam,
      },
    });

    const videos = data.items.map(item => {
      const duration = parseIsoDuration(item.contentDetails.duration);
      const thumbnails = getBestThumbnail(item.snippet.thumbnails);

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: thumbnails.default,
        thumbnailHigh: thumbnails.high,
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: duration,
      };
    });

    return {
      videos,
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('Trending fetch error:', error);
    return { videos: [] };
  }
}
