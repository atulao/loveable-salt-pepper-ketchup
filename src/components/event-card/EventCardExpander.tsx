
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EventCardExpanderProps {
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const EventCardExpander: React.FC<EventCardExpanderProps> = ({ expanded, onClick }) => {
  return (
    <button 
      className="w-full mt-4 flex items-center justify-center text-sm text-njit-navy hover:text-njit-red transition-colors"
      onClick={onClick}
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
  );
};

export default EventCardExpander;
