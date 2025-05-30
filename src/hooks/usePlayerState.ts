import { useState, useCallback } from 'react';
import { PlayerState } from '../types';

export const usePlayerState = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isVideoMode: true,
    showCaptions: false,
    currentVideo: null,
    queue: [],
  });

  const togglePlay = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const handleTimeUpdate = useCallback((event: any) => {
    const currentTime = event.target.getCurrentTime();
    const duration = event.target.getDuration();
    const isPlaying = event.target.getPlayerState() === 1;

    setPlayerState(prev => ({
      ...prev,
      currentTime,
      duration,
      isPlaying,
    }));
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setPlayerState(prev => ({
      ...prev,
      volume: newVolume,
      isMuted: newVolume === 0,
    }));
  }, []);

  const handleMuteToggle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  const handleSeek = useCallback((newTime: number) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime: newTime,
    }));
  }, []);

  const setVideoMode = useCallback((isVideoMode: boolean) => {
    setPlayerState(prev => ({
      ...prev,
      isVideoMode,
    }));
  }, []);

  const setShowCaptions = useCallback((showCaptions: boolean) => {
    setPlayerState(prev => ({
      ...prev,
      showCaptions,
    }));
  }, []);

  const setCurrentVideo = useCallback((video: PlayerState['currentVideo']) => {
    setPlayerState(prev => ({
      ...prev,
      currentVideo: video,
    }));
  }, []);

  const setQueue = useCallback((queue: PlayerState['queue']) => {
    setPlayerState(prev => ({
      ...prev,
      queue,
    }));
  }, []);

  return {
    ...playerState,
    setPlayerState,
    togglePlay,
    handleTimeUpdate,
    handleVolumeChange,
    handleMuteToggle,
    handleSeek,
    setVideoMode,
    setShowCaptions,
    setCurrentVideo,
    setQueue,
  };
}; 