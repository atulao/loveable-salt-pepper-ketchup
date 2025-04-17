
import { Building } from '@/data/mockBuildings';

// This is a placeholder API service that will later be replaced with actual API calls
// Currently using mock data

export const fetchBuildings = async (): Promise<Building[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be replaced with an actual API call
  // For example: return await supabase.from('buildings').select('*')
  
  // For now, import from mock data
  const { buildings } = await import('@/data/mockBuildings');
  return buildings;
};

export const fetchBuildingById = async (id: string): Promise<Building | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { buildings } = await import('@/data/mockBuildings');
  return buildings.find(building => building.id === id) || null;
};
