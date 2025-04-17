
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

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
  const [imageError, setImageError] = useState(false);
  // Use a default placeholder image if no image is provided or if error loading
  const fallbackImage = '/placeholder.svg';
  
  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={imageError || !imageUrl ? fallbackImage : imageUrl}
        alt={title} 
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
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
