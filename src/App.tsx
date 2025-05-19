import { useState, useRef, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './components/Header';
import VideoList from './components/VideoList';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ErrorFallback from './components/ErrorFallback';
import TrendingLoader from './components/TrendingLoader';
import CategoryBar from './components/CategoryBar';

import { searchVideos } from './services/youtubeApi';
import { VideoItem, VideoPlayerRef } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App(): JSX.Element {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const [lastVideoRef, setLastVideoRef] = useState<((node: HTMLDivElement | null) => void) | null>(null);

  const handleLastVideoRef = useCallback((ref: (node: HTMLDivElement | null) => void) => {
    setLastVideoRef(() => ref);
  }, []);

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    setSearchTerm(query);
    setActiveCategory(null);
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchVideos(query);
      setVideos(results ?? []);
      if (!results || results.length === 0) {
        setError('No videos found for your search. Try different keywords.');
      }
    } catch {
      setError('Failed to load videos. Please try again later.');
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: string): Promise<void> => {
    setActiveCategory(category);
    setSearchTerm(category);
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchVideos(category);
      setVideos(results ?? []);
      if (!results || results.length === 0) {
        setError(`No ${category} videos found. Try a different category.`);
      }
    } catch {
      setError('Failed to load videos. Please try again later.');
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectVideo = (video: VideoItem): void => {
    setCurrentVideo(video);
  };

  const playPrevVideo = (): void => {
    if (!currentVideo) return;
    const idx = videos.findIndex(v => v.id === currentVideo.id);
    if (idx > 0) {
      setCurrentVideo(videos[idx - 1]);
    }
  };

  const handlePlayerReady = (): void => {
    // no-op
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setError(null);
          window.location.reload();
        }}
      >
        <div className="flex flex-col h-screen">
          <Header onSearch={handleSearch} />
          <CategoryBar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-2/5 lg:w-1/3 border-r-4 border-secondary overflow-y-auto">
              <VideoList
                videos={videos}
                currentVideo={currentVideo}
                isLoading={isLoading}
                searchTerm={searchTerm}
                error={error}
                onSelectVideo={selectVideo}
                lastVideoRef={lastVideoRef}
              />
            </div>

            <div className="w-full md:w-3/5 lg:w-2/3 overflow-hidden">
              <NowPlaying
                ref={videoPlayerRef}
                currentVideo={currentVideo}
                onPlayerReady={handlePlayerReady}
              />
            </div>
          </main>

          <div className="sticky bottom-0 left-0 right-0 z-10">
            <Player
              currentVideo={currentVideo}
              onPrevVideo={playPrevVideo}
              videoPlayerRef={videoPlayerRef}
            />
          </div>
        </div>
      </ErrorBoundary>
      <TrendingLoader 
        onVideosLoaded={setVideos} 
        setIsLoading={setIsLoading}
        onLastVideoRef={handleLastVideoRef}
      />
    </QueryClientProvider>
  );
}

export default App;
