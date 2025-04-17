
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { buildings } from '@/data/mockBuildings';
import { Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BuildingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter buildings based on search query
  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-njit-navy mb-6">Campus Buildings</h1>
      
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search buildings by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-6 text-lg rounded-lg"
          />
          <Building className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuildings.map((building) => (
          <Card key={building.id} className="overflow-hidden transition-all hover:shadow-lg">
            {building.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={building.image} 
                  alt={building.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{building.name}</CardTitle>
                <span className="inline-block bg-njit-navy text-white px-2 py-1 text-sm rounded">
                  {building.code}
                </span>
              </div>
              <CardDescription>{building.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Address:</strong> {building.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Departments:</strong> {building.departments.join(', ')}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/buildings/${building.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium text-gray-700 mb-2">No buildings found</h3>
          <p className="text-gray-500">
            No buildings match your search criteria. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuildingsPage;
