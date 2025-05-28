import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  PictureInPicture2,
} from 'lucide-react';
import usePlayerStore from '../stores/usePlayerStore';
import { PlayerProps } from '../types';

const Player: React.FC<PlayerProps> = ({
  currentVideo,
  onPrevVideo,
  onNextVideo,
  videoPlayerRef,
}) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsMuted,
  } = usePlayerStore();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [isPiP, setIsPiP] = useState(false);

  useEffect(() => {
    if (!currentVideo) return;

    setCurrentTime(currentVideo.startTime);
    setDuration(currentVideo.endTime - currentVideo.startTime);

    const pl = videoPlayerRef.current;
    if (!pl) return;

    pl.setVolume(volume);
    if (isMuted) {
      pl.mute();
    } else {
      pl.unMute();
    } 

    const startTracking = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        const player = videoPlayerRef.current;
        if (player) {
          setCurrentTime(currentVideo.startTime + player.getCurrentTime());
          setIsPlaying(player.isPlaying());
        }
      }, 500);
    };

    startTracking();

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [currentVideo, videoPlayerRef, volume, isMuted, setCurrentTime, setDuration, setIsPlaying]);

  useEffect(() => {
    return () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
  }, []);

  const format = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    const pl = videoPlayerRef.current;
    if (!pl) return;
    pl.togglePlay();
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    const pl = videoPlayerRef.current;
    if (!pl) return;
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
    setIsMuted(!isMuted);
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        const video = videoPlayerRef.current?.getPipVideo();
        if (!video) return;

        videoPlayerRef.current?.captureStream();
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error('PiP failed:', err);
      alert('Picture-in-Picture mode is not supported in your browser or requires HTTPS');
    }
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
            className="h-4 bg-white mb-1 cursor-pointer rounded-full overflow-hidden shadow-retro"
          >
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{
                width: duration > 0 ? `${((currentTime - currentVideo.startTime) / duration) * 100}%` : '0%',
              }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-vt323 text-white mb-2">
            <span>{format(currentTime)}</span>
            <span>{format(currentVideo.endTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onPrevVideo}
                disabled={!currentVideo}
                className="bg-white p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro disabled:opacity-50"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white p-3 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={onNextVideo}
                className="bg-white p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleMute}
                className="bg-white p-2 rounded-full mr-2 transition hover:bg-opacity-80 active:translate-y-1 shadow-retro"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={changeVolume}
                className="w-24 accent-white cursor-pointer mr-2"
              />
              <button
                onClick={togglePiP}
                className={`bg-white p-2 rounded-full transition hover:bg-opacity-80 active:translate-y-1 shadow-retro ${
                  isPiP ? 'bg-accent text-white' : ''
                }`}
                title={isPiP ? 'Exit Picture in Picture' : 'Enter Picture in Picture'}
              >
                <PictureInPicture2 className="w-5 h-5" />
              </button>
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