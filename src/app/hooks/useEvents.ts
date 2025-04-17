
import { useState, useEffect } from 'react';
import { Event } from '@/data/mockEvents';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching events from the NJIT Campus Labs API
 */
export function useEvents(initialQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { toast } = useToast();

  const fetchEvents = async (query: string = ''): Promise<Event[]> => {
    // Construct the URL for our API route - use app router by default
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
      cache: 'no-store', // Don't cache the results
    });
    
    if (!response.ok) {
      console.error(`useEvents: API error (${response.status}): ${response.statusText}`);
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.value) {
      console.error('useEvents: Invalid response format from API');
      throw new Error('Invalid response format from API');
    }
    
    console.log(`useEvents: Successfully fetched ${data.value?.length || 0} events`);
    
    // Transform the API response to match our Event interface
    return transformApiEvents(data.value || []);
  };

  const { data: events = [], isLoading: loading, error } = useQuery({
    queryKey: ['events', searchQuery],
    queryFn: () => fetchEvents(searchQuery),
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      onError: (err: Error) => {
        console.error('useEvents: Error fetching events:', err);
        toast({
          title: "Error loading events",
          description: "Could not load events from the API. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  return {
    events,
    loading,
    error: error ? (error as Error).message : null,
    fetchEvents: (query: string) => {
      setSearchQuery(query);
    }
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
    
    // Determine if event has free food by checking the description and name
    const hasFreeFood = 
      (apiEvent.description?.toLowerCase().includes('free food') || 
       apiEvent.name?.toLowerCase().includes('free food') ||
       apiEvent.description?.toLowerCase().includes('pizza') ||
       apiEvent.description?.toLowerCase().includes('refreshments') ||
       apiEvent.description?.toLowerCase().includes('food provided')) ?? false;
    
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
