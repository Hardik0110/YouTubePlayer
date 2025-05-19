import React from 'react';
import { Music } from 'lucide-react';
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

const presets: Record<string, Record<string, string>> = categories.reduce((acc, label, i) => {
  const colors = [
    { '--stone-800': '#3A59D1', '--stone-50': '#7AC6D2', '--yellow-400': '#B5FCCD' },
    { '--stone-800': '#3D90D7', '--stone-50': '#B5FCCD', '--yellow-400': '#3A59D1' },
    { '--stone-800': '#7AC6D2', '--stone-50': '#3A59D1', '--yellow-400': '#3D90D7' },
    { '--stone-800': '#B5FCCD', '--stone-50': '#3D90D7', '--yellow-400': '#7AC6D2' }
  ];
  acc[label] = colors[i % colors.length];
  return acc;
}, {} as Record<string, Record<string, string>>);

const activeColors: Record<string, string> = {
  '--stone-800': '#2707f2',
  '--stone-50': '#e0e5ff',
  '--yellow-400': '#d1d9ff'
};

const CategoryBar: React.FC<CategoryBarProps> = ({ onCategorySelect, activeCategory }) => (
  <div className="bg-secondary/50 backdrop-blur-sm border-b border-secondary/30">
    <div className="container mx-auto px-4">
      <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide">
        {categories.map(label => {
          const isActive = activeCategory === label;
          const varColors = isActive ? activeColors : presets[label];
          return (
            <Button
              key={label}
              onClick={() => onCategorySelect(label)}
              varColors={varColors}
              className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive ? '' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  </div>
);

export default CategoryBar; 