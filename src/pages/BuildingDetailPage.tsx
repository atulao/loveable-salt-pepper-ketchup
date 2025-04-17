
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Info, Users, Coffee } from 'lucide-react';
import { fetchBuildingById } from '@/lib/api/buildings';
import { Building } from '@/data/mockBuildings';

const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadBuilding = async () => {
      if (id) {
        try {
          const data = await fetchBuildingById(id);
          setBuilding(data);
        } catch (error) {
          console.error('Error loading building:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadBuilding();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-njit-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading building information...</p>
        </div>
      </div>
    );
  }
  
  if (!building) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium text-gray-700 mb-2">Building Not Found</h3>
          <p className="text-gray-500 mb-6">
            The building you're looking for does not exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/buildings">Back to Buildings</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/buildings">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Buildings
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            {building.image && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={building.image} 
                  alt={building.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{building.name}</CardTitle>
                <span className="inline-block bg-njit-navy text-white px-2 py-1 text-sm rounded">
                  {building.code}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <p className="text-gray-700">{building.description}</p>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <p className="text-gray-700">{building.address}</p>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-700">Departments</h4>
                    <ul className="list-disc pl-5 mt-1">
                      {building.departments.map((dept, index) => (
                        <li key={index} className="text-gray-700">{dept}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Coffee className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-700">Amenities</h4>
                    <ul className="list-disc pl-5 mt-1">
                      {building.amenities.map((amenity, index) => (
                        <li key={index} className="text-gray-700">{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center mb-4">
                <p className="text-gray-500 text-center px-4">
                  Map placeholder <br />
                  (Interactive map coming soon)
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full">Directions to Here</Button>
                <Button variant="outline" className="w-full">View on Campus Map</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetailPage;
