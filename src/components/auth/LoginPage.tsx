import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-strong p-8 text-center">
          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-8 w-8 text-card" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">המרכז הפיננסי</h1>
          <p className="text-muted-foreground mb-8">ניהול חכם של הכסף שלך</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4"
            size="lg"
          >
            {loading ? 'מתחבר...' : 'התחבר עם Google'}
          </Button>

          <p className="text-xs text-muted-foreground">
            על ידי התחברות, אתה מסכים לתנאי השימוש ומדיניות הפרטיות
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

