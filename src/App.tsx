import { useState, useRef } from 'react';
import Header from './components/Header';
import VideoList from './components/VideoList';
import NowPlaying from './components/NowPlaying';
import Player from './components/Player';
import { searchVideos } from './services/youtubeApi';
import { VideoItem, VideoPlayerRef } from './types';
import TrendingLoader from './components/TrendingLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setIsLoading(true);
    try {
      const results = await searchVideos(query);
      setVideos(results);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectVideo = (video: VideoItem) => {
    setCurrentVideo(video);
  };

  const playPrevVideo = () => {
    if (videos.length > 0 && currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setCurrentVideo(videos[prevIndex]);
      }
    }
  };

  const handlePlayerReady = () => {
    // player ready
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        <TrendingLoader setVideos={setVideos} setIsLoading={setIsLoading} />
        <Header onSearch={handleSearch} />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-2/5 lg:w-1/3 border-r-4 border-secondary overflow-y-auto">
            <VideoList
              videos={videos}
              onSelectVideo={selectVideo}
              currentVideo={currentVideo}
              isLoading={isLoading}
              searchTerm={searchTerm}
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
    </QueryClientProvider>
  );
}

export default App;
