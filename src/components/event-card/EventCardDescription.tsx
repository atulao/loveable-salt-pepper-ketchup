
import React from 'react';

interface EventCardDescriptionProps {
  description: string;
}

const EventCardDescription: React.FC<EventCardDescriptionProps> = ({ description }) => {
  return (
    <div className="mt-4 animate-fade-in">
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default EventCardDescription;
