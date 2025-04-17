
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';
import { Skeleton } from "@/components/ui/skeleton";

interface EventListProps {
  events: Event[];
  searchQuery?: string;
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  searchQuery = '', 
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  itemsPerPage = 20
}) => {
  // Render loading state with skeletons
  if (isLoading) {
    return (
      <div>
        <div className="mb-4 text-sm text-gray-500">Loading events...</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <Skeleton className="w-full h-48" />
              <div className="p-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-medium text-gray-700 mb-2">No events found</h3>
        <p className="text-gray-500">
          {searchQuery 
            ? `No events match "${searchQuery}". Try a different search term.` 
            : 'No events available. Try adjusting your filters.'}
        </p>
      </div>
    );
  }

  // Calculate what to display in the count message
  const start = currentPage && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const end = currentPage && itemsPerPage ? Math.min(start + events.length - 1, totalCount || 0) : events.length;
  
  return (
    <div>
      {totalCount !== undefined && (
        <div className="mb-4 text-sm text-gray-500">
          {totalCount > 0 
            ? `Showing ${start}-${end} of ${totalCount} events` 
            : `No events found`}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
