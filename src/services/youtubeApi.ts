import axios from 'axios';
import { SearchResponse, VideoDetailResponse, VideoItem } from '../types';

const API_KEY = 'AIzaSyAYczYJhbB6_pkwy7va2Dm6S3BcGcZrAMo';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';


const parseDurationToSeconds = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
};


export const formatDuration = (duration: string): string => {
  const totalSeconds = parseDurationToSeconds(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
  return `${count} views`;
};

export const searchVideos = async (query: string): Promise<VideoItem[]> => {
  try {
    const searchResponse = await axios.get<SearchResponse>(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: query,
        type: 'video',
        key: API_KEY,
      },
    });

    if (!searchResponse.data.items.length) return [];

    const videoIds = searchResponse.data.items
      .filter(item => item.id.videoId)
      .map(item => item.id.videoId);

    const detailsResponse = await axios.get<VideoDetailResponse>(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails,statistics,snippet',
        id: videoIds.join(','),
        key: API_KEY,
      },
    });

    return detailsResponse.data.items.map(item => {
      const durationInSeconds = parseDurationToSeconds(item.contentDetails.duration);
      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: durationInSeconds,
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

export const getTrendingVideos = async (): Promise<VideoItem[]> => {
  try {
    const response = await axios.get<VideoDetailResponse>(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        maxResults: 10,
        videoCategoryId: '10',
        key: API_KEY,
      },
    });

    return response.data.items.map(item => {
      const durationInSeconds = parseDurationToSeconds(item.contentDetails.duration);
      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount),
        startTime: 0,
        endTime: durationInSeconds,
      };
    });
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
};
