
import React from 'react';

interface EventCardCategoriesProps {
  categories: string[];
}

const EventCardCategories: React.FC<EventCardCategoriesProps> = ({ categories }) => {
  return (
    <div className="mt-3 flex flex-wrap gap-1">
      {categories.map((category) => (
        <span 
          key={category} 
          className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
        >
          {category}
        </span>
      ))}
    </div>
  );
};

export default EventCardCategories;
