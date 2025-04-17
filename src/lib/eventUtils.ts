
import { Event } from '@/hooks/useEvents';

// Helper function to strip HTML tags
const stripHtml = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Filter events based on search query
export const filterEventsByQuery = (events: Event[], query: string): Event[] => {
  if (!query) return events;
  
  const normalizedQuery = query.toLowerCase();
  
  return events.filter(event => {
    // Create a plain text version of the description for searching
    let plainTextDescription = stripHtml(event.description);
    
    return (
      event.title.toLowerCase().includes(normalizedQuery) ||
      plainTextDescription.toLowerCase().includes(normalizedQuery) ||
      event.location.toLowerCase().includes(normalizedQuery) ||
      event.categories.some(category => category.toLowerCase().includes(normalizedQuery)) ||
      // Check food-related terms for "pizza" searches
      (normalizedQuery.includes('pizza') && event.has_free_food) ||
      (normalizedQuery.includes('food') && event.has_free_food)
    );
  });
};

// Filter events based on selected categories
export const filterEventsByCategories = (events: Event[], categories: string[]): Event[] => {
  if (!categories.length) return events;
  
  return events.filter(event => {
    return event.categories.some(category => categories.includes(category));
  });
};

// Filter events based on free food availability
export const filterEventsByFreeFood = (events: Event[], hasFreeFood: boolean): Event[] => {
  if (!hasFreeFood) return events;
  
  return events.filter(event => event.has_free_food);
};

// Filter events based on user persona (Commuter or Resident)
export const filterEventsByPersona = (events: Event[], persona: 'commuter' | 'resident'): Event[] => {
  if (!persona || events.length === 0) return events;

  if (persona === 'commuter') {
    // Prioritize daytime events, events with food, and commuter-specific activities
    return events.filter(event => {
      const isCommuter = event.categories.includes('Commuter');
      const hasFreeFood = event.has_free_food;
      
      // Check if it's a daytime event (between 8AM and 5PM)
      const startTime = event.time;
      const isDaytime = startTime?.includes('AM') || 
                        (startTime?.includes('PM') && 
                         parseInt(startTime.split(':')[0]) < 5);
      
      return isCommuter || hasFreeFood || isDaytime;
    });
  } else {
    // For resident mode, prioritize residence hall events and evening activities
    return events.filter(event => {
      const isResident = event.categories.includes('Resident');
      
      // Check if it's an evening event (after 5PM)
      const startTime = event.time;
      const isEvening = startTime?.includes('PM') && 
                        parseInt(startTime.split(':')[0]) >= 5;
      
      return isResident || isEvening;
    });
  }
};

// Process natural language queries to extract intent and parameters
export const processNaturalLanguageQuery = (query: string): { 
  processedQuery: string;
  categories: string[];
  hasFreeFood: boolean;
} => {
  const normalizedQuery = query.toLowerCase();
  const result = {
    processedQuery: query,
    categories: [] as string[],
    hasFreeFood: false
  };
  
  // Check for food-related queries
  if (
    normalizedQuery.includes('food') || 
    normalizedQuery.includes('pizza') || 
    normalizedQuery.includes('breakfast') || 
    normalizedQuery.includes('lunch') || 
    normalizedQuery.includes('dinner') || 
    normalizedQuery.includes('snack') ||
    normalizedQuery.includes('eat')
  ) {
    result.categories.push('Food');
    
    // If specifically looking for free food
    if (normalizedQuery.includes('free')) {
      result.hasFreeFood = true;
    }
  }
  
  // Check for free food specifically
  if (
    normalizedQuery.includes('free food') || 
    normalizedQuery.includes('free pizza') || 
    normalizedQuery.includes('free breakfast') || 
    normalizedQuery.includes('free lunch') || 
    normalizedQuery.includes('free dinner') || 
    normalizedQuery.includes('free snack')
  ) {
    result.hasFreeFood = true;
  }
  
  // Explicitly set hasFreeFood to true for pizza searches
  if (normalizedQuery.includes('pizza')) {
    result.hasFreeFood = true;
  }
  
  // Check for academic events
  if (
    normalizedQuery.includes('class') || 
    normalizedQuery.includes('study') || 
    normalizedQuery.includes('lecture') || 
    normalizedQuery.includes('professor') || 
    normalizedQuery.includes('academic') || 
    normalizedQuery.includes('course') ||
    normalizedQuery.includes('tutoring') ||
    normalizedQuery.includes('workshop')
  ) {
    result.categories.push('Academic');
  }
  
  // Check for career events
  if (
    normalizedQuery.includes('career') || 
    normalizedQuery.includes('job') || 
    normalizedQuery.includes('internship') || 
    normalizedQuery.includes('resume') || 
    normalizedQuery.includes('interview') || 
    normalizedQuery.includes('network') ||
    normalizedQuery.includes('fair')
  ) {
    result.categories.push('Career');
  }
  
  // Check for social events
  if (
    normalizedQuery.includes('social') || 
    normalizedQuery.includes('party') || 
    normalizedQuery.includes('meet') || 
    normalizedQuery.includes('friend') || 
    normalizedQuery.includes('fun') || 
    normalizedQuery.includes('hang out')
  ) {
    result.categories.push('Social');
  }
  
  // Check for technology events
  if (
    normalizedQuery.includes('tech') || 
    normalizedQuery.includes('coding') || 
    normalizedQuery.includes('programming') || 
    normalizedQuery.includes('computer') || 
    normalizedQuery.includes('software') || 
    normalizedQuery.includes('hardware') ||
    normalizedQuery.includes('hackathon')
  ) {
    result.categories.push('Technology');
  }
  
  return result;
};
