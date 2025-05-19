import React from 'react';
import { X } from 'lucide-react';
import VideoItem from './VideoItem';
import { VideoItem as VideoItemType } from '../types';
import { Music } from 'lucide-react';

interface QueueListProps {
  queueVideos: VideoItemType[];
  currentVideo: VideoItemType | null;
  onSelectVideo: (video: VideoItemType) => void;
  onRemoveFromQueue: (videoId: string) => void;
}

const QueueList: React.FC<QueueListProps> = ({
  queueVideos,
  currentVideo,
  onSelectVideo,
  onRemoveFromQueue
}) => {
  return (
    <div className="p-4">
      <h2 className="text-textColor font-press-start text-lg mb-4">Queue</h2>
      
      {queueVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4">
          <Music className="w-12 h-12 text-accent mb-4" />
          <p className="text-center text-textColor">Queue is empty</p>
          <p className="text-center text-textColor text-sm mt-2">Add videos from the search results</p>
        </div>
      ) : (
        queueVideos.map((video, index) => (
          <div key={video.id} className="mb-4 relative group">
            <VideoItem
              video={video}
              onSelect={onSelectVideo}
              isActive={currentVideo?.id === video.id}
            />
            <div className="absolute left-0 top-0 bg-primary bg-opacity-80 text-white px-2 py-1 rounded-br-md font-vt323">
              {index + 1}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromQueue(video.id);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove from queue"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default QueueList;