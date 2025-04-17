
import { useState, useCallback } from 'react';
import { processNaturalLanguageQuery } from '@/lib/eventUtils';

export function useSearch(onSearch: (query: string, categories: string[], hasFreeFood: boolean) => void) {
  const [query, setQuery] = useState('');
  
  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      const { processedQuery, categories, hasFreeFood } = processNaturalLanguageQuery(searchQuery);
      onSearch(processedQuery, categories, hasFreeFood);
    } else {
      // If query is empty, search with empty string
      onSearch('', [], false);
    }
  }, [onSearch]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSearch(query);
  }, [query, handleSearch]);

  return {
    query,
    setQuery: handleQueryChange,
    handleSearch,
    handleSubmit
  };
}
