
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  end_time: string;
  categories: string[];
  has_free_food: boolean;
  image_url?: string;
  created_at: string;
  created_by?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'events' 
      }, (payload) => {
        // Refresh events when there's a change
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setEvents(data || []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (newEvent: Omit<Event, 'id' | 'created_at' | 'created_by'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...newEvent,
            created_by: user?.id,
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      setEvents(prev => [...prev, ...(data || [])]);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error adding event:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      setEvents(prev => prev.map(event => event.id === id ? { ...event, ...updates } : event));
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setEvents(prev => prev.filter(event => event.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    events, 
    isLoading, 
    error, 
    fetchEvents, 
    addEvent, 
    updateEvent, 
    deleteEvent 
  };
};
