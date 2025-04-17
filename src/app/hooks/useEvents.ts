
import { useState, useEffect } from 'react';
import { Event } from '@/data/mockEvents';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching events from the NJIT Campus Labs API
 */
export function useEvents(initialQuery: string = '') {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async (query: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct the URL for our API route
      const apiUrl = new URL('/api/events', window.location.origin);
      
      if (query) {
        apiUrl.searchParams.append('query', query);
      }
      
      console.log("useEvents: Fetching from API route:", apiUrl.toString());
      
      // Make the request to our API route
      const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`useEvents: API error (${response.status}): ${response.statusText}`);
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`useEvents: Successfully fetched ${data.value?.length || 0} events`);
      
      // Transform the API response to match our Event interface
      const transformedEvents = transformApiEvents(data.value || []);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('useEvents: Error fetching events:', error);
      setError('Error loading events. Please try again later.');
      toast({
        title: "Error loading events",
        description: "Could not load events from the API. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount with the initial query
  useEffect(() => {
    fetchEvents(initialQuery);
  }, [initialQuery]);

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
}

/**
 * Transforms API events to match our Event interface
 */
function transformApiEvents(apiEvents: any[]): Event[] {
  return apiEvents.map(apiEvent => {
    // Extract date and time information
    const startDate = new Date(apiEvent.startsOn);
    const endDate = new Date(apiEvent.endsOn);
    
    // Format date as YYYY-MM-DD
    const date = startDate.toISOString().split('T')[0];
    
    // Format time as h:mm AM/PM
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    
    // Determine if event has free food by checking the description
    const hasFreeFood = 
      (apiEvent.description?.toLowerCase().includes('free food') || 
       apiEvent.name?.toLowerCase().includes('free food') ||
       apiEvent.description?.toLowerCase().includes('pizza') ||
       apiEvent.description?.toLowerCase().includes('refreshments')) ?? false;
    
    // Determine categories based on themes or include default categories
    const categories = apiEvent.themes?.length > 0 
      ? apiEvent.themes.map((theme: any) => theme.name)
      : ['Campus Event'];
    
    return {
      id: apiEvent.id,
      title: apiEvent.name,
      description: apiEvent.description || 'No description available',
      date,
      time: startTime,
      endTime,
      location: apiEvent.location || 'TBD',
      image: apiEvent.imagePath || null,
      categories,
      hasFreeFood,
      organizerName: apiEvent.organizationName || 'NJIT'
    };
  });
}

/**
 * Formats a date object to a time string (h:mm AM/PM)
 */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
}
