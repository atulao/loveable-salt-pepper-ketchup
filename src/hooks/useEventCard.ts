
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/hooks/useEvents';
import { 
  generateCalendarUrls,
  downloadICalFile
} from '@/lib/calendarUtils';
import { getDirectionsUrl } from '@/lib/locationUtils';

export const useEventCard = (event: Event) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(event.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(`${event.title} - ${event.date} at ${event.time} - ${event.location}`);
      toast({
        title: "Copied to clipboard",
        description: "Event details have been copied to clipboard",
      });
    }
  };
  
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const directionsUrl = getDirectionsUrl(event.location);
    window.open(directionsUrl, '_blank');
    toast({
      title: "Opening directions",
      description: "Google Maps is opening with directions to this location",
    });
  };

  const handleAddToCalendar = (e: React.MouseEvent, calendarType: 'google' | 'apple' | 'outlook') => {
    e.stopPropagation();
    
    const calendarUrls = generateCalendarUrls(
      event.title,
      event.description,
      event.location,
      event.date,
      event.time,
      event.end_time
    );
    
    if (calendarType === 'google') {
      window.open(calendarUrls.google, '_blank');
      toast({
        title: "Adding to Google Calendar",
        description: "Event details have been sent to Google Calendar",
      });
    } else if (calendarType === 'apple') {
      downloadICalFile(
        event.title,
        event.description,
        event.location,
        event.date,
        event.time,
        event.end_time
      );
      toast({
        title: "Apple Calendar file downloaded",
        description: "Open the .ics file to add this event to your calendar",
      });
    } else if (calendarType === 'outlook') {
      window.open(calendarUrls.outlook, '_blank');
      toast({
        title: "Adding to Outlook Calendar",
        description: "Event details have been sent to Outlook Calendar",
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return {
    expanded,
    favorited,
    user,
    handleShare,
    handleGetDirections,
    handleAddToCalendar,
    handleToggleFavorite,
    handleExpand,
    setExpanded
  };
};
