import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isVideoMode: boolean;
  showCaptions: boolean;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setVideoMode: (isVideoMode: boolean) => void;
  setShowCaptions: (show: boolean) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 50,
  isMuted: false,
  isVideoMode: true,
  showCaptions: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setVideoMode: (isVideoMode) => set({ isVideoMode }),
  setShowCaptions: (show) => set({ showCaptions: show }),
}));

export default usePlayerStore;