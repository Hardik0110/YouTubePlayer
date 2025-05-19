import { create } from 'zustand';
import { searchVideos } from '../services/youtubeApi';
import { VideoItem } from '../types';

interface AppState {
  videos: VideoItem[];
  queueVideos: VideoItem[];
  currentVideo: VideoItem | null;
  isLoading: boolean;
  searchTerm: string;
  error: string | null;
  activeCategory: string | null;
  lastVideoRef: ((node: HTMLDivElement | null) => void) | null;
  setVideos: (videos: VideoItem[]) => void;
  setQueueVideos: (queueVideos: VideoItem[]) => void;
  setCurrentVideo: (video: VideoItem | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setError: (error: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  setLastVideoRef: (ref: ((node: HTMLDivElement | null) => void) | null) => void;
  handleSearch: (query: string) => Promise<void>;
  handleCategorySelect: (category: string) => Promise<void>;
  selectVideo: (video: VideoItem) => void;
  addToQueue: (video: VideoItem) => void;
  removeFromQueue: (videoId: string) => void;
  playNextVideo: () => void;
  playPrevVideo: () => void;
}

const useStore = create<AppState>((set) => ({
  videos: [],
  queueVideos: [],
  currentVideo: null,
  isLoading: false,
  searchTerm: '',
  error: null,
  activeCategory: null,
  lastVideoRef: null,
  setVideos: (videos) => set({ videos }),
  setQueueVideos: (queueVideos) => set({ queueVideos }),
  setCurrentVideo: (currentVideo) => set({ currentVideo }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setError: (error) => set({ error }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setLastVideoRef: (lastVideoRef) => set({ lastVideoRef }),
  handleSearch: async (query: string) => {
    if (!query.trim()) return;
    set({ searchTerm: query, activeCategory: null, isLoading: true, error: null });
    try {
      const results = await searchVideos(query);
      set({
        videos: results ?? [],
        error: !results || results.length === 0 ? 'No videos found for your search. Try different keywords.' : null,
      });
    } catch {
      set({ error: 'Failed to load videos. Please try again later.', videos: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  handleCategorySelect: async (category: string) => {
    set({ activeCategory: category, searchTerm: category, isLoading: true, error: null });
    try {
      const results = await searchVideos(category);
      set({
        videos: results ?? [],
        error: !results || results.length === 0 ? `No ${category} videos found. Try a different category.` : null,
      });
    } catch {
      set({ error: 'Failed to load videos. Please try again later.', videos: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  selectVideo: (video) => set({ currentVideo: video }),
  addToQueue: (video) =>
    set((state) => ({
      queueVideos: state.queueVideos.some((v) => v.id === video.id)
        ? state.queueVideos
        : [...state.queueVideos, video],
    })),
  removeFromQueue: (videoId) =>
    set((state) => ({
      queueVideos: state.queueVideos.filter((video) => video.id !== videoId),
    })),
  playNextVideo: () =>
    set((state) => {
      if (state.queueVideos.length === 0) return {};
      const nextVideo = state.queueVideos[0];
      return {
        currentVideo: nextVideo,
        queueVideos: state.queueVideos.slice(1),
      };
    }),
  playPrevVideo: () =>
    set((state) => {
      if (!state.currentVideo) return {};
      const idx = state.videos.findIndex((v) => v.id === state.currentVideo!.id);
      if (idx <= 0) return {};
      return { currentVideo: state.videos[idx - 1] };
    }),
}));

export default useStore;