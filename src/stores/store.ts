import { create } from 'zustand';
import { searchVideos } from '../services/youtubeApi';
import { AppState } from '../types/index';

const useStore = create<AppState>((set, get) => ({
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
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setError: (error) => set({ error }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setLastVideoRef: (ref) => set({ lastVideoRef: ref }),

  handleSearch: async (query) => {
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

  handleCategorySelect: async (category) => {
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

  playNextVideo: () => {
    const state = get();
    if (state.queueVideos.length === 0) return;
    const nextVideo = state.queueVideos[0];
    set({
      currentVideo: nextVideo,
      queueVideos: state.queueVideos.slice(1),
    });
  },

  playPrevVideo: () => {
    const state = get();
    const { currentVideo, videos } = state;
    if (!currentVideo) return;
    const idx = videos.findIndex((v) => v.id === currentVideo.id);
    if (idx <= 0) return;
    set({ currentVideo: videos[idx - 1] });
  },
}));

export default useStore;
