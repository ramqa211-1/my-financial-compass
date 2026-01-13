import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Alert } from '@/contexts/AppContext';

export const useAlerts = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['alerts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(alert => ({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        date: alert.date,
        type: alert.type as 'urgent' | 'warning' | 'info',
        category: alert.category as Alert['category'],
        read: alert.read,
      })) as Alert[];
    },
    enabled: !!userId,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const addAlert = useMutation({
    mutationFn: async (alert: Omit<Alert, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          user_id: user.id,
          title: alert.title,
          description: alert.description,
          date: alert.date,
          type: alert.type,
          category: alert.category,
          read: alert.read,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    alerts,
    isLoading,
    error,
    markAsRead: markAsRead.mutateAsync,
    addAlert: addAlert.mutateAsync,
  };
};

