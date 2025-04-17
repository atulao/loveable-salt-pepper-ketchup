
import React from 'react';

interface EventCardImageProps {
  imageUrl?: string;
  title: string;
  hasFreeFood: boolean;
}

const EventCardImage: React.FC<EventCardImageProps> = ({ 
  imageUrl, 
  title, 
  hasFreeFood 
}) => {
  if (!imageUrl) return null;
  
  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      {hasFreeFood && (
        <div className="absolute top-0 right-0 bg-njit-red text-white py-1 px-3 rounded-bl-lg font-medium text-sm">
          Free Food
        </div>
      )}
    </div>
  );
};

export default EventCardImage;
