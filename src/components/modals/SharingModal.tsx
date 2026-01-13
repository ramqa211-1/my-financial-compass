import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, User, Shield, Eye, Edit, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type PermissionType = 'admin' | 'editor' | 'viewer';

interface SharedUser {
  id: string;
  email: string;
  name: string;
  permission: PermissionType;
}

const SharingModal = () => {
  const { isSettingsOpen, setIsSettingsOpen } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<PermissionType>('editor');
  const [loading, setLoading] = useState(false);

  const loadSharedUsers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          *,
          shared_user:auth.users!user_permissions_shared_with_user_id_fkey(email, raw_user_meta_data)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform data
      const users = data?.map(item => ({
        id: item.shared_with_user_id,
        email: item.shared_user?.email || '',
        name: item.shared_user?.raw_user_meta_data?.full_name || item.shared_user?.email || '',
        permission: item.permission_type as PermissionType,
      })) || [];
      
      setSharedUsers(users);
    } catch (error: any) {
      console.error('Error loading shared users:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון משתמשים משותפים',
        variant: 'destructive',
      });
    }
  };

  const handleAddUser = async () => {
    if (!user || !email) return;
    
    setLoading(true);
    try {
      // First, try to find if user already exists by checking if they have any permissions
      // We can't directly query auth.users, so we'll use a workaround:
      // Check if there's already a permission for this email in pending_invitations
      const { data: existingInvitation } = await supabase
        .from('pending_invitations')
        .select('*')
        .eq('user_id', user.id)
        .eq('invited_email', email.toLowerCase())
        .single();

      if (existingInvitation) {
        toast({
          title: 'הזמנה כבר קיימת',
          description: `הזמנה עבור ${email} כבר נשלחה בעבר`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Create pending invitation
      const { error: insertError } = await supabase
        .from('pending_invitations')
        .insert({
          user_id: user.id,
          invited_email: email.toLowerCase(),
          permission_type: permission,
        });

      if (insertError) {
        // If it's a unique constraint error, invitation already exists
        if (insertError.code === '23505') {
          toast({
            title: 'הזמנה כבר קיימת',
            description: `הזמנה עבור ${email} כבר נשלחה בעבר`,
            variant: 'destructive',
          });
        } else {
          throw insertError;
        }
        setLoading(false);
        return;
      }

      toast({
        title: 'הזמנה נשלחה!',
        description: `המשתמש ${email} יוכל לראות את הנתונים לאחר שיתחבר עם Google עם אותו email.`,
      });

      setEmail('');
      setPermission('editor');
      loadSharedUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'שגיאה',
        description: error.message || 'לא ניתן להוסיף משתמש',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', user.id)
        .eq('shared_with_user_id', userId);

      if (error) throw error;

      toast({
        title: 'הוסר בהצלחה',
        description: 'המשתמש הוסר מהשיתוף',
      });

      loadSharedUsers();
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן להסיר משתמש',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePermission = async (userId: string, newPermission: PermissionType) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_permissions')
        .update({ permission_type: newPermission })
        .eq('user_id', user.id)
        .eq('shared_with_user_id', userId);

      if (error) throw error;

      toast({
        title: 'עודכן בהצלחה',
        description: 'ההרשאות עודכנו',
      });

      loadSharedUsers();
    } catch (error: any) {
      console.error('Error updating permission:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לעדכן הרשאות',
        variant: 'destructive',
      });
    }
  };

  const getPermissionIcon = (permission: PermissionType) => {
    switch (permission) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'editor':
        return <Edit className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
    }
  };

  const getPermissionLabel = (permission: PermissionType) => {
    switch (permission) {
      case 'admin':
        return 'מנהל';
      case 'editor':
        return 'עורך';
      case 'viewer':
        return 'צופה';
    }
  };

  // Open sharing modal from settings
  if (isSettingsOpen && !isSharingOpen) {
    setIsSharingOpen(true);
    loadSharedUsers();
  }

  return (
    <AnimatePresence>
      {isSharingOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => {
            setIsSharingOpen(false);
            setIsSettingsOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">שיתוף והרשאות</h2>
                    <p className="text-sm text-muted-foreground">נהל מי יכול לראות ולערוך את הנתונים שלך</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSharingOpen(false);
                    setIsSettingsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Add User Form */}
              <div className="mb-6 p-4 rounded-xl bg-muted/50">
                <h3 className="font-semibold text-foreground mb-4">הוסף משתמש</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Label htmlFor="email">כתובת מייל</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permission">הרשאה</Label>
                    <Select value={permission} onValueChange={(value) => setPermission(value as PermissionType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            צופה
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            עורך
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            מנהל
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleAddUser}
                  disabled={loading || !email}
                  className="w-full mt-4"
                >
                  <UserPlus className="h-4 w-4 ml-2" />
                  הוסף משתמש
                </Button>
              </div>

              {/* Shared Users List */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">משתמשים משותפים</h3>
                {sharedUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>אין משתמשים משותפים</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sharedUsers.map((sharedUser) => (
                      <div
                        key={sharedUser.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{sharedUser.name}</p>
                            <p className="text-sm text-muted-foreground">{sharedUser.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={sharedUser.permission}
                            onValueChange={(value) => handleUpdatePermission(sharedUser.id, value as PermissionType)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  צופה
                                </div>
                              </SelectItem>
                              <SelectItem value="editor">
                                <div className="flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  עורך
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  מנהל
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(sharedUser.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharingModal;

