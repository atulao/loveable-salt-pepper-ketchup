
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';

interface EventListProps {
  events: Event[];
  searchQuery: string;
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  searchQuery, 
  isLoading,
  totalCount,
  currentPage,
  itemsPerPage
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-medium text-gray-700 mb-2">Loading events...</h3>
      </div>
    );
  }
  
  if (events.length === 0) {
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
  
  // Debug log
  console.log(`Displaying events ${start}-${end} of ${totalCount}`);

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
