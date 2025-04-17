
import { useState, useEffect } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination({ totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Reset to page 1 when filters change and total items count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);
  
  // Make sure current page is within bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Calculate page range to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  
  const paginateItems = <T>(items: T[]): T[] => {
    // Ensure we're not trying to slice beyond the array bounds
    if (!items || items.length === 0) return [];
    
    // Log pagination info for debugging
    console.log(`Paginating items. Total: ${items.length}, Page: ${currentPage}, Start: ${startIndex}, End: ${Math.min(startIndex + itemsPerPage, items.length)}`);
    
    return items.slice(startIndex, Math.min(startIndex + itemsPerPage, items.length));
  };
  
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      console.log(`Going to page ${validPage} of ${totalPages} (total items: ${totalItems})`);
      
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    paginateItems,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
    totalItems
  };
}
