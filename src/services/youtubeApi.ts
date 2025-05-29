import axios, { AxiosInstance } from 'axios';
import {
  SearchResponse,
  VideoDetailResponse,
  VideoItem,
} from '../types/index';

const API_KEY = 'AIzaSyAHWqMYjoeWtPO6TDnjHagPJ2nbe_x7KiI'
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const REQUEST_TIMEOUT = 10_000;

const youtubeApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  params: { key: API_KEY },
});

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(
        `YouTube API Error ${error.response.status}: ${JSON.stringify(
          error.response.data
        )}`
      );
    }
    if (error.request) {
      throw new Error('Network error: no response from YouTube API');
    }
    throw new Error(`Request setup error: ${error.message}`);
  }
  throw new Error(`Unexpected error: ${String(error)}`);
}

function parseIsoDuration(src: string): number {
  const m = src.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const [h = '0', min = '0', s = '0'] = m?.slice(1) ?? [];
  return +h * 3600 + +min * 60 + +s;
}

export function formatDuration(iso: string): string {
  const total = parseIsoDuration(iso);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(h > 0 ? 2 : 1, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export function formatViewCount(countStr: string): string {
  const n = parseInt(countStr, 10);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K views`;
  return `${n} views`;
}

export async function searchVideos(query: string): Promise<VideoItem[]> {
  if (!query.trim()) return [];
  try {
    const { data: sr } = await youtubeApi.get<SearchResponse>('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        order: 'viewCount',
        maxResults: 10,
      },
    });

    const ids = sr.items
      .map((i) => i.id.videoId)
      .filter((v): v is string => Boolean(v));
    if (ids.length === 0) return [];

    const { data: dr } = await youtubeApi.get<VideoDetailResponse>('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: ids.join(','),
      },
    });

    return dr.items.map((item) => {
      const dur = item.contentDetails.duration;
      const seconds = parseIsoDuration(dur);
      const thumbMed = item.snippet.thumbnails.medium?.url ?? '';
      const thumbHigh =
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        thumbMed;

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: thumbMed,
        thumbnailHigh: thumbHigh,
        duration: formatDuration(dur),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: seconds,
      };
    });
  } catch (err) {
    handleApiError(err);
  }
}

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
        regionCode: 'IN',
        maxResults: 20,
        pageToken: pageParam,
      },
    });

    const videos = data.items.map((item) => {
      const dur = item.contentDetails.duration;
      const seconds = parseIsoDuration(dur);
      const thumbDef = item.snippet.thumbnails.default?.url ?? '';
      const thumbHigh =
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        thumbDef;

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: thumbDef,
        thumbnailHigh: thumbHigh,
        duration: formatDuration(dur),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: seconds,
      };
    });

    return { videos, nextPageToken: data.nextPageToken };
  } catch (err) {
    console.error('Trending fetch error:', err);
    return { videos: [], nextPageToken: undefined };
  }
}
