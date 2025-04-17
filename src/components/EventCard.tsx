
import React from 'react';
import { Event } from '@/hooks/useEvents';
import { useEventCard } from '@/hooks/useEventCard';

// Import our components
import EventCardHeader from './event-card/EventCardHeader';
import EventCardImage from './event-card/EventCardImage';
import EventCardDetails from './event-card/EventCardDetails';
import EventCardCategories from './event-card/EventCardCategories';
import EventCardDescription from './event-card/EventCardDescription';
import EventCardActions from './event-card/EventCardActions';
import EventCardExpander from './event-card/EventCardExpander';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    expanded,
    favorited,
    handleShare,
    handleGetDirections,
    handleAddToCalendar,
    handleToggleFavorite,
    handleExpand,
    setExpanded
  } = useEventCard(event);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        expanded ? 'ring-2 ring-njit-navy' : 'hover:shadow-lg'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <EventCardImage 
        imageUrl={event.image_url}
        title={event.title}
        hasFreeFood={event.has_free_food}
      />
      
      <div className="p-4">
        <EventCardHeader 
          event={event}
          favorited={favorited}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <EventCardDetails event={event} />
        
        <EventCardCategories categories={event.categories} />
        
        {expanded && (
          <>
            <EventCardDescription description={event.description} />
            
            <EventCardActions 
              onShare={handleShare}
              onGetDirections={handleGetDirections}
              onAddToCalendar={handleAddToCalendar}
            />
          </>
        )}
        
        <EventCardExpander 
          expanded={expanded}
          onClick={handleExpand}
        />
      </div>
    </div>
  );
};

export default EventCard;
