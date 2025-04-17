import React, { useState } from 'react'
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

  // pagination hook uses the totalCount returned from the server
  const {
    currentPage,
    totalPages,
    goToPage,
    itemsPerPage,
  } = usePagination({
    totalItems: 0,    // placeholder, will override below
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

  // whenever totalCount changes, let the pagination hook know
  React.useEffect(() => {
    // override totalItems in the pagination hook
    // this will also reset currentPage→1 if totalCount shrinks below
    goToPage(1) // keep UX simple: jump back to page 1 whenever the overall count changes
  }, [totalCount])

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
        events={events}
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
