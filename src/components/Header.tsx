import React, { useState } from 'react';
import { Music } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const focusedBorderClass = isSearchFocused ? 'border-accent' : 'border-secondary';

  return (
    <header className="bg-primary px-4 py-3 shadow-retro">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <Music className="w-8 h-8 text-accent mr-2" />
          <h1 className="font-press-start text-2xl text-accent">MujiK Player</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full sm:w-2/3 md:w-1/2 flex">
          <div className={`relative w-full bg-white border-4 ${focusedBorderClass} px-3 py-2 rounded-l-md shadow-retro flex-grow transition-all duration-300`}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for music..."
              className="w-full font-vt323 text-xl text-textColor focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-opacity-80 active:translate-y-1 
                      border-4 border-secondary px-4 py-2 rounded-r-md 
                      font-press-start text-textColor shadow-retro
                      transition-all duration-150 transform"
          >
            GO!
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;