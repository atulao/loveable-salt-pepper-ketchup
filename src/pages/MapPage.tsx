
import React from 'react';
import CampusMap from '@/components/map/CampusMap';

const MapPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-njit-navy mb-6">Campus Map</h1>
      <CampusMap />
    </div>
  );
};

export default MapPage;
