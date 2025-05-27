import React from 'react';
import { Music } from 'lucide-react';
import { useTrendingVideos } from '../hooks/useTrendingVideos';
import { useVideoDisplay } from '../hooks/useVideoDisplay';
import VideoGrid from './VideoGrid';
import LoadingSpinner from './ui/LoadingSpinner';
import { VideoItem as VideoItemType } from '../types';

interface VideoLibraryProps {
  currentVideo: VideoItemType | null;
  searchTerm: string;
  searchResults: VideoItemType[];
  categoryVideos: VideoItemType[];
  activeCategory: string | null;
  isLoading: boolean;
  onSelectVideo: (video: VideoItemType) => void;
  onAddToQueue: (video: VideoItemType) => void;
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({
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
    error 
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
    trendingData
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-red-500">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
      </div>
    );
  }

  if ((isEmpty && !isLoading && !trendingLoading) || !videos) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Music className="w-12 h-12 text-primary mb-4" />
        <p className="text-center text-accent">
          {searchTerm || activeCategory ? 'No videos found' : 'Loading trending videos...'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/3 border-r border-secondary/30 overflow-y-auto p-4">
      <h2 className="text-primary font-press-start text-lg mb-4">
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
};

export default VideoLibrary;