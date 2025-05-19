import React from 'react';
import { Music } from 'lucide-react';

interface CategoryBarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string | null;
}

const categories = [
  { id: 'podcast', label: 'Podcast' },
  { id: 'rock', label: 'Rock' },
  { id: 'hiphop', label: 'Hip Hop' },
  { id: 'rnb', label: 'R&B' },
  { id: 'bollywood', label: 'Bollywood' },
  { id: 'upbeat', label: 'Upbeat' },
  { id: 'devayat', label: 'Devayat Khawad' },
  { id: 'romance', label: 'Romance' },
  { id: 'feelgood', label: 'Feel Good' },
  { id: 'sad', label: 'Sad' },
  { id: 'energize', label: 'Energize' },
  { id: 'party', label: 'Party' },
  { id: 'chill', label: 'Chill' },
  { id: 'workout', label: 'Workout' },
  { id: 'focus', label: 'Focus' },
];

const CategoryBar: React.FC<CategoryBarProps> = ({ onCategorySelect, activeCategory }) => {
  return (
    <div className="bg-secondary/50 backdrop-blur-sm border-b border-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.label)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${
                  activeCategory === category.label
                    ? 'bg-blue-500 text-white shadow-lg shadow-accent/40'
                    : 'bg-secondary/30 text-white/80 hover:bg-secondary/50 hover:text-white'
                }
              `}
            >
              <Music className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar; 