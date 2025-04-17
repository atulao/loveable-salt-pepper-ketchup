
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { CAMPUS_BUILDING_COORDINATES } from '@/lib/locationUtils';

const CampusMap: React.FC = () => {
  return (
    <Card className="w-full h-[500px] overflow-hidden shadow-lg">
      <CardContent className="p-0 h-full relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700">Interactive Campus Map Coming Soon</h3>
            <p className="text-gray-500 mt-2 mb-4">
              Our map will feature all {Object.keys(CAMPUS_BUILDING_COORDINATES).length} campus locations
            </p>
            <div className="flex items-center justify-center text-njit-red">
              <MapPin className="h-6 w-6 mr-2" />
              <span className="font-medium">NJIT Campus: 40.7424, -74.1784</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampusMap;
