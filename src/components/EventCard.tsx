
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, ChevronUp, Share2, Plus, Download } from 'lucide-react';
import { Event } from '@/data/mockEvents';
import { useToast } from '@/hooks/use-toast';
import { 
  generateCalendarUrls,
  downloadICalFile
} from '@/lib/calendarUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

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

  const handleAddToCalendar = (e: React.MouseEvent, calendarType: 'google' | 'apple' | 'outlook') => {
    e.stopPropagation();
    
    const calendarUrls = generateCalendarUrls(
      event.title,
      event.description,
      event.location,
      event.date,
      event.time,
      event.endTime
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
        event.endTime
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        expanded ? 'ring-2 ring-njit-navy' : 'hover:shadow-lg'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {event.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          {event.hasFreeFood && (
            <div className="absolute top-0 right-0 bg-njit-red text-white py-1 px-3 rounded-bl-lg font-medium text-sm">
              Free Food
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-njit-navy">{event.title}</h3>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-njit-red" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 text-njit-red" />
            <span>{event.time} - {event.endTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 text-njit-red" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {event.categories.map((category) => (
            <span 
              key={category} 
              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              {category}
            </span>
          ))}
        </div>
        
        {expanded && (
          <div className="mt-4 animate-fade-in">
            <p className="text-gray-700">{event.description}</p>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="flex items-center text-sm text-gray-600 hover:text-njit-red transition-colors"
                onClick={handleShare}
              >
                <Share2 size={16} className="mr-1" />
                Share
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center text-sm text-gray-600 hover:text-njit-red transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus size={16} className="mr-1" />
                    Add to Calendar
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={(e) => handleAddToCalendar(e, 'google')}>
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAddToCalendar(e, 'apple')}>
                    Apple Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAddToCalendar(e, 'outlook')}>
                    Outlook Calendar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        
        <button 
          className="w-full mt-4 flex items-center justify-center text-sm text-njit-navy hover:text-njit-red transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" />
              Show More
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
