
import { useState, useEffect, useCallback } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination({ totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItemsState, setTotalItemsState] = useState(totalItems);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItemsState / itemsPerPage));
  
  // Reset to page 1 when total items changes significantly
  useEffect(() => {
    setTotalItemsState(totalItems);
  }, [totalItems]);
  
  // Make sure current page is within bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Calculate page range to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItemsState - 1);
  
  const paginateItems = <T>(items: T[]): T[] => {
    // Ensure we're not trying to slice beyond the array bounds
    if (!items || items.length === 0) return [];
    
    // Log pagination info for debugging
    console.log(`Paginating items. Total: ${items.length}, Page: ${currentPage}, Start: ${startIndex}, End: ${Math.min(startIndex + itemsPerPage, items.length)}`);
    
    return items.slice(startIndex, Math.min(startIndex + itemsPerPage, items.length));
  };
  
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage !== currentPage) {
      console.log(`Going to page ${validPage} of ${totalPages} (total items: ${totalItemsState})`);
      setCurrentPage(validPage);
      
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  }, [currentPage, totalPages, totalItemsState]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);
  
  // Add a function to update totalItems from outside
  const setTotalItems = useCallback((count: number) => {
    console.log(`Setting total items: ${count}`);
    setTotalItemsState(count);
  }, []);
  
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
    totalItems: totalItemsState,
    setTotalItems
  };
}
