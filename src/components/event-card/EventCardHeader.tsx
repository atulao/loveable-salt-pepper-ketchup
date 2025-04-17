
import React from 'react';
import { Heart } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';

interface EventCardHeaderProps {
  event: Event;
  favorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const EventCardHeader: React.FC<EventCardHeaderProps> = ({ 
  event, 
  favorited, 
  onToggleFavorite 
}) => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-start gap-2">
      <h3 className="text-lg font-semibold text-njit-navy line-clamp-2">{event.title}</h3>
      {user && (
        <button 
          onClick={onToggleFavorite}
          className={`p-1 rounded-full flex-shrink-0 ${favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} fill={favorited ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
};

export default EventCardHeader;
