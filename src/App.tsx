import { useRef, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './components/Header';
import VideoList from './components/VideoList';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ErrorFallback from './components/ErrorFallback';
import TrendingLoader from './components/TrendingLoader';
import CategoryBar from './components/CategoryBar';
import QueueList from './components/QueueList';

import useStore from './stores/store';
import { VideoPlayerRef } from './types';

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
  const {
    videos,
    queueVideos,
    currentVideo,
    isLoading,
    searchTerm,
    error,
    activeCategory,
    lastVideoRef,
    handleSearch,
    handleCategorySelect,
    selectVideo,
    addToQueue,
    removeFromQueue,
    playNextVideo,
    playPrevVideo,
    setVideos,
    setIsLoading,
    setLastVideoRef,
  } = useStore();

  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleLastVideoRef = useCallback((ref: (node: HTMLDivElement | null) => void) => {
    setLastVideoRef(ref);
  }, [setLastVideoRef]);

  const handlePlayerReady = (): void => {
    // no-op
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          useStore.setState({ error: null });
          window.location.reload();
        }}
      >
        <div className="flex flex-col h-screen">
          <Header onSearch={handleSearch} />
          <CategoryBar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="w-full lg:w-1/4 border-r-4 border-secondary overflow-y-auto">
              <VideoList
                videos={videos}
                currentVideo={currentVideo}
                isLoading={isLoading}
                searchTerm={searchTerm}
                error={error}
                onSelectVideo={selectVideo}
                onAddToQueue={addToQueue}
                lastVideoRef={lastVideoRef}
              />
            </div>

            <div className="w-full lg:w-2/4 overflow-hidden border-r-4 border-secondary">
              tájékoztató
              <NowPlaying
                ref={videoPlayerRef}
                currentVideo={currentVideo}
                onPlayerReady={handlePlayerReady}
              />
            </div>

            <div className="w-full lg:w-1/4 overflow-y-auto">
              <QueueList
                queueVideos={queueVideos}
                currentVideo={currentVideo}
                onSelectVideo={selectVideo}
                onRemoveFromQueue={removeFromQueue}
              />
            </div>
          </main>

          <div className="sticky bottom-0 left-0 right-0 z-10">
            <Player
              currentVideo={currentVideo}
              onPrevVideo={playPrevVideo}
              onNextVideo={playNextVideo}
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