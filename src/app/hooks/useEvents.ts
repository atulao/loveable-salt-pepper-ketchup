
import { useState } from 'react';
import { Event } from '@/data/mockEvents';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents as apiFetchEvents } from '@/lib/api';

/**
 * Hook for fetching events from the NJIT Campus Labs API
 */
export function useEvents(initialQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { toast } = useToast();

  const { data: events = [], isLoading: loading, error } = useQuery({
    queryKey: ['events', searchQuery],
    queryFn: () => apiFetchEvents(searchQuery),
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
