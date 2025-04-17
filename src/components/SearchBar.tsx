
import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { processNaturalLanguageQuery } from '@/lib/eventUtils';

interface SearchBarProps {
  onSearch: (query: string, categories: string[], hasFreeFood: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery(query);
      onSearch(processedQuery, categories, hasFreeFood);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            className="w-full py-3 pl-10 pr-12 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-njit-red focus:border-transparent transition-all"
            placeholder="What's happening on campus?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          <button
            type="button"
            className="absolute right-3 text-gray-400 hover:text-njit-red transition-colors"
            aria-label="Voice search"
          >
            <Mic size={20} />
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-500 px-4 animate-fade-in">
            <p>Try: "Where can I get free pizza today?" or "When is the next tutoring session?"</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
