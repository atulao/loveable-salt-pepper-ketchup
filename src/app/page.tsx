
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import PersonaToggle from '@/components/PersonaToggle';
import CategoryFilter from '@/components/CategoryFilter';
import EventList from '@/components/EventList';
import { useEvents } from '@/app/hooks/useEvents';
import { useFilters } from '@/app/hooks/useFilters';
import { usePersona } from '@/app/hooks/usePersona';
import { useToast } from '@/hooks/use-toast';

const EventsPage: React.FC = () => {
  // State for tracking viewed events (for recommendations)
  const [viewedEventIds, setViewedEventIds] = useState<string[]>([]);
  
  // State for user interests (could be persisted in localStorage in a real app)
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  // Toast notifications
  const { toast } = useToast();
  
  // Set up persona hook
  const { persona, setPersona } = usePersona();
  
  // Set up events hook
  const { events: allEvents, loading, error, fetchEvents } = useEvents();
  
  // Set up filters hook
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategories, 
    setSelectedCategories, 
    showFreeFood, 
    setShowFreeFood, 
    filteredEvents 
  } = useFilters(allEvents, persona, viewedEventIds, userInterests);
  
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
      try {
        await fetchEvents(query);
      } catch (error) {
        console.error('Failed to fetch events with query:', error);
        toast({
          title: "Search failed",
          description: "Could not search for events. Please try again.",
          variant: "destructive",
        });
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

export default EventsPage;
