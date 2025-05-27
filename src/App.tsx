import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './components/Header';
import VideoLibrary from './components/VideoLibrary';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import ErrorFallback from './components/ErrorFallback';
import CategoryBar from './components/CategoryBar';
import QueueList from './components/QueueList';

import useStore from './stores/store';
import { VideoPlayerRef } from './types';
import { useVideoSearch } from './hooks/useVideoSearch';

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
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  
  // Store state
  const {
    currentVideo,
    searchTerm,
    queueVideos,
    selectVideo,
    addToQueue,
    removeFromQueue,
    playNextVideo,
    playPrevVideo,
  } = useStore();

  // Custom hook for video search logic
  const {
    activeCategory,
    categoryVideos,
    searchResults,
    isLoading,
    handleCategorySelect,
    handleSearch,
  } = useVideoSearch();

  const handlePlayerReady = (): void => {
    // Player ready callback 
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex flex-col h-screen">
          <Header onSearch={handleSearch} />
          <CategoryBar 
            onCategorySelect={handleCategorySelect} 
            activeCategory={activeCategory}
          />
          
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <VideoLibrary
              currentVideo={currentVideo}
              searchTerm={searchTerm}
              searchResults={searchResults}
              categoryVideos={categoryVideos}
              activeCategory={activeCategory}
              isLoading={isLoading}
              onSelectVideo={selectVideo}
              onAddToQueue={addToQueue}
            />

            <div className="w-full lg:w-1/3 border-r border-secondary/30">
              <NowPlaying
                ref={videoPlayerRef}
                currentVideo={currentVideo}
                onPlayerReady={handlePlayerReady}
              />
            </div>

            <div className="w-full lg:w-1/3">
              <QueueList
                queueVideos={queueVideos}
                currentVideo={currentVideo}
                onSelectVideo={selectVideo}
                onRemoveFromQueue={removeFromQueue}
              />
            </div>
          </main>

          <Player
            currentVideo={currentVideo}
            onPrevVideo={playPrevVideo}
            onNextVideo={playNextVideo}
            videoPlayerRef={videoPlayerRef}
          />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;