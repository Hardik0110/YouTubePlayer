import { create } from 'zustand';
import { searchVideos } from '../services/youtubeApi';
import { AppState, VideoItem } from '../types/index';

interface StoreState extends AppState {
  // Additional store-specific state
  isQueueEmpty: boolean;
  canPlayPrevious: boolean;
}

const useStore = create<StoreState>((set, get) => ({
  // Initial state
  videos: [],
  queueVideos: [],
  currentVideo: null,
  isLoading: false,
  searchTerm: '',
  error: null,
  activeCategory: null,
  lastVideoRef: null,
  isQueueEmpty: true,
  canPlayPrevious: false,

  // State setters
  setVideos: (videos: VideoItem[]) => set({ videos }),
  setQueueVideos: (queueVideos: VideoItem[]) => set({ 
    queueVideos,
    isQueueEmpty: queueVideos.length === 0 
  }),
  setCurrentVideo: (video: VideoItem | null) => set({ currentVideo: video }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setError: (error: string | null) => set({ error }),
  setActiveCategory: (category: string | null) => set({ activeCategory: category }),
  setLastVideoRef: (ref: ((node: HTMLDivElement | null) => void) | null) => set({ lastVideoRef: ref }),

  // Search handlers
  handleSearch: async (query: string) => {
    if (!query.trim()) {
      set({ error: 'Please enter a search term' });
      return;
    }

    set({ 
      searchTerm: query, 
      activeCategory: null, 
      isLoading: true, 
      error: null 
    });

    try {
      const results = await searchVideos(query);
      
      if (!results || results.length === 0) {
        set({ 
          videos: [], 
          error: 'No videos found for your search. Try different keywords.' 
        });
        return;
      }

      set({ 
        videos: results,
        error: null
      });
    } catch (error) {
      console.error('Search error:', error);
      set({ 
        error: 'Failed to load videos. Please try again later.', 
        videos: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  handleCategorySelect: async (category: string) => {
    set({ 
      activeCategory: category, 
      searchTerm: category, 
      isLoading: true, 
      error: null 
    });

    try {
      const results = await searchVideos(category);
      
      if (!results || results.length === 0) {
        set({ 
          videos: [], 
          error: `No ${category} videos found. Try a different category.` 
        });
        return;
      }

      set({ 
        videos: results,
        error: null
      });
    } catch (error) {
      console.error('Category search error:', error);
      set({ 
        error: 'Failed to load videos. Please try again later.', 
        videos: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Video selection and queue management
  selectVideo: (video: VideoItem) => {
    const state = get();
    set({ 
      currentVideo: video,
      canPlayPrevious: state.videos.findIndex(v => v.id === video.id) > 0
    });
  },

  addToQueue: (video: VideoItem) => {
    set((state) => {
      const isAlreadyInQueue = state.queueVideos.some((v) => v.id === video.id);
      if (isAlreadyInQueue) return state;

      const newQueue = [...state.queueVideos, video];
      return {
        queueVideos: newQueue,
        isQueueEmpty: false
      };
    });
  },

  removeFromQueue: (videoId: string) => {
    set((state) => {
      const newQueue = state.queueVideos.filter((video) => video.id !== videoId);
      return {
        queueVideos: newQueue,
        isQueueEmpty: newQueue.length === 0
      };
    });
  },

  // Playback control
  playNextVideo: () => {
    const state = get();
    if (state.isQueueEmpty) return;

    const [nextVideo, ...remainingQueue] = state.queueVideos;
    set({
      currentVideo: nextVideo,
      queueVideos: remainingQueue,
      isQueueEmpty: remainingQueue.length === 0
    });
  },

  playPrevVideo: () => {
    const state = get();
    if (!state.currentVideo || !state.canPlayPrevious) return;

    const currentIndex = state.videos.findIndex((v) => v.id === state.currentVideo?.id);
    if (currentIndex <= 0) return;

    set({ 
      currentVideo: state.videos[currentIndex - 1],
      canPlayPrevious: currentIndex > 1
    });
  },
}));

export default useStore;
