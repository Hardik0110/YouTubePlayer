import { useMemo } from 'react';
import { VideoItem } from '../types';

interface UseVideoDisplayProps {
  searchTerm: string;
  searchResults: VideoItem[];
  categoryVideos: VideoItem[];
  activeCategory: string | null;
  trendingData: any; 
}

export const useVideoDisplay = ({
  searchTerm,
  searchResults,
  categoryVideos,
  activeCategory,
  trendingData,
}: UseVideoDisplayProps) => {
  const videos = useMemo(() => {
    if (searchTerm && searchResults?.length > 0) {
      return searchResults;
    }
    if (activeCategory && categoryVideos?.length > 0) {
      return categoryVideos;
    }
    // Handle trending videos
    if (trendingData?.pages) {
      return trendingData.pages.flatMap(page => page.videos);
    }
    return [];
  }, [searchTerm, searchResults, activeCategory, categoryVideos, trendingData]);

  const headerText = useMemo(() => {
    if (searchTerm) return 'Search Results';
    if (activeCategory) return activeCategory.replace(' music', '');
    return 'Trending Videos';
  }, [searchTerm, activeCategory]);

  const shouldShowInfiniteScroll = !searchTerm && !activeCategory;
  const isEmpty = videos.length === 0;

  return {
    videos,
    headerText,
    shouldShowInfiniteScroll,
    isEmpty,
  };
};