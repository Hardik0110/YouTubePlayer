import axios from 'axios';
import { SearchResponse, VideoDetailResponse, VideoItem } from '../types';

const API_KEY = 'AIzaSyAYczYJhbB6_pkwy7va2Dm6S3BcGcZrAMo';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Format YouTube duration (PT1H2M3S) to readable time
export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count with appropriate suffix
export const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

// Search for videos
export const searchVideos = async (query: string): Promise<VideoItem[]> => {
  try {
    // Search for videos
    const searchResponse = await axios.get<SearchResponse>(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: query,
        type: 'video',
        key: API_KEY,
      },
    });
    
    if (!searchResponse.data.items.length) {
      return [];
    }
    
    // Get video IDs from search results
    const videoIds = searchResponse.data.items
      .filter(item => item.id.videoId)
      .map(item => item.id.videoId);
    
    // Get video details (duration and view count)
    const detailsResponse = await axios.get<VideoDetailResponse>(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails,statistics,snippet',
        id: videoIds.join(','),
        key: API_KEY,
      },
    });
    
    // Map search results with video details
    return detailsResponse.data.items.map(item => {
      const searchItem = searchResponse.data.items.find(
        searchItem => searchItem.id.videoId === item.id
      );
      
      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount),
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

// Get trending videos
export const getTrendingVideos = async (): Promise<VideoItem[]> => {
  try {
    const response = await axios.get<VideoDetailResponse>(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        maxResults: 10,
        videoCategoryId: '10', // Music category
        key: API_KEY,
      },
    });
    
    return response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      duration: formatDuration(item.contentDetails.duration),
      viewCount: formatViewCount(item.statistics.viewCount),
    }));
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
};