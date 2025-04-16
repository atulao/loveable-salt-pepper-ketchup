
import React from 'react';
import { Car, Home } from 'lucide-react';

interface PersonaToggleProps {
  persona: 'commuter' | 'resident';
  setPersona: (persona: 'commuter' | 'resident') => void;
}

const PersonaToggle: React.FC<PersonaToggleProps> = ({ persona, setPersona }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Mode:</span>
      <div className="flex p-1 bg-gray-100 rounded-full">
        <button
          onClick={() => setPersona('commuter')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all ${
            persona === 'commuter'
              ? 'bg-white text-njit-red shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Car size={16} className="mr-2" />
          Commuter
        </button>
        
        <button
          onClick={() => setPersona('resident')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all ${
            persona === 'resident'
              ? 'bg-white text-njit-red shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={16} className="mr-2" />
          Resident
        </button>
      </div>
    </div>
  );
};

export default PersonaToggle;
