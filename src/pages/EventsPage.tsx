
import React, { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PersonaToggle from '@/components/PersonaToggle';
import EventPagination from '@/components/EventPagination';
import { useEvents, Event } from '@/hooks/useEvents';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood
} from '@/lib/eventUtils';

const ITEMS_PER_PAGE = 20;

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
  
  // Setup pagination
  const pagination = usePagination({
    totalItems: filteredEvents.length || (events?.length || 0),
    itemsPerPage: ITEMS_PER_PAGE
  });
  
  // Get paginated events
  const paginatedEvents = pagination.paginateItems(filteredEvents.length > 0 ? filteredEvents : (events || []));
  
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

  useEffect(() => {
    // Log the total number of events for debugging
    console.log(`Total events: ${events?.length || 0}`);
    console.log(`Filtered events: ${filteredEvents.length}`);
    console.log(`Items per page: ${ITEMS_PER_PAGE}`);
    console.log(`Current page: ${pagination.currentPage}`);
    console.log(`Total pages: ${pagination.totalPages}`);
  }, [events, filteredEvents, pagination.currentPage, pagination.totalPages]);

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
        events={paginatedEvents} 
        searchQuery={searchQuery}
        isLoading={isLoading}
        totalCount={filteredEvents.length || (events?.length || 0)}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
      />
      
      <EventPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
      />
    </div>
  );
};

export default EventsPage;
