
import React, { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PersonaToggle from '@/components/PersonaToggle';
import { useEvents, Event } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood
} from '@/lib/eventUtils';

const EventsPage: React.FC = () => {
  // Get events from Supabase
  const { events, isLoading, error, fetchEvents } = useEvents();
  const { persona } = useAuth();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState(false);
  
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Apply filters whenever search parameters change
  useEffect(() => {
    if (!events) return;
    
    let result = [...events];
    
    // Apply search query filter first
    if (searchQuery) {
      result = filterEventsByQuery(result, searchQuery);
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = filterEventsByCategories(result, selectedCategories);
    }
    
    // Apply free food filter
    if (showFreeFood) {
      result = filterEventsByFreeFood(result, showFreeFood);
    }
    
    // Don't apply persona-based filtering by default
    // This ensures all events are shown
    
    setFilteredEvents(result);
  }, [searchQuery, selectedCategories, showFreeFood, events]);
  
  // Handle search submission
  const handleSearch = (query: string, categories: string[], hasFreeFood: boolean) => {
    setSearchQuery(query);
    
    // Set categories from natural language processing if any were detected
    if (categories.length > 0) {
      setSelectedCategories(categories);
    }
    
    // Set free food filter if detected in query
    if (hasFreeFood) {
      setShowFreeFood(true);
    }
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 max-w-[1600px]">
      <h1 className="text-3xl font-bold text-njit-navy mb-6">Campus Events</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-6">
        <PersonaToggle />
        
        <CategoryFilter 
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          showFreeFood={showFreeFood}
          setShowFreeFood={setShowFreeFood}
        />
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading NJIT campus events...</span>
        </div>
      )}
      
      <EventList 
        events={filteredEvents.length > 0 ? filteredEvents : events || []} 
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EventsPage;
