import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FinancialItem } from '@/contexts/AppContext';

export const useFinancialItems = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['financial_items', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('financial_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        name: item.name,
        institution: item.institution,
        productType: item.product_type || '',
        value: typeof item.value === 'number' ? item.value : parseFloat(item.value?.toString() || '0') || 0,
        lastUpdated: item.last_updated || item.last_updated || new Date().toISOString().split('T')[0],
        expiryDate: item.expiry_date || undefined,
        status: item.status as 'active' | 'frozen' | 'expired',
        category: item.category as FinancialItem['category'],
        subcategory: item.subcategory || undefined,
      })) as FinancialItem[];
    },
    enabled: !!userId,
  });

  const addItem = useMutation({
    mutationFn: async (item: Omit<FinancialItem, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('financial_items')
        .insert({
          user_id: user.id,
          name: item.name,
          institution: item.institution,
          product_type: item.productType,
          value: item.value,
          category: item.category,
          subcategory: item.subcategory || null,
          status: item.status,
          expiry_date: item.expiryDate || null,
          last_updated: item.lastUpdated,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_items'] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinancialItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('financial_items')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.institution && { institution: updates.institution }),
          ...(updates.productType && { product_type: updates.productType }),
          ...(updates.value !== undefined && { value: updates.value }),
          ...(updates.category && { category: updates.category }),
          ...(updates.subcategory !== undefined && { subcategory: updates.subcategory || null }),
          ...(updates.status && { status: updates.status }),
          ...(updates.expiryDate && { expiry_date: updates.expiryDate }),
          ...(updates.lastUpdated && { last_updated: updates.lastUpdated }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_items'] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_items'] });
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem: addItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync,
  };
};

