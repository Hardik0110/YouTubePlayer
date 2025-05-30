import React, { memo } from 'react';
import { Music } from 'lucide-react';
import { useTrendingVideos } from '../hooks/useTrendingVideos';
import { useVideoDisplay } from '../hooks/useVideoDisplay';
import VideoGrid from './VideoGrid';
import LoadingSpinner from './ui/LoadingSpinner';
import { VideoLibraryProps } from '../types';

const VideoLibrary: React.FC<VideoLibraryProps> = memo(({
  currentVideo,
  searchTerm,
  searchResults,
  categoryVideos,
  activeCategory,
  isLoading,
  onSelectVideo,
  onAddToQueue,
}) => {
  const { 
    data: trendingData, 
    isLoading: trendingLoading, 
    error: trendingError 
  } = useTrendingVideos();

  const { 
    videos, 
    headerText, 
    shouldShowInfiniteScroll, 
    isEmpty 
  } = useVideoDisplay({
    searchTerm,
    searchResults,
    categoryVideos,
    activeCategory,
    trendingData,
  });

  // Error state
  if (trendingError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-background">
        <p className="text-error text-center font-vt323">
          {trendingError instanceof Error 
            ? trendingError.message 
            : 'Failed to load videos. Please try again later.'}
        </p>
      </div>
    );
  }

  // Empty state
  if ((isEmpty && !isLoading && !trendingLoading) || !videos) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-background">
        <Music className="w-12 h-12 text-textColor mb-4" />
        <p className="text-center text-textColor font-vt323">
          {searchTerm || activeCategory 
            ? 'No videos found. Try different keywords.' 
            : 'Loading trending videos...'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/3 border-r border-secondary overflow-y-auto p-4 bg-background">
      <h2 className="text-textColor font-vt323 text-lg mb-4">
        {headerText}
      </h2>
      
      <VideoGrid
        videos={videos}
        currentVideo={currentVideo}
        onSelectVideo={onSelectVideo}
        onAddToQueue={onAddToQueue}
        shouldShowInfiniteScroll={shouldShowInfiniteScroll}
      />
      
      {(isLoading || trendingLoading) && (
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
});

VideoLibrary.displayName = 'VideoLibrary';

export default VideoLibrary;