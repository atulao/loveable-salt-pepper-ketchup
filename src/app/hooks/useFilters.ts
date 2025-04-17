
import { useState, useEffect } from 'react';
import { Event } from '@/data/mockEvents';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood,
  filterEventsByPersona,
  getRecommendedEvents,
  semanticSearchEvents
} from '@/lib/eventUtils';

export function useFilters(allEvents: Event[], persona: 'commuter' | 'resident', viewedEventIds: string[], userInterests: string[]) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState<boolean>(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    showFreeFood,
    setShowFreeFood,
    filteredEvents
  };
}
