
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/hooks/useEvents';

interface EventCardDetailsProps {
  event: Event;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center text-gray-600">
        <Calendar size={16} className="mr-2 text-njit-red" />
        <span>{formatDate(event.date)}</span>
      </div>
      
      <div className="flex items-center text-gray-600">
        <Clock size={16} className="mr-2 text-njit-red" />
        <span>{event.time} - {event.end_time || 'TBD'}</span>
      </div>
      
      <div className="flex items-center text-gray-600">
        <MapPin size={16} className="mr-2 text-njit-red" />
        <span className="truncate">{event.location || 'TBD'}</span>
      </div>
      
      {(event.organization || event.organizer) && (
        <div className="flex items-center text-gray-600">
          <Users size={16} className="mr-2 text-njit-red" />
          <span className="truncate">Hosted by: {event.organization || event.organizer || 'Unknown'}</span>
        </div>
      )}
    </div>
  );
};

export default EventCardDetails;
