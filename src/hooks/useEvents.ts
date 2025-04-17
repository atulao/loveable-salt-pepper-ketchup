import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Event } from '@/hooks/useEvents' // your Event interface

export const useEvents = (
  page: number,
  itemsPerPage: number,
  searchQuery: string,
  selectedCategories: string[],
  showFreeFood: boolean
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
      // build your base query
      let q = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('date', { ascending: true })

      // apply the same filters you had client‑side
      if (searchQuery) {
        q = q
          .ilike('title', `%${searchQuery}%`)
          .or(`description.ilike.%${searchQuery}%`)
      }
      if (selectedCategories.length) {
        q = q.contains('categories', selectedCategories)
      }
      if (showFreeFood) {
        q = q.eq('has_free_food', true)
      }

      // now paginate
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      const { data, error: dbError, count } = await q.range(from, to)
      if (dbError) throw dbError

      setEvents(data ?? [])
      setTotalCount(count ?? 0)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      toast({
        title: 'Error loading events',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, itemsPerPage, searchQuery, selectedCategories, showFreeFood, toast])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  return { events, totalCount, isLoading, error }
}
