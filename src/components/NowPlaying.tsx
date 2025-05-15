import React, { useState, useRef, useImperativeHandle, forwardRef, RefObject } from 'react';
import { VideoItem } from '../types';
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { Maximize, Minimize } from 'lucide-react';

interface NowPlayingProps {
  currentVideo: VideoItem | null;
  onPlayerReady: (event: YouTubeEvent) => void;
  onPlayerStateChange: (event: YouTubeEvent) => void;
}

export interface VideoPlayerRef {
  player: YouTubePlayer | null;
}

const NowPlaying = forwardRef<VideoPlayerRef, NowPlayingProps>(
  ({ currentVideo, onPlayerReady, onPlayerStateChange }, ref) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);

    useImperativeHandle(ref, () => ({
      get player() {
        return playerRef.current;
      }
    }));

    const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    const handleReady = (event: YouTubeEvent) => {
      playerRef.current = event.target;
      onPlayerReady(event);
    };

    if (!currentVideo) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-white bg-opacity-50 rounded-lg shadow-retro m-4">
          <div className="w-16 h-16 border-8 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-press-start text-sm text-textColor text-center">
            No track selected
          </p>
          <p className="font-vt323 text-textColor text-center mt-2">
            Pick a song from the list to start playing
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 h-full">
        <div className="bg-white bg-opacity-50 rounded-lg shadow-retro-lg p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-press-start text-lg text-textColor">Now Playing</h2>
            <button 
              onClick={toggleFullscreen} 
              className="bg-accent p-2 rounded-md transition-all hover:bg-opacity-80 shadow-retro"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="mb-4 flex-grow flex flex-col items-center justify-center">
            <div className={`relative w-full max-w-xs mx-auto mb-6 border-4 border-primary shadow-retro-lg ${isFullscreen ? 'max-w-full h-[70vh]' : ''}`}>
              <YouTube
                videoId={currentVideo.id}
                className="w-full h-full aspect-video"
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    origin: window.location.origin,
                    enablejsapi: 1
                  }
                }}
                onReady={handleReady}
                onStateChange={onPlayerStateChange}
              />
            </div>
            
            <div className="w-full">
              <h3 className="font-vt323 text-2xl text-textColor font-bold text-center mb-2">
                {currentVideo.title}
              </h3>
              <p className="font-vt323 text-lg text-gray-700 text-center mb-1">
                {currentVideo.channelTitle}
              </p>
              <p className="font-vt323 text-md text-gray-500 text-center">
                {currentVideo.viewCount}
              </p>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="w-full h-2 bg-secondary mb-2 relative overflow-hidden rounded-full">
              <div className="absolute left-0 top-0 h-full w-16 bg-primary animate-pulse-slow"></div>
            </div>
            <div className="pixel-art-border w-full h-8 bg-secondary font-vt323 text-white flex items-center justify-center">
              <span className="animate-pulse-slow">♪♫ RETRO MUSIC PLAYER ♫♪</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default NowPlaying;