
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
    setIsLoading(true)
    setError(null)

    try {
      console.log(`Fetching events - page: ${page}, itemsPerPage: ${itemsPerPage}`)
      
      // build your base query
      let q = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('date', { ascending: true })

      // apply filters
      if (searchQuery) {
        q = q
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }
      
      if (selectedCategories && selectedCategories.length) {
        q = q.contains('categories', selectedCategories)
      }
      
      if (showFreeFood) {
        q = q.eq('has_free_food', true)
      }

      // Calculate pagination range
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      console.log(`Pagination: from=${from}, to=${to}`)
      
      const { data, error: dbError, count } = await q.range(from, to)
      
      if (dbError) throw dbError

      console.log(`Fetched ${data?.length || 0} events, total count: ${count || 0}`)
      
      setEvents(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      console.error("Error fetching events:", err)
      setError(err.message || 'Error loading events')
      toast({
        title: 'Error loading events',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, itemsPerPage, searchQuery, selectedCategories, showFreeFood, toast])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  return { events, totalCount, isLoading, error, refetch: fetchPage }
}
