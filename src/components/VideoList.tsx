import React from 'react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { Music } from 'lucide-react';

export interface VideoListProps {
  videos: VideoItemType[];
  onSelectVideo: (video: VideoItemType) => void;
  currentVideo: VideoItemType | null;
  isLoading: boolean;
  searchTerm: string;
  error: string | null;
  lastVideoRef?: ((node: HTMLDivElement | null) => void) | null;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onSelectVideo,
  currentVideo,
  isLoading,
  searchTerm,
  error,
  lastVideoRef,
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!videos.length && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Music className="w-12 h-12 text-accent mb-4" />
        <p className="text-center text-white">
          {searchTerm ? 'No videos found' : 'Loading trending videos...'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={index === videos.length - 1 ? lastVideoRef : undefined}
          className="mb-4"
        >
          <VideoItem
            video={video}
            onSelect={onSelectVideo}
            isActive={currentVideo?.id === video.id}
          />
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
