
import { useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination({ totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Make sure current page is within bounds
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  
  // Calculate page range to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  
  const paginateItems = <T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex + 1);
  };
  
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };
  
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    paginateItems,
    goToPage,
    nextPage,
    prevPage
  };
}
