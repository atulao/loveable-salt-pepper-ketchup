import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Calendar, Building, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventList from '@/components/EventList';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PersonaToggle from '@/components/PersonaToggle';
import EventPagination from '@/components/EventPagination';
import { useEvents, Event } from '@/hooks/useEvents';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/contexts/AuthContext';
import { 
  filterEventsByQuery, 
  filterEventsByCategories, 
  filterEventsByFreeFood
} from '@/lib/eventUtils';

const ITEMS_PER_PAGE = 20;

const Index: React.FC = () => {
  // Get events from Supabase
  const { events, isLoading } = useEvents();
  const { persona } = useAuth();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFreeFood, setShowFreeFood] = useState(false);
  
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Setup pagination
  const pagination = usePagination({
    totalItems: filteredEvents.length || (events?.length || 0),
    itemsPerPage: ITEMS_PER_PAGE
  });
  
  // Get paginated events
  const paginatedEvents = pagination.paginateItems(filteredEvents.length > 0 ? filteredEvents : (events || []));
  
  // Apply filters whenever search parameters change
  useEffect(() => {
    if (!events) return;
    
    let result = [...events];
    
    // Apply search query filter first
    if (searchQuery) {
      result = filterEventsByQuery(result, searchQuery);
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = filterEventsByCategories(result, selectedCategories);
    }
    
    // Apply free food filter
    if (showFreeFood) {
      result = filterEventsByFreeFood(result, showFreeFood);
    }
    
    setFilteredEvents(result);
  }, [searchQuery, selectedCategories, showFreeFood, events]);
  
  // Handle search submission
  const handleSearch = (query: string, categories: string[], hasFreeFood: boolean) => {
    setSearchQuery(query);
    
    // Set categories from natural language processing if any were detected
    if (categories.length > 0) {
      setSelectedCategories(categories);
    }
    
    // Set free food filter if detected in query
    if (hasFreeFood) {
      setShowFreeFood(true);
    }
  };

  // Navigation cards for other features
  const features = [
    {
      title: 'Campus Map',
      description: 'Find your way around campus with our interactive map',
      icon: <Map className="h-6 w-6" />,
      link: '/map',
      color: 'bg-blue-100'
    },
    {
      title: 'Buildings Directory',
      description: 'Information about campus buildings and facilities',
      icon: <Building className="h-6 w-6" />,
      link: '/buildings',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-njit-navy mb-2">
            Salt-Pepper-Ketchup
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your guide to navigating New Jersey Institute of Technology
          </p>
        </header>
        
        {/* Main Events Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-njit-navy mb-6">Campus Events</h2>
          
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="mb-6">
            <PersonaToggle />
            
            <CategoryFilter 
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              showFreeFood={showFreeFood}
              setShowFreeFood={setShowFreeFood}
            />
          </div>
          
          <EventList 
            events={paginatedEvents} 
            searchQuery={searchQuery}
            isLoading={isLoading}
            totalCount={filteredEvents.length || (events?.length || 0)}
          />
          
          <EventPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
          />
        </section>
        
        {/* Other Features Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-njit-navy mb-6">Explore Campus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`p-3 rounded-full inline-flex ${feature.color} mb-3`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={feature.link}>
                      Explore
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
