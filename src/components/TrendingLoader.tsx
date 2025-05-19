import React, { useEffect, useRef, useCallback } from 'react';
import { VideoItem } from '../types';
import { useTrendingVideos } from '../hooks/useTrendingVideos';

interface TrendingLoaderProps {
  onVideosLoaded: (videos: VideoItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  onLastVideoRef: (ref: (node: HTMLDivElement | null) => void) => void;
}

interface TrendingPage {
  videos: VideoItem[];
  nextPageToken?: string;
}

const TrendingLoader: React.FC<TrendingLoaderProps> = ({ 
  onVideosLoaded, 
  setIsLoading,
  onLastVideoRef
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useTrendingVideos();

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetching) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    onLastVideoRef(lastVideoRef);
  }, [lastVideoRef, onLastVideoRef]);

  useEffect(() => {
    if (data?.pages) {
      const allVideos = data.pages.flatMap((page: TrendingPage) => page.videos);
      onVideosLoaded(allVideos);
    }
  }, [data, onVideosLoaded]);

  useEffect(() => {
    setIsLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setIsLoading]);

  return null;
};

export default TrendingLoader;