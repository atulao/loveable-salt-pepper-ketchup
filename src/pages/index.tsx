
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import PersonaToggle from '@/components/PersonaToggle';
import CategoryFilter from '@/components/CategoryFilter';
import EventList from '@/components/EventList';
import { Event, events } from '@/data/mockEvents';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood,
  filterEventsByPersona,
  getRecommendedEvents,
  semanticSearchEvents
} from '@/lib/eventUtils';

const Index: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState(false);
  const [persona, setPersona] = useState<'commuter' | 'resident'>('commuter');
  
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  
  // State for tracking viewed events (for recommendations)
  const [viewedEventIds, setViewedEventIds] = useState<string[]>([]);
  
  // State for user interests (could be persisted in localStorage in a real app)
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  // Apply filters whenever search parameters change
  useEffect(() => {
    let result = [...events];
    
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
  }, [searchQuery, selectedCategories, showFreeFood, persona, viewedEventIds, userInterests]);
  
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
  
  // Track viewed events for recommendation engine
  const handleEventView = (eventId: string) => {
    if (!viewedEventIds.includes(eventId)) {
      setViewedEventIds(prev => [...prev, eventId]);
      
      // Update user interests based on viewed event
      const viewedEvent = events.find(e => e.id === eventId);
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
          <EventList 
            events={filteredEvents} 
            searchQuery={searchQuery}
            onEventView={handleEventView}
          />
        </section>
      </div>
    </div>
  );
};

export default Index;
