
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-njit-navy text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Salt-Pepper-Ketchup
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-njit-red transition-colors">
              Home
            </Link>
            <Link to="/map" className="hover:text-njit-red transition-colors">
              Campus Map
            </Link>
            <Link to="/buildings" className="hover:text-njit-red transition-colors">
              Buildings
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">{user.email}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:text-njit-red"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User size={16} className="mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-3">
            <Link 
              to="/" 
              className="block py-2 hover:text-njit-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="block py-2 hover:text-njit-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Campus Map
            </Link>
            <Link 
              to="/buildings" 
              className="block py-2 hover:text-njit-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Buildings
            </Link>
            
            {user ? (
              <>
                <div className="py-2 text-sm">{user.email}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:text-njit-red"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block py-2 hover:text-njit-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" size="sm">
                  <User size={16} className="mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
