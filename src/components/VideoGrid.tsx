import React, { useRef, useCallback, memo } from 'react';
import { PlusCircle } from 'lucide-react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { useTrendingVideos } from '../hooks/useTrendingVideos';

interface VideoGridProps {
  videos: VideoItemType[];
  currentVideo: VideoItemType | null;
  onSelectVideo: (video: VideoItemType) => void;
  onAddToQueue: (video: VideoItemType) => void;
  shouldShowInfiniteScroll: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = memo(({
  videos,
  currentVideo,
  onSelectVideo,
  onAddToQueue,
  shouldShowInfiniteScroll,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { fetchNextPage, hasNextPage, isFetching } = useTrendingVideos();

  // Filtering out invalid videos
  const validVideos = videos.filter((video): video is VideoItemType => 
    Boolean(video?.id && typeof video.id === 'string')
  );

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching || !shouldShowInfiniteScroll) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (node) {
      observer.current.observe(node);
    }
  }, [fetchNextPage, hasNextPage, isFetching, shouldShowInfiniteScroll]);

  const handleAddToQueue = useCallback((e: React.MouseEvent, video: VideoItemType) => {
    e.stopPropagation();
    onAddToQueue(video);
  }, [onAddToQueue]);

  const renderVideoItem = useCallback((video: VideoItemType, index: number) => {
    const isLastItem = index === validVideos.length - 1;
    const isActive = currentVideo?.id === video.id;
    
    return (
      <div
        key={video.id}
        ref={isLastItem && shouldShowInfiniteScroll ? lastVideoRef : undefined}
        className="relative group"
      >
        <VideoItem
          video={video}
          onSelect={onSelectVideo}
          isActive={isActive}
        />
        <button 
          onClick={(e) => handleAddToQueue(e, video)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          title="Add to queue"
          aria-label={`Add ${video.title} to queue`}
        >
          <PlusCircle className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }, [currentVideo?.id, lastVideoRef, onSelectVideo, shouldShowInfiniteScroll, validVideos.length, handleAddToQueue]);

  if (validVideos.length === 0) {
    return (
      <div className="text-center text-textColor py-8 font-vt323">
        No videos available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validVideos.map(renderVideoItem)}
    </div>
  );
});

VideoGrid.displayName = 'VideoGrid';

export default VideoGrid;