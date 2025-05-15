import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Music 
} from 'lucide-react';
import { VideoItem } from '../types';
import { VideoPlayerRef } from './NowPlaying';
import { YouTubeEvent } from 'react-youtube';

interface PlayerProps {
  currentVideo: VideoItem | null;
  queue: VideoItem[];
  onNextVideo: () => void;
  onPrevVideo: () => void;
  videoPlayerRef: React.RefObject<VideoPlayerRef>;
}

const Player: React.FC<PlayerProps> = ({ 
  currentVideo, 
  queue, 
  onNextVideo, 
  onPrevVideo,
  videoPlayerRef
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When video changes, reset states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentVideo]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayerReady = (event: YouTubeEvent) => {
    const player = event.target;
    setDuration(player.getDuration());
    player.setVolume(volume);
    
    // Auto-play when ready
    setTimeout(() => {
      setIsPlaying(true);
      player.playVideo();
    }, 500);
  };

  const handlePlayerStateChange = (event: YouTubeEvent) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    if (event.data === 0) {
      // Video ended, play next if available
      onNextVideo();
    } else if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const player = videoPlayerRef.current?.player;
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = videoPlayerRef.current?.player;
    if (!player) return;
    
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    player.setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      player.mute();
    } else if (isMuted) {
      setIsMuted(false);
      player.unMute();
    }
  };

  const toggleMute = () => {
    const player = videoPlayerRef.current?.player;
    if (!player) return;
    
    if (isMuted) {
      player.unMute();
      player.setVolume(volume === 0 ? 50 : volume);
      if (volume === 0) setVolume(50);
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = videoPlayerRef.current?.player;
    if (!player || !progressBarRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  // Update progress bar
  useEffect(() => {
    const player = videoPlayerRef.current?.player;
    if (!player || !isPlaying) return;
    
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      setCurrentTime(currentTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, videoPlayerRef]);

  return (
    <div className="bg-primary border-t-4 border-secondary pb-safe w-full">
      {currentVideo ? (
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="w-full mr-2">
              <h3 className="font-vt323 text-white text-lg line-clamp-1">{currentVideo.title}</h3>
              <p className="font-vt323 text-white text-xs opacity-80">{currentVideo.channelTitle}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="h-4 bg-secondary mb-1 cursor-pointer rounded-full overflow-hidden shadow-retro"
          >
            <div 
              className="h-full bg-accent transition-all duration-200"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs font-vt323 text-white mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={onPrevVideo}
                disabled={!currentVideo}
                className="bg-accent p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro disabled:opacity-50"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="bg-accent p-3 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={onNextVideo}
                disabled={queue.length === 0}
                className="bg-accent p-2 rounded-full transition hover:bg-opacity-80 active:translate-y-1 shadow-retro disabled:opacity-50"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleMute}
                className="bg-accent p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-accent cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 h-32 flex flex-col items-center justify-center">
          <Music className="w-10 h-10 text-white mb-2 animate-bounce-slow" />
          <p className="font-press-start text-sm text-white text-center">Select a song to play</p>
        </div>
      )}
    </div>
  );
};

export default Player;