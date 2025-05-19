import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { getTrendingVideos } from '../services/youtubeApi';
import { VideoItem } from '../types';

interface TrendingResponse {
  videos: VideoItem[];
  nextPageToken?: string;
  pages?: number;
}

interface TrendingQueryParams {
  pageParam?: string;
}

export const useTrendingVideos = (): UseInfiniteQueryResult<TrendingResponse, Error> => {
  return useInfiniteQuery<TrendingResponse, Error, TrendingResponse, [string], string>({
    queryKey: ['trending'],
    initialPageParam: '',
    queryFn: async ({ pageParam = '' }: TrendingQueryParams) => {
      try {
        return await getTrendingVideos({ pageParam });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch trending videos: ${error.message}`);
        }
        throw new Error('Failed to fetch trending videos');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    refetchOnWindowFocus: false,
  });
};