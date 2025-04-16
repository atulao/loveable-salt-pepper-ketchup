
import React from 'react';
import { Book, Briefcase, Coffee, Users, Server } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  showFreeFood: boolean;
  setShowFreeFood: (show: boolean) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  setSelectedCategories,
  showFreeFood,
  setShowFreeFood,
}) => {
  const categories = [
    { name: 'Academic', icon: <Book size={16} /> },
    { name: 'Career', icon: <Briefcase size={16} /> },
    { name: 'Social', icon: <Users size={16} /> },
    { name: 'Technology', icon: <Server size={16} /> },
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => toggleCategory(category.name)}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
            selectedCategories.includes(category.name)
              ? 'bg-njit-navy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1.5">{category.icon}</span>
          {category.name}
        </button>
      ))}
      
      <button
        onClick={() => setShowFreeFood(!showFreeFood)}
        className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
          showFreeFood
            ? 'bg-njit-red text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Coffee size={16} className="mr-1.5" />
        Free Food
      </button>
    </div>
  );
};

export default CategoryFilter;
