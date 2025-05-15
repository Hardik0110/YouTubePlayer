import React from 'react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { Music } from 'lucide-react';

interface VideoListProps {
  videos: VideoItemType[];
  onSelectVideo: (video: VideoItemType) => void;
  currentVideo: VideoItemType | null;
  isLoading: boolean;
  searchTerm: string;
}

const VideoList: React.FC<VideoListProps> = ({ 
  videos, 
  onSelectVideo, 
  currentVideo,
  isLoading,
  searchTerm
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="animate-spin-slow mb-4">
          <Music className="w-12 h-12 text-primary" />
        </div>
        <p className="font-press-start text-sm text-textColor">Loading...</p>
      </div>
    );
  }

  if (videos.length === 0 && searchTerm) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="p-4 mb-4 bg-secondary rounded-full">
          <Music className="w-12 h-12 text-white" />
        </div>
        <p className="font-press-start text-sm text-textColor text-center">
          No results found for "{searchTerm}"
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="p-4 mb-4 bg-primary rounded-full">
          <Music className="w-12 h-12 text-white" />
        </div>
        <p className="font-press-start text-sm text-textColor text-center">
          Search for music to start playing
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full pb-24 md:pb-4">
      <h2 className="font-press-start text-lg text-textColor mb-4 px-2">
        {searchTerm ? `Results for "${searchTerm}"` : "Trending Music"}
      </h2>
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          video={video}
          onSelect={onSelectVideo}
          isActive={currentVideo?.id === video.id}
        />
      ))}
    </div>
  );
};

export default VideoList;