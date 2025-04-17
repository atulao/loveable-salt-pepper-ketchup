
import React, { useState, useEffect } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { usePagination } from '@/hooks/usePagination'
import EventList from '@/components/EventList'
import EventPagination from '@/components/EventPagination'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import PersonaToggle from '@/components/PersonaToggle'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

const ITEMS_PER_PAGE = 20

const EventsPage: React.FC = () => {
  // filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFreeFood, setShowFreeFood] = useState(false)
  const [shouldResetPage, setShouldResetPage] = useState(false)

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
  const { events, totalCount, isLoading, error, refetch } = useEvents(
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
    }
  }, [totalCount, setTotalItems])

  // Handle resetting to page 1 when filters change
  useEffect(() => {
    if (shouldResetPage && currentPage !== 1) {
      goToPage(1)
      setShouldResetPage(false)
    }
  }, [shouldResetPage, currentPage, goToPage])

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShouldResetPage(true)
  }

  // Handle category changes
  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories)
    setShouldResetPage(true)
  }

  // Handle free food toggle
  const handleFreeFoodToggle = (value: boolean) => {
    setShowFreeFood(value)
    setShouldResetPage(true)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Campus Events</h1>

      <SearchBar onSearch={handleSearch} />

      <PersonaToggle />

      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={handleCategoriesChange}
        showFreeFood={showFreeFood}
        setShowFreeFood={handleFreeFoodToggle}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => refetch()} 
              className="px-3 py-1 bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors flex items-center gap-2"
            >
              <ReloadIcon className="h-4 w-4" />
              Retry
            </button>
          </AlertDescription>
        </Alert>
      )}

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
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}

export default EventsPage
