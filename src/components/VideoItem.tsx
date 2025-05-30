import React, { memo, useCallback } from 'react';
import { VideoItem as VideoItemType } from '../types';

interface VideoItemProps {
  video: VideoItemType;
  onSelect: (video: VideoItemType) => void;
  isActive: boolean;
}

const VideoItem: React.FC<VideoItemProps> = memo(({ video, onSelect, isActive }) => {
  const handleClick = useCallback(() => {
    onSelect(video);
  }, [onSelect, video]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(video);
    }
  }, [onSelect, video]);

  return (
    <div 
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-selected={isActive}
      className={`
        p-3 mb-3 rounded-md cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-accent border-4 border-primary shadow-retro-lg' 
          : 'bg-white border-4 border-secondary hover:border-primary shadow-retro hover:shadow-retro-lg'
        }
      `}
    >
      <div className="flex">
        <div className="relative w-40 h-24 overflow-hidden mr-3 border-2 border-textColor">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-1 font-vt323 text-white text-sm">
            {video.duration}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-vt323 text-lg text-textColor font-bold line-clamp-2">
            {video.title}
          </h3>
          <p className="font-vt323 text-sm text-gray-700">
            {video.channelTitle}
          </p>
          <p className="font-vt323 text-xs text-gray-500 mt-1">
            {video.viewCount}
          </p>
        </div>
      </div>
    </div>
  );
});

VideoItem.displayName = 'VideoItem';

export default VideoItem;