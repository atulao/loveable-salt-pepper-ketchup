
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import PersonaToggle from '@/components/PersonaToggle';
import CategoryFilter from '@/components/CategoryFilter';
import EventList from '@/components/EventList';
import { Event } from '@/data/mockEvents';
import { fetchEvents } from '@/lib/api';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood,
  filterEventsByPersona,
  getRecommendedEvents,
  semanticSearchEvents
} from '@/lib/eventUtils';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState(false);
  const [persona, setPersona] = useState<'commuter' | 'resident'>('commuter');
  
  // State for events
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Toast notifications
  const { toast } = useToast();
  
  // State for tracking viewed events (for recommendations)
  const [viewedEventIds, setViewedEventIds] = useState<string[]>([]);
  
  // State for user interests (could be persisted in localStorage in a real app)
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const events = await fetchEvents();
        setAllEvents(events);
        setLoading(false);
        
        if (events.length === 0) {
          setError('No events found. Please try again later.');
          toast({
            title: "No events found",
            description: "We couldn't load any events at this time. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Error loading events. Please try again later.');
        toast({
          title: "Error loading events",
          description: "Could not load events from the API. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
        setAllEvents([]);
      }
    };
    
    loadEvents();
  }, [toast]);
  
  // Apply filters whenever search parameters or events change
  useEffect(() => {
    if (allEvents.length === 0) return;
    
    let result = [...allEvents];
    
    // Apply persona filter
    result = filterEventsByPersona(result, persona);
    
    // Apply search query filter - use semantic search if query is complex
    if (searchQuery) {
      if (searchQuery.split(' ').length > 2) {
        // Use semantic search for more complex queries
        result = semanticSearchEvents(result, searchQuery);
      } else {
        // Use regular filter for simple queries
        result = filterEventsByQuery(result, searchQuery);
      }
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = filterEventsByCategories(result, selectedCategories);
    }
    
    // Apply free food filter
    if (showFreeFood) {
      result = filterEventsByFreeFood(result, showFreeFood);
    }
    
    // If no filters are applied, show recommended events
    if (!searchQuery && selectedCategories.length === 0 && !showFreeFood) {
      const recommended = getRecommendedEvents(result, viewedEventIds, userInterests, persona);
      // Mix some recommended events with regular events
      result = [...recommended.slice(0, 3), ...result.filter(e => !recommended.slice(0, 3).some(r => r.id === e.id))];
    }
    
    setFilteredEvents(result);
  }, [searchQuery, selectedCategories, showFreeFood, persona, viewedEventIds, userInterests, allEvents]);
  
  // Handle search submission
  const handleSearch = async (query: string, categories: string[], hasFreeFood: boolean) => {
    setSearchQuery(query);
    
    // Set categories from natural language processing if any were detected
    if (categories.length > 0) {
      setSelectedCategories(categories);
    }
    
    // Set free food filter if detected in query
    if (hasFreeFood) {
      setShowFreeFood(true);
    }
    
    // If there's a query, fetch more specific results from the API
    if (query) {
      setLoading(true);
      setError(null);
      try {
        const events = await fetchEvents(query);
        setAllEvents(events);
        setLoading(false);
        
        if (events.length === 0) {
          toast({
            title: "No results found",
            description: `We couldn't find any events matching "${query}". Try a different search term.`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Failed to fetch events with query:', error);
        setError('Search failed. Please try again.');
        toast({
          title: "Search failed",
          description: "Could not search for events. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };
  
  // Track viewed events for recommendation engine
  const handleEventView = (eventId: string) => {
    if (!viewedEventIds.includes(eventId)) {
      setViewedEventIds(prev => [...prev, eventId]);
      
      // Update user interests based on viewed event
      const viewedEvent = allEvents.find(e => e.id === eventId);
      if (viewedEvent) {
        setUserInterests(prev => {
          const newInterests = [...prev];
          viewedEvent.categories.forEach(category => {
            if (!newInterests.includes(category)) {
              newInterests.push(category);
            }
          });
          return newInterests;
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-njit-navy mb-2">
            Salt-Pepper-Ketchup
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find your perfect campus event at NJIT
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </header>
        
        <section className="mb-8">
          <PersonaToggle 
            persona={persona} 
            setPersona={setPersona} 
          />
          
          <CategoryFilter 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            showFreeFood={showFreeFood}
            setShowFreeFood={setShowFreeFood}
          />
        </section>
        
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-njit-red"></div>
              <span className="ml-3 text-lg text-gray-600">Loading events...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium text-gray-700 mb-2">Something went wrong</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => fetchEvents()}
                className="bg-njit-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <EventList 
              events={filteredEvents} 
              searchQuery={searchQuery}
              onEventView={handleEventView}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
