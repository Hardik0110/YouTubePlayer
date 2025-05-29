import { create } from 'zustand';
import { PlayerState } from '../types/index';

const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  isVideoMode: true,
  currentVideo: null,
  queue: [],
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setVideoMode: (isVideoMode) => set({ isVideoMode }),
}));

export default usePlayerStore;
