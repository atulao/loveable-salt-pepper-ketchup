
import { useState } from 'react';

export function usePersona() {
  const [persona, setPersona] = useState<'commuter' | 'resident'>('commuter');
  
  const togglePersona = () => {
    setPersona(prev => prev === 'commuter' ? 'resident' : 'commuter');
  };
  
  return {
    persona,
    setPersona,
    togglePersona
  };
}
