import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { PlusCircle, Music } from 'lucide-react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { useTrendingVideos } from '../hooks/useTrendingVideos';

interface VideoLibraryProps {
  onSelectVideo: (video: VideoItemType) => void;
  onAddToQueue: (video: VideoItemType) => void;
  currentVideo: VideoItemType | null;
  searchTerm: string;
  searchResults?: VideoItemType[];
  onVideosLoaded?: (videos: VideoItemType[]) => void;
  setIsLoading?: (loading: boolean) => void;
  onLastVideoRef?: (ref: (node: HTMLDivElement | null) => void) => void;
  categoryVideos?: VideoItemType[];
  activeCategory?: string | null;
  isLoadingCategory?: boolean;
}

interface VideoPage {
  videos: VideoItemType[];
  nextPageToken?: string;
}
const VideoLibrary: React.FC<VideoLibraryProps> = ({
  onSelectVideo,
  onAddToQueue,
  currentVideo,
  searchTerm,
  searchResults = [],
  onVideosLoaded,
  setIsLoading,
  onLastVideoRef,
  categoryVideos = [],
  activeCategory,
  isLoadingCategory = false
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error
  } = useTrendingVideos();

  const trendingVideos = useMemo(() => 
    (Array.isArray(data?.pages) ? data.pages as VideoPage[] : []).flatMap((page: VideoPage) => page.videos),
    [data?.pages]
  );

  // Update the videos memo to include search results
  const videos = useMemo(() => {
    if (searchTerm && searchResults && searchResults.length > 0) {
      return searchResults;
    }
    if (activeCategory && categoryVideos.length > 0) {
      return categoryVideos;
    }
    return trendingVideos;
  }, [searchTerm, searchResults, activeCategory, categoryVideos, trendingVideos]);

  const shouldShowInfiniteScroll = !activeCategory && !searchTerm;

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching || !shouldShowInfiniteScroll) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [fetchNextPage, hasNextPage, isFetching, shouldShowInfiniteScroll]);

  // Provide lastVideoRef to parent component if callback exists
  useEffect(() => {
    if (onLastVideoRef) {
      onLastVideoRef(lastVideoRef);
    }
  }, [lastVideoRef, onLastVideoRef]);

  // Update parent with videos data
  useEffect(() => {
    if (onVideosLoaded && videos.length > 0) {
      onVideosLoaded(videos);
    }
  }, [videos, onVideosLoaded]);

  // Update parent with loading state
  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(isLoading || isFetching || isLoadingCategory);
    }
  }, [isLoading, isFetching, isLoadingCategory, setIsLoading]);

  const getHeaderText = () => {
    if (activeCategory) {
      return `${activeCategory} Music`;
    }
    if (searchTerm) {
      return 'Search Results';
    }
    return 'Trending Videos';
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Music className="w-12 h-12 text-accent mb-4" />
      <p className="text-center text-white">
        {activeCategory || searchTerm ? 'No videos found' : 'Loading trending videos...'}
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <p className="text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </p>
    </div>
  );

  const renderLoadingSpinner = () => (
    <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
    </div>
  );

  const renderVideoItem = (video: VideoItemType, index: number) => (
    <div
      key={video.id}
      ref={index === videos.length - 1 && shouldShowInfiniteScroll ? lastVideoRef : undefined}
      className="mb-4 relative group"
    >
      <VideoItem
        video={video}
        onSelect={onSelectVideo}
        isActive={currentVideo?.id === video.id}
      />
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddToQueue(video);
        }}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Add to queue"
        aria-label={`Add ${video.title} to queue`}
      >
        <PlusCircle className="w-5 h-5 text-white" />
      </button>
    </div>
  );

  if (error && !activeCategory) {
    return renderErrorState();
  }

  if (!videos.length && (isLoading || isLoadingCategory)) {
    return (
      <div className="p-4">
        <h2 className="text-accent font-press-start text-lg mb-4">
          {getHeaderText()}
        </h2>
        {renderLoadingSpinner()}
      </div>
    );
  }

  if (!videos.length) {
    return renderEmptyState();
  }

  return (
    <div className="p-4">
      <h2 className="text-accent font-press-start text-lg mb-4">
        {getHeaderText()}
      </h2>
      
      {videos.map(renderVideoItem)}
      
      {shouldShowInfiniteScroll && (isLoading || isFetching) && renderLoadingSpinner()}
    </div>
  );
};

export default VideoLibrary;