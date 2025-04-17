
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// This is a placeholder for the actual map implementation
// We'll use a mapping library like Leaflet or Mapbox in a future iteration
const CampusMap: React.FC = () => {
  return (
    <Card className="w-full h-[500px] overflow-hidden shadow-lg">
      <CardContent className="p-0 h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">Campus Map Coming Soon</h3>
          <p className="text-gray-500 mt-2">
            Interactive campus map with building locations and navigation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampusMap;
