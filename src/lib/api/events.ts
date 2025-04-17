
import { Event } from '@/data/mockEvents';

// This is a placeholder API service that will later be replaced with actual API calls
// Currently using mock data

export const fetchEvents = async (): Promise<Event[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be replaced with an actual API call
  // For example: return await supabase.from('events').select('*')
  
  // For now, import from mock data
  const { events } = await import('@/data/mockEvents');
  return events;
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { events } = await import('@/data/mockEvents');
  return events.find(event => event.id === id) || null;
};
