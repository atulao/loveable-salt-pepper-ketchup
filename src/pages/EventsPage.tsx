
import React from 'react';
import EventList from '@/components/EventList';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PersonaToggle from '@/components/PersonaToggle';
import { events } from '@/data/mockEvents';
import { useState, useEffect } from 'react';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood,
  filterEventsByPersona
} from '@/lib/eventUtils';
import { Event } from '@/data/mockEvents';

const EventsPage: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState(false);
  const [persona, setPersona] = useState<'commuter' | 'resident'>('commuter');
  
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  
  // Apply filters whenever search parameters change
  useEffect(() => {
    let result = [...events];
    
    // Apply persona filter
    result = filterEventsByPersona(result, persona);
    
    // Apply search query filter
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
  }, [searchQuery, selectedCategories, showFreeFood, persona]);
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-njit-navy mb-6">Campus Events</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-8">
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
      </div>
      
      <EventList 
        events={filteredEvents} 
        searchQuery={searchQuery} 
      />
    </div>
  );
};

export default EventsPage;
