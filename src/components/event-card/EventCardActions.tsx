
import React from 'react';
import { Share2, Map, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventCardActionsProps {
  onShare: (e: React.MouseEvent) => void;
  onGetDirections: (e: React.MouseEvent) => void;
  onAddToCalendar: (e: React.MouseEvent, calendarType: 'google' | 'apple' | 'outlook') => void;
}

const EventCardActions: React.FC<EventCardActionsProps> = ({ 
  onShare, 
  onGetDirections, 
  onAddToCalendar 
}) => {
  return (
    <div className="mt-4 flex flex-wrap justify-end space-x-2">
      <button 
        className="flex items-center text-sm text-gray-600 hover:text-njit-red transition-colors"
        onClick={onShare}
      >
        <Share2 size={16} className="mr-1" />
        Share
      </button>
      
      <button 
        className="flex items-center text-sm text-gray-600 hover:text-njit-red transition-colors"
        onClick={onGetDirections}
      >
        <Map size={16} className="mr-1" />
        Directions
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
          <DropdownMenuItem onClick={(e) => onAddToCalendar(e, 'google')}>
            Google Calendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => onAddToCalendar(e, 'apple')}>
            Apple Calendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => onAddToCalendar(e, 'outlook')}>
            Outlook Calendar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EventCardActions;
