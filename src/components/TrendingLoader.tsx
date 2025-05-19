import { useEffect, useRef, useCallback } from 'react';
import { VideoItem } from '../types';
import { useTrendingVideos } from '../hooks/useTrendingVideos';
import VideoList from './VideoList';

interface TrendingLoaderProps {
  setVideos: (videos: VideoItem[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const TrendingLoader: React.FC<TrendingLoaderProps> = ({ setVideos, setIsLoading }) => {
  const observer = useRef<IntersectionObserver>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error
  } = useTrendingVideos();

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetching, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setIsLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setIsLoading]);

  useEffect(() => {
    if (data?.pages) {
      const allVideos = data.pages.flatMap(page => page.videos);
      setVideos(allVideos);
    }
  }, [data, setVideos]);

  if (isError) {
    console.error('Error loading trending videos:', error);
    return null;
  }

  return null;
};

export default TrendingLoader;
