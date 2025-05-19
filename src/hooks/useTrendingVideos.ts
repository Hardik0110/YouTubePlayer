import { useInfiniteQuery } from '@tanstack/react-query';
import { getTrendingVideos } from '../services/youtubeApi';
import { VideoItem } from '../types';

interface TrendingResponse {
  videos: VideoItem[];
  nextPageToken?: string;
}

export const useTrendingVideos = () => {
  return useInfiniteQuery<TrendingResponse>({
    queryKey: ['trending'],
    queryFn: ({ pageParam = '' }) => getTrendingVideos({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageSize: 10,
    staleTime: 5 * 60 * 1000, // 5 minutes
    suspense: false,
    keepPreviousData: true,
  });
};