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
import { VideoPlayerRef, VideoItem } from './types';
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
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<VideoItem[]>([]);
  const [isLoading] = useState(false);
  const [ setLastVideoRef] = useState<((ref: (node: HTMLDivElement | null) => void) => void) | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);

  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handlePlayerReady = (): void => {
    // no-op
  };

  const handleCategorySelect = async (category: string) => {
    try {
      storeSetIsLoading(true); // Use the store's setIsLoading
      setActiveCategory(category);
      const results = await searchVideos(category);
      if (results) {
        setCategoryVideos(results);
        storeSetVideos(results);
      }
    } catch (error) {
      console.error('Error fetching category videos:', error);
    } finally {
      storeSetIsLoading(false);
    }
  };

  const handleSearchWrapper = async (term: string) => {
    try {
      storeSetIsLoading(true);
      setActiveCategory(null);
      setCategoryVideos([]);
      
      const results = await searchVideos(term);
      if (results) {
        setSearchResults(results); // Store search results
        storeSetVideos(results);
      }
      handleSearch(term);
    } catch (error) {
      console.error('Error searching videos:', error);
      setSearchResults([]); // Clear results on error
    } finally {
      storeSetIsLoading(false);
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
          <Header onSearch={handleSearchWrapper} />
          <CategoryBar 
            onCategorySelect={handleCategorySelect} 
            activeCategory={activeCategory}
            onVideosLoaded={setCategoryVideos}
            setIsLoading={storeSetIsLoading}
          />
          
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="w-full lg:w-1/4 border-r-4 border-secondary overflow-y-auto">
              <VideoLibrary
                currentVideo={currentVideo}
                searchTerm={searchTerm}
                searchResults={searchResults} // Add this prop
                onSelectVideo={selectVideo}
                onAddToQueue={addToQueue}
                onVideosLoaded={storeSetVideos}
                setIsLoading={storeSetIsLoading}
                onLastVideoRef={setLastVideoRef}
                categoryVideos={categoryVideos}
                activeCategory={activeCategory}
                isLoadingCategory={isLoading}
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