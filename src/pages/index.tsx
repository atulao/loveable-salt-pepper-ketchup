
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Calendar, Building, Info } from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      title: 'Campus Map',
      description: 'Find your way around campus with our interactive map',
      icon: <Map className="h-6 w-6" />,
      link: '/map',
      color: 'bg-blue-100'
    },
    {
      title: 'Campus Events',
      description: 'Stay up to date with all campus events and activities',
      icon: <Calendar className="h-6 w-6" />,
      link: '/events',
      color: 'bg-green-100'
    },
    {
      title: 'Buildings Directory',
      description: 'Information about campus buildings and facilities',
      icon: <Building className="h-6 w-6" />,
      link: '/buildings',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-njit-navy mb-2">
            NJIT Campus Compass
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your guide to navigating New Jersey Institute of Technology
          </p>
        </header>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`p-3 rounded-full inline-flex ${feature.color} mb-3`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={feature.link}>
                      Explore
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
