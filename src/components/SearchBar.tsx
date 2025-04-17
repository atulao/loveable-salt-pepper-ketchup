
import React, { useState, useEffect } from 'react';
import { Search, Mic } from 'lucide-react';
import { processNaturalLanguageQuery, semanticSearchEvents } from '@/lib/eventUtils';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Event } from '@/data/mockEvents';
import { useToast } from '@/hooks/use-toast';
import { fetchEvents } from '@/lib/api';

interface SearchBarProps {
  onSearch: (query: string, categories: string[], hasFreeFood: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const { toast } = useToast();

  // Load initial events for suggestions
  useEffect(() => {
    const loadInitialEvents = async () => {
      try {
        console.log('SearchBar: Loading initial events for suggestions');
        
        // Use our API utility function
        const events = await fetchEvents('');
        
        if (events.length > 0) {
          setRecentEvents(events.slice(0, 10)); // Keep the 10 most recent events
          setFetchError(false);
        } else {
          setFetchError(true);
          console.log('SearchBar: No events returned for suggestions');
        }
      } catch (error) {
        console.error('Failed to load initial events for suggestions:', error);
        setFetchError(true);
        setRecentEvents([]);
        
        toast({
          title: "Suggestion loading failed",
          description: "We couldn't load event suggestions. Search will still work.",
          variant: "default",
        });
      }
    };

    loadInitialEvents();
  }, [toast]);

  // Generate search suggestions based on user input
  useEffect(() => {
    if (query.trim().length > 2 && recentEvents.length > 0) {
      // Find matching events using semantic search
      const matchingEvents = semanticSearchEvents(recentEvents, query);
      
      // Extract suggestions from matching events
      const newSuggestions = matchingEvents
        .slice(0, 5)
        .map(event => event.title)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
      
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, recentEvents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery(query);
      onSearch(processedQuery, categories, hasFreeFood);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery(suggestion);
    onSearch(processedQuery, categories, hasFreeFood);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (query.trim().length > 2) {
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!query) {
        setIsExpanded(false);
      }
      setShowSuggestions(false);
    }, 200);
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
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <Command className="rounded-lg border shadow-md">
              <CommandList>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem 
                      key={index}
                      onSelect={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer"
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
        
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-500 px-4 animate-fade-in">
            <p>Try: "Where can I get free pizza today?" or "Evening tech events this week"</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
