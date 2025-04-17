
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-njit-navy text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          NJIT Campus Compass
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-njit-red transition-colors">
            Home
          </Link>
          <Link to="/map" className="hover:text-njit-red transition-colors">
            Campus Map
          </Link>
          <Link to="/events" className="hover:text-njit-red transition-colors">
            Events
          </Link>
          <Link to="/buildings" className="hover:text-njit-red transition-colors">
            Buildings
          </Link>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu />
        </Button>
      </div>
    </header>
  );
};

export default Header;
