
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';

interface EventListProps {
  events: Event[];
  searchQuery: string;
  isLoading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, searchQuery, isLoading }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
