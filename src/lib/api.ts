
/**
 * Functions for fetching data from the NJIT Campus Labs API
 */

import { Event } from '@/data/mockEvents';

/**
 * Fetches events from the NJIT Campus Labs API via our server-side proxy
 */
export async function fetchEvents(query: string = ''): Promise<Event[]> {
  try {
    // Construct the URL for our Next.js API
    const apiUrl = new URL('/api/events', window.location.origin);
    
    if (query) {
      apiUrl.searchParams.append('query', query);
    }
    
    console.log("Fetching from Next.js API:", apiUrl.toString());
    
    // Make the request to our Next.js API instead of directly to NJIT
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Next.js API error (${response.status}): ${response.statusText}`);
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.value?.length || 0} events from Next.js API`);
    
    // Transform the API response to match our Event interface
    return transformApiEvents(data.value || []);
  } catch (error) {
    console.error('Error fetching from Next.js API:', error);
    throw error; // Rethrow to handle in the component
  }
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
