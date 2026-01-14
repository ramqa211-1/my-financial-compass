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
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/3e0eb858-a1e3-4b8e-952d-5a749aabbdcd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:11',message:'handleGoogleLogin entry',data:{origin:window.location.origin,baseUrl:import.meta.env.BASE_URL,fullUrl:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Use Vite's BASE_URL to handle GitHub Pages subdirectory
      const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/3e0eb858-a1e3-4b8e-952d-5a749aabbdcd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:17',message:'redirectUrl calculated',data:{redirectUrl,redirectUrlLength:redirectUrl.length,hasSpaces:redirectUrl.includes(' '),trimmed:redirectUrl.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const trimmedRedirectUrl = redirectUrl.trim();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/3e0eb858-a1e3-4b8e-952d-5a749aabbdcd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:22',message:'Before signInWithOAuth',data:{redirectTo:trimmedRedirectUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: trimmedRedirectUrl,
        },
      });

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/3e0eb858-a1e3-4b8e-952d-5a749aabbdcd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:30',message:'After signInWithOAuth',data:{error:error?.message,hasError:!!error,url:data?.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      if (error) throw error;
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/3e0eb858-a1e3-4b8e-952d-5a749aabbdcd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:35',message:'Error caught',data:{errorMessage:err?.message,errorStack:err?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
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

