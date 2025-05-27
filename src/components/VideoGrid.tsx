import React, { useRef, useCallback } from 'react';
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

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  currentVideo,
  onSelectVideo,
  onAddToQueue,
  shouldShowInfiniteScroll,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { fetchNextPage, hasNextPage, isFetching } = useTrendingVideos();

  // Filter out invalid videos
  const validVideos = videos.filter((video): video is VideoItemType => 
    video !== undefined && video !== null && typeof video.id === 'string'
  );

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

  const renderVideoItem = (video: VideoItemType, index: number) => {
    if (!video || !video.id) return null;
    
    return (
      <div
        key={video.id}
        ref={index === validVideos.length - 1 && shouldShowInfiniteScroll ? lastVideoRef : undefined}
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
  };

  return (
    <div>
      {validVideos.map(renderVideoItem)}
    </div>
  );
};

export default VideoGrid;