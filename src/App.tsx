import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import VideoList from './components/VideoList';
import NowPlaying, { VideoPlayerRef } from './components/NowPlaying';
import Player from './components/Player';
import { searchVideos, getTrendingVideos } from './services/youtubeApi';
import { VideoItem } from './types';
import { YouTubeEvent } from 'react-youtube';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [queue, setQueue] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  //trending videos
  useEffect(() => {
    const loadTrendingVideos = async () => {
      setIsLoading(true);
      try {
        const trendingVideos = await getTrendingVideos();
        setVideos(trendingVideos);
      } catch (error) {
        console.error('Error loading trending videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrendingVideos();
  }, []);

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
    
    const newQueue = videos.filter(v => v.id !== video.id);
    setQueue(newQueue);
  };

  const playNextVideo = () => {
    if (queue.length === 0) return;
    
    const nextVideo = queue[0];
    setCurrentVideo(nextVideo);
    setQueue(prevQueue => prevQueue.slice(1));
  };

  const playPrevVideo = () => {
    if (videos.length > 0 && currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setCurrentVideo(videos[prevIndex]);
        setQueue(videos.filter((_, i) => i !== prevIndex && i !== currentIndex));
      }
    }
  };

  const handlePlayerReady = (event: YouTubeEvent) => {
    // Player is ready
  };

  const handlePlayerStateChange = (event: YouTubeEvent) => {
    // Handle player state changes
    if (event.data === 0) { // Video ended
      playNextVideo();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Search results sidebar */}
        <div className="w-full md:w-2/5 lg:w-1/3 border-r-4 border-secondary overflow-y-auto">
          <VideoList 
            videos={videos}
            onSelectVideo={selectVideo}
            currentVideo={currentVideo}
            isLoading={isLoading}
            searchTerm={searchTerm}
          />
        </div>
        
        {/* Now playing section */}
        <div className="w-full md:w-3/5 lg:w-2/3 overflow-y-auto">
          <NowPlaying 
            ref={videoPlayerRef}
            currentVideo={currentVideo} 
            onPlayerReady={handlePlayerReady}
            onPlayerStateChange={handlePlayerStateChange}
          />
        </div>
      </main>
      
      {/* Player controls - fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 z-10">
        <Player 
          currentVideo={currentVideo}
          queue={queue}
          onNextVideo={playNextVideo}
          onPrevVideo={playPrevVideo}
          videoPlayerRef={videoPlayerRef}
        />
      </div>
    </div>
  );
}

export default App;