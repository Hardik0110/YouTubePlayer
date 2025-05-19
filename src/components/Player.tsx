import React, { useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { PlayerProps } from '../types';



const Player: React.FC<PlayerProps> = ({
  currentVideo,
  onPrevVideo,
  videoPlayerRef,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentVideo) return;

    
    setCurrentTime(currentVideo!.startTime);
    setDuration(currentVideo!.endTime - currentVideo!.startTime);

    const pl = videoPlayerRef.current;
    if (!pl) return;

    setIsMuted(pl.isMuted());
    pl.setVolume(volume);

    function startTracking() {
      stopTracking();
      intervalRef.current = window.setInterval(() => {
        const player = videoPlayerRef.current;
        if (player) {
          setCurrentTime(currentVideo!.startTime + player.getCurrentTime());
          setIsPlaying(player.isPlaying());
        }
      }, 500);              
    }

    function stopTracking() {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    startTracking();
    return () => stopTracking();
  }, [currentVideo, videoPlayerRef, volume]);

  const format = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    const pl = videoPlayerRef.current;
    if (!pl) return;
    pl.togglePlay();
    setIsPlaying(p => !p);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pl = videoPlayerRef.current;
    if (!pl) return;
    const v = Number(e.target.value);
    setVolume(v);
    if (v === 0) {
      pl.mute();
      setIsMuted(true);
    } else {
      pl.setVolume(v);
      if (isMuted) {
        pl.unMute();
        setIsMuted(false);
      }
    }
  };

    const toggleMute = () => {
    const pl = videoPlayerRef.current;
    if (!pl) return;

    if (isMuted) {
      pl.unMute();
    } else {
      pl.mute();
    }

    setIsMuted(m => !m);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const pl = videoPlayerRef.current;
    if (!bar || !pl) return;

    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const target = pct * duration;

    pl.seekTo(target);
    setCurrentTime(currentVideo!.startTime + target);
  };

  return (
    <div className="bg-primary border-t-4 border-secondary pb-safe w-full">
      {currentVideo ? (
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="w-full mr-2">
              <h3 className="font-vt323 text-white text-lg line-clamp-1">
                {currentVideo.title}
              </h3>
              <p className="font-vt323 text-white text-xs opacity-80">
                {currentVideo.channelTitle}
              </p>
            </div>
          </div>

          <div
            ref={progressBarRef}
            onClick={seek}
            className="h-4 bg-secondary mb-1 cursor-pointer rounded-full overflow-hidden shadow-retro"
          >
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{
                width: duration > 0 ? `${((currentTime - currentVideo!.startTime) / duration) * 100}%` : '0%'
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-vt323 text-white mb-2">
            <span>{format(currentTime)}</span>
            <span>{format(currentVideo!.endTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onPrevVideo} disabled={!currentVideo} className="bg-accent p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro disabled:opacity-50">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={togglePlay} className="bg-accent p-3 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="bg-accent p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro disabled:opacity-50">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center">
              <button onClick={toggleMute} className="bg-accent p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input type="range" min="0" max="100" value={volume} onChange={changeVolume} className="w-24 accent-accent cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 h-32 flex flex-col items-center justify-center">
          <Music className="w-10 h-10 text-white mb-2 animate-bounce-slow" />
          <p className="font-press-start text-sm text-white text-center">
            Select a song to play
          </p>
        </div>
      )}
    </div>
  );
};

export default Player;
