
import React from 'react';
import { Event } from '@/data/mockEvents';
import EventCard from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';

interface EventListProps {
  events: Event[];
  searchQuery: string;
  onEventView?: (eventId: string) => void;
  loading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, searchQuery, onEventView, loading = false }) => {
  const handleEventView = (eventId: string) => {
    if (onEventView) {
      onEventView(eventId);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
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
            : 'No events available. Try adjusting your filters or check back later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} onClick={() => handleEventView(event.id)}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventList;
