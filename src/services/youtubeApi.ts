import axios, { AxiosError, AxiosInstance } from 'axios';
import { SearchResponse, VideoDetailResponse, VideoItem } from '../types';

const API_KEY = 'AIzaSyAHWqMYjoeWtPO6TDnjHagPJ2nbe_x7KiI';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// API request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

// Create axios instance with common configuration
const youtubeApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  params: { key: API_KEY },
});

// Error handler for API requests
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new Error(
        `YouTube API Error: ${axiosError.response.status} - ${JSON.stringify(
          axiosError.response.data
        )}`
      );
    } else if (axiosError.request) {
      throw new Error('Network error: No response received from YouTube API');
    }
    throw new Error(`Request setup error: ${axiosError.message}`);
  }
  throw new Error(`Unexpected error: ${String(error)}`);
};

// Convert ISO 8601 duration to seconds
const parseDurationToSeconds = (duration: string): number => {
  const match: RegExpMatchArray | null = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );
  if (!match) return 0;

  const hours: number = parseInt(match[1] || '0', 10);
  const minutes: number = parseInt(match[2] || '0', 10);
  const seconds: number = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

// Format duration for display
export const formatDuration = (duration: string): string => {
  const totalSeconds: number = parseDurationToSeconds(duration);
  const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = Math.floor((totalSeconds % 3600) / 60);
  const seconds: number = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count for display
export const formatViewCount = (viewCount: string): string => {
  const count: number = parseInt(viewCount, 10);
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M views`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

// Search videos
export const searchVideos = async (
  query: string
): Promise<VideoItem[] | undefined> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const searchResponse = await youtubeApi.get<SearchResponse>('/search', {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: query,
        type: 'video',
        order: 'viewCount',
      },
    });

    const items = searchResponse.data.items || [];
    if (items.length === 0) {
      return [];
    }

    const videoIds: string[] = items
      .filter(item => item.id?.videoId)
      .map(item => item.id.videoId as string);

    if (videoIds.length === 0) {
      return [];
    }

    const detailsResponse = await youtubeApi.get<VideoDetailResponse>(
      '/videos',
      {
        params: {
          part: 'contentDetails,statistics,snippet',
          id: videoIds.join(','),
        },
      }
    );

    const detailItems = detailsResponse.data.items || [];
    if (detailItems.length === 0) {
      return [];
    }

    return detailItems.map(item => {
      const durationString: string = item.contentDetails.duration || 'PT0S';
      const viewCountString: string = item.statistics.viewCount || '0';
      const durationInSeconds: number = parseDurationToSeconds(
        durationString
      );

      return {
        id: item.id,
        title: item.snippet.title || 'Untitled Video',
        channelTitle: item.snippet.channelTitle || 'Unknown Channel',
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url ||
          '',
        duration: formatDuration(durationString),
        viewCount: formatViewCount(viewCountString),
        startTime: 0,
        endTime: durationInSeconds,
      };
    });
  } catch (error: unknown) {
    handleApiError(error);
  }
};

// Params and result types for trending
export interface TrendingParams {
  pageParam?: string;
}

export interface TrendingResult {
  videos: VideoItem[];
  nextPageToken?: string;
}

// Get trending videos with pagination
export const getTrendingVideos = async (
  params: TrendingParams
): Promise<TrendingResult> => {
  try {
    const response = await youtubeApi.get<VideoDetailResponse>(
      '/videos',
      {
        params: {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          maxResults: 20,
          pageToken: params.pageParam,
          regionCode: 'US',
        },
      }
    );

    const items = response.data.items || [];
    const videos: VideoItem[] = items.map(item => {
      const durationString: string = item.contentDetails.duration || 'PT0S';
      const viewCountString: string = item.statistics.viewCount || '0';
      const durationInSeconds: number = parseDurationToSeconds(
        durationString
      );
      const thumbnailUrl: string =
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        '';

      return {
        id: item.id,
        title: item.snippet.title || 'Untitled Video',
        channelTitle: item.snippet.channelTitle || 'Unknown Channel',
        thumbnail: thumbnailUrl,
        duration: formatDuration(durationString),
        viewCount: formatViewCount(viewCountString),
        startTime: 0,
        endTime: durationInSeconds,
      };
    });

    return {
      videos,
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error: unknown) {
    console.error('Error fetching trending videos:', error);
    return { videos: [] };
  }
};
