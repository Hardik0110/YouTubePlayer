import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import Button from './ui/Button';

interface CategoryBarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string | null;
}

const categories = [
  'Podcast', 'Rock', 'Hip Hop', 'R&B', 'Bollywood',
  'Upbeat', 'Devayat Khawad', 'Romance', 'Feel Good',
  'Sad', 'Energize', 'Party', 'Chill', 'Workout'
];

const CategoryBar: React.FC<CategoryBarProps> = ({ onCategorySelect, activeCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(`${category} music`); // Add 'music' to make search more relevant
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
          {categories.map((label, index) => {
            const isActive = activeCategory === label;
            return (
              <Button
                key={label}
                variant="category"
                scheme={(index % 4 + 1) as 1 | 2 | 3 | 4}
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