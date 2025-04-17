
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { buildings } from '@/data/mockBuildings';
import { Building, MapPin, Info, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CAMPUS_BUILDING_COORDINATES, BUILDING_NAME_ALIASES, getDirectionsUrl } from '@/lib/locationUtils';

const BuildingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingsList, setBuildingsList] = useState<Array<{name: string, code: string, coordinates: [number, number]}>>([]);
  
  useEffect(() => {
    // Extract unique buildings from the coordinate data
    const processedBuildings = new Map();
    
    // Process main building coordinates
    Object.entries(CAMPUS_BUILDING_COORDINATES).forEach(([name, coordinates]) => {
      // Skip variants, rooms, and special locations
      if (
        name.includes('Room') || 
        name.includes('Lounge') || 
        name.includes('Kitchen') || 
        name.includes('Atrium') || 
        name.includes('Lobby') || 
        name.includes('Ballroom') ||
        name === 'NJIT Campus' ||
        name.includes('Glass') ||
        name.includes('Floor')
      ) {
        return;
      }
      
      // Create a simplified name for comparison (remove "Hall", "Building", "Center", etc.)
      const simpleName = name.replace(/\s+(Hall|Building|Center|Residence|Parking|Field).*$/i, '').trim();
      
      // Only add if we haven't added this building already (by simplified name)
      if (!processedBuildings.has(simpleName)) {
        // Get building code if available
        let code = '';
        for (const [alias, fullName] of Object.entries(BUILDING_NAME_ALIASES)) {
          if (fullName === name && alias.length <= 5) {
            code = alias;
            break;
          }
        }
        
        processedBuildings.set(simpleName, {
          name,
          code,
          coordinates
        });
      }
    });
    
    // Convert map to array and sort alphabetically
    const buildingsArray = Array.from(processedBuildings.values())
      .sort((a, b) => a.name.localeCompare(b.name));
    
    setBuildingsList(buildingsArray);
  }, []);
  
  // Filter buildings based on search query
  const filteredBuildings = buildingsList.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-njit-navy mb-6">NJIT Campus Buildings</h1>
      
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
        {filteredBuildings.map((building, index) => {
          // Try to find this building in the mock data for additional info
          const mockBuilding = buildings.find(b => 
            b.name.includes(building.name) || building.name.includes(b.name)
          );
          
          return (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
              {mockBuilding?.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={mockBuilding.image} 
                    alt={building.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{building.name}</CardTitle>
                  {building.code && (
                    <span className="inline-block bg-njit-navy text-white px-2 py-1 text-sm rounded">
                      {building.code}
                    </span>
                  )}
                </div>
                {mockBuilding && <CardDescription>{mockBuilding.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    {building.coordinates[0].toFixed(6)}, {building.coordinates[1].toFixed(6)}
                  </p>
                </div>
                
                {mockBuilding && mockBuilding.departments.length > 0 && (
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      <strong>Departments:</strong> {mockBuilding.departments.slice(0, 2).join(', ')}
                      {mockBuilding.departments.length > 2 && '...'}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="mt-auto pt-3">
                <div className="flex gap-2 w-full">
                  <Button asChild variant="outline" className="flex-1">
                    <a 
                      href={getDirectionsUrl(building.name)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      Directions
                    </a>
                  </Button>
                  
                  {mockBuilding && (
                    <Button asChild variant="secondary" className="flex-1">
                      <Link to={`/buildings/${mockBuilding.id}`} className="flex items-center justify-center">
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Details
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
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
