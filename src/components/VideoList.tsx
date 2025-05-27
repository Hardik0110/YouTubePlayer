import React, {  useRef, useCallback } from 'react';
import { PlusCircle, Music } from 'lucide-react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { useTrendingVideos } from '../hooks/useTrendingVideos';

interface VideoListProps {
  onSelectVideo: (video: VideoItemType) => void;
  onAddToQueue: (video: VideoItemType) => void;
  currentVideo: VideoItemType | null;
  searchTerm: string;
}

const VideoList: React.FC<VideoListProps> = ({
  onSelectVideo,
  onAddToQueue,
  currentVideo,
  searchTerm,
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

  interface VideoPage {
    videos: VideoItemType[];
  }

  const videos: VideoItemType[] = data?.pages?.flatMap((page: VideoPage) => page.videos) || [];

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetching]);

  if (error) {
    return <div className="flex flex-col items-center justify-center h-full p-4">
      <p className="text-red-500">{error instanceof Error ? error.message : 'An error occurred'}</p>
    </div>;
  }

  if (!videos.length && !isLoading) {
    return <div className="flex flex-col items-center justify-center h-full p-4">
      <Music className="w-12 h-12 text-accent mb-4" />
      <p className="text-center text-white">
        {searchTerm ? 'No videos found' : 'Loading trending videos...'}
      </p>
    </div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-accent font-press-start text-lg mb-4">
        {searchTerm ? 'Search Results' : 'Trending Videos'}
      </h2>
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={index === videos.length - 1 ? lastVideoRef : undefined}
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
          >
            <PlusCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      ))}
      {(isLoading || isFetching) && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      )}
    </div>
  );
};

export default VideoList;