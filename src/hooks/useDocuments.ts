import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Document } from '@/contexts/AppContext';

export const useDocuments = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        category: doc.category as Document['category'],
        uploadDate: doc.upload_date,
        size: doc.size || '0 MB',
      })) as Document[];
    },
    enabled: !!userId,
  });

  const addDocument = useMutation({
    mutationFn: async (doc: Omit<Document, 'id'> & { file?: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let fileUrl: string | null = null;

      // Upload file to Supabase Storage if provided
      if (doc.file) {
        const fileExt = doc.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, doc.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`שגיאה בהעלאת הקובץ: ${uploadError.message}`);
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      // Save document metadata only after file upload succeeds (if file was provided)
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: doc.name,
          type: doc.type,
          category: doc.category,
          file_url: fileUrl,
          upload_date: doc.uploadDate,
          size: doc.size,
        })
        .select()
        .single();

      if (error) {
        // If metadata save fails but file was uploaded, try to delete the file
        if (fileUrl && doc.file) {
          const fileExt = doc.file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          await supabase.storage.from('documents').remove([fileName]);
        }
        throw new Error(`שגיאה בשמירת המסמך: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents,
    isLoading,
    error,
    addDocument: addDocument.mutateAsync,
    deleteDocument: deleteDocument.mutateAsync,
  };
};

