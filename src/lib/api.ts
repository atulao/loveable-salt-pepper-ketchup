
/**
 * Functions for fetching data from the NJIT Campus Labs API
 */

import { Event } from '@/data/mockEvents';
import { mockEvents } from '@/data/mockEvents';

const API_BASE_URL = 'https://njit.campuslabs.com/engage/api/discovery';

/**
 * Fetches events from the NJIT Campus Labs API
 */
export async function fetchEvents(query: string = ''): Promise<Event[]> {
  try {
    // Construct the URL for the NJIT API
    const apiUrl = new URL(`${API_BASE_URL}/event/search`);
    apiUrl.searchParams.append('endsAfter', new Date().toISOString());
    apiUrl.searchParams.append('orderByField', 'endsOn');
    apiUrl.searchParams.append('orderByDirection', 'ascending');
    apiUrl.searchParams.append('status', 'Approved');
    apiUrl.searchParams.append('take', '100');
    
    if (query) {
      apiUrl.searchParams.append('query', query);
    }
    
    console.log("Fetching from NJIT API:", apiUrl.toString());
    
    // Make the request
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
    });
    
    if (!response.ok) {
      console.error(`NJIT API error (${response.status}): ${response.statusText}`);
      console.log("Falling back to mock data due to API error");
      return mockEvents;
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.value?.length || 0} events from NJIT API`);
    
    // Transform the API response to match our Event interface
    return transformApiEvents(data.value || []);
  } catch (error) {
    console.error('Error fetching from NJIT API:', error);
    console.log("Falling back to mock data due to API error");
    return mockEvents; // Return mock data as fallback
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
