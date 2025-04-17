
import React, { useState, useRef } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { processNaturalLanguageQuery } from '@/lib/eventUtils';

interface SearchBarProps {
  onSearch: (query: string, categories: string[], hasFreeFood: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Even if the query is empty, process it to reset the filters
    const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery(query);
    onSearch(processedQuery, categories, hasFreeFood);
    console.log(`Searching for: "${processedQuery}", Categories: ${categories.join(', ')}, Free Food: ${hasFreeFood}`);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', [], false);
    if (inputRef.current) {
      inputRef.current.focus();
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

  const handleVoiceSearch = () => {
    // This is a placeholder for voice search functionality
    // In a real implementation, you would use the Web Speech API
    setIsListening(true);
    
    // Simulate voice recognition with a timeout
    setTimeout(() => {
      setIsListening(false);
      setQuery('Show me events with free pizza');
      const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery('Show me events with free pizza');
      onSearch(processedQuery, categories, hasFreeFood);
    }, 2000);
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="w-full py-3 pl-10 pr-16 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-njit-red focus:border-transparent transition-all"
            placeholder="What's happening on campus?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {query && (
            <button
              type="button"
              className="absolute right-12 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
          
          <button
            type="button"
            className={`absolute right-3 transition-colors ${
              isListening 
                ? 'text-red-500 animate-pulse' 
                : 'text-gray-400 hover:text-njit-red'
            }`}
            onClick={handleVoiceSearch}
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
