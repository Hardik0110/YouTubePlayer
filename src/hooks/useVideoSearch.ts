import { useState } from 'react';
import { VideoItem } from '../types';
import { searchVideos } from '../services/youtubeApi';
import useStore from '../stores/store';

export const useVideoSearch = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<VideoItem[]>([]);
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSearch: storeHandleSearch, setVideos, setIsLoading: storeSetIsLoading } = useStore();

  const handleCategorySelect = async (category: string) => {
    try {
      setIsLoading(true);
      storeSetIsLoading(true);
      setActiveCategory(category);
      
      const results = await searchVideos(category);
      if (results) {
        setCategoryVideos(results);
        setVideos(results);
      }
    } catch (error) {
      console.error('Error fetching category videos:', error);
      setCategoryVideos([]);
    } finally {
      setIsLoading(false);
      storeSetIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    try {
      setIsLoading(true);
      storeSetIsLoading(true);
      
      // Clear category when searching
      setActiveCategory(null);
      setCategoryVideos([]);
      
      const results = await searchVideos(term);
      if (results) {
        setSearchResults(results);
        setVideos(results);
      }
      
      // Update store search term
      storeHandleSearch(term);
    } catch (error) {
      console.error('Error searching videos:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      storeSetIsLoading(false);
    }
  };

  return {
    activeCategory,
    categoryVideos,
    searchResults,
    isLoading,
    handleCategorySelect,
    handleSearch,
  };
};