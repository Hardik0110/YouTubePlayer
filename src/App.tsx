import { useRef, useState } from 'react';
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
import { searchVideos } from './services/youtubeApi';

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
    currentVideo,
    searchTerm,
    queueVideos,
    handleSearch,
    selectVideo,
    addToQueue,
    removeFromQueue,
    playNextVideo,
    playPrevVideo,
    setVideos: storeSetVideos,
    setIsLoading: storeSetIsLoading,
    setLastVideoRef,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handlePlayerReady = (): void => {
    // no-op
  };

  const handleCategorySelect = async (category: string) => {
    try {
      setIsLoading(true);
      setIsLoading(true);
      setActiveCategory(category);
      const results = await searchVideos(category);
      if (results) {
        storeSetVideos(results.videos);
      }
      console.error('Error fetching category videos:', error);
    } finally {
      setIsLoading(false);
    }
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
              <VideoLibrary
                currentVideo={currentVideo}
                searchTerm={searchTerm}
                onSelectVideo={selectVideo}
                onAddToQueue={addToQueue}
                onVideosLoaded={storeSetVideos}
                setIsLoading={storeSetIsLoading}
                onLastVideoRef={setLastVideoRef}
              />
            </div>

            <div className="w-full lg:w-2/4 overflow-hidden border-r-4 border-secondary">
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
    </QueryClientProvider>
  );
}

export default App;