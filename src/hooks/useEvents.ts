
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Define the Event interface
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  end_time?: string;
  location?: string;
  organizer?: string;
  organization?: string;
  image_url?: string;
  categories: string[];
  has_free_food: boolean;
  created_at?: string;
}

// Helper function to build the Supabase query with filters
const buildEventsQuery = (
  searchQuery: string = '',
  selectedCategories: string[] = [],
  showFreeFood: boolean = false
) => {
  // Start with the base query
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('date', { ascending: true });

  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }
  
  // Apply category filter if any categories are selected
  if (selectedCategories && selectedCategories.length > 0) {
    query = query.contains('categories', selectedCategories);
  }
  
  // Apply free food filter if requested
  if (showFreeFood) {
    query = query.eq('has_free_food', true);
  }

  return query;
}

export const useEvents = (
  page: number = 1,
  itemsPerPage: number = 20,
  searchQuery: string = '',
  selectedCategories: string[] = [],
  showFreeFood: boolean = false
) => {
  const [events, setEvents] = useState<Event[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching events - page: ${page}, itemsPerPage: ${itemsPerPage}`);
      
      // Build the query with all filters
      const query = buildEventsQuery(searchQuery, selectedCategories, showFreeFood);
      
      // Calculate pagination range
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      console.log(`Pagination: from=${from}, to=${to}`);
      
      // Execute the query with pagination
      const { data, error: dbError, count } = await query.range(from, to);
      
      if (dbError) throw dbError;

      console.log(`Fetched ${data?.length || 0} events, total count: ${count || 0}`);
      
      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error("Error fetching events:", err);
      setError(err.message || 'Error loading events');
      toast({
        title: 'Error loading events',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, itemsPerPage, searchQuery, selectedCategories, showFreeFood, toast]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { 
    events, 
    totalCount, 
    isLoading, 
    error, 
    refetch: fetchPage,
    currentPage: page
  };
}
