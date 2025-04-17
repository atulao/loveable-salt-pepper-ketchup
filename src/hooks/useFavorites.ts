
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('public:favorites')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'favorites',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          fetchFavorites();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('favorites')
        .select('event_id')
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      setFavorites(data.map(fav => fav.event_id));
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }
    
    const isFavorite = favorites.includes(eventId);
    
    try {
      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);
          
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== eventId));
        toast({
          title: "Removed from favorites",
          description: "Event has been removed from your favorites",
        });
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, event_id: eventId }]);
          
        if (error) throw error;
        
        setFavorites(prev => [...prev, eventId]);
        toast({
          title: "Added to favorites",
          description: "Event has been added to your favorites",
        });
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.includes(eventId);
  };

  return { 
    favorites, 
    isLoading, 
    toggleFavorite, 
    isFavorite 
  };
};
