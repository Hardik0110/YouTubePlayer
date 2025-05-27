import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import Button from './ui/Button';
import { searchVideos } from '../services/youtubeApi';
import { VideoItem } from '../types';

interface CategoryBarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string | null;
  onVideosLoaded: (videos: VideoItem[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const categories = [
  'Podcast', 'Rock', 'Hip Hop', 'R&B', 'Bollywood',
  'Upbeat', 'Devayat Khawad', 'Romance', 'Feel Good',
  'Sad', 'Energize', 'Party', 'Chill', 'Workout'
];

const CategoryBar: React.FC<CategoryBarProps> = ({ 
  onCategorySelect, 
  activeCategory,
  onVideosLoaded,
  setIsLoading 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = async (category: string) => {
    try {
      if (typeof setIsLoading === 'function') {
        setIsLoading(true);
      }
      const categoryQuery = `${category} music`;
      onCategorySelect(categoryQuery);
      const videos = await searchVideos(categoryQuery);
      if (videos && onVideosLoaded) {
        onVideosLoaded(videos);
      }
    } catch (error) {
      console.error('Error fetching category videos:', error);
    } finally {
      if (typeof setIsLoading === 'function') {
        setIsLoading(false);
      }
    }
  };

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-secondary/50 backdrop-blur-sm border-b border-secondary/30">
      <div className="container mx-auto px-2 flex items-center relative">
        <Button
          onClick={() => scroll(-200)}
          className="p-1 bg-button-base text-button-text hover:bg-button-hover"
        >
          <ChevronLeft size={24} />
        </Button>

        <div
          ref={scrollRef}
          className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide mx-2"
        >
          {categories.map((label) => {
            const isActive = activeCategory === `${label} music`;
            return (
              <Button
                key={label}
                variant="category"
                isActive={isActive}
                onClick={() => handleCategoryClick(label)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Music className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            );
          })}
        </div>

        <Button
          onClick={() => scroll(200)}
          className="p-1 bg-button-base text-button-text hover:bg-button-hover"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default CategoryBar;