
import React, { useState, useEffect } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { usePagination } from '@/hooks/usePagination'
import EventList from '@/components/EventList'
import EventPagination from '@/components/EventPagination'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import PersonaToggle from '@/components/PersonaToggle'

const ITEMS_PER_PAGE = 20

const EventsPage: React.FC = () => {
  // filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFreeFood, setShowFreeFood] = useState(false)

  // pagination state - will be updated after we get data
  const {
    currentPage,
    totalPages,
    goToPage,
    itemsPerPage,
    setTotalItems
  } = usePagination({
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE,
  })

  // fetch exactly one page from Supabase + filters
  const { events, totalCount, isLoading, error } = useEvents(
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedCategories,
    showFreeFood
  )

  // whenever totalCount changes, update the pagination
  useEffect(() => {
    if (totalCount !== undefined) {
      console.log(`Updating pagination with total count: ${totalCount}`)
      setTotalItems(totalCount)
      
      // Only reset to page 1 when filters change, not on initial load
      if (totalCount === 0 && currentPage > 1) {
        goToPage(1)
      }
    }
  }, [totalCount, setTotalItems, goToPage, currentPage])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Campus Events</h1>

      <SearchBar onSearch={q => setSearchQuery(q)} />

      <PersonaToggle />

      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        showFreeFood={showFreeFood}
        setShowFreeFood={setShowFreeFood}
      />

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <EventList
        events={events || []}
        searchQuery={searchQuery}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {totalCount > itemsPerPage && (
        <EventPagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}

export default EventsPage
