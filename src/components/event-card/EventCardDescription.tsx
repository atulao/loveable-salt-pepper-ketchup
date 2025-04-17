
import React from 'react';

interface EventCardDescriptionProps {
  description: string;
}

const EventCardDescription: React.FC<EventCardDescriptionProps> = ({ description }) => {
  // Function to strip HTML tags from description
  const stripHtml = (html: string): string => {
    // Create a temporary div element
    const tempDiv = document.createElement('div');
    // Set the HTML content
    tempDiv.innerHTML = html;
    // Return the text content
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const cleanDescription = stripHtml(description);

  return (
    <div className="mt-4 animate-fade-in">
      <p className="text-gray-700">{cleanDescription}</p>
    </div>
  );
};

export default EventCardDescription;
