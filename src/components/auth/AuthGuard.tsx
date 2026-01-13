import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from './LoginPage';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean; // Allow optional auth - if false, show app even without auth
}

const AuthGuard = ({ children, requireAuth = false }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  // If auth is required and user is not logged in, show login page
  if (requireAuth && !user) {
    return <LoginPage />;
  }

  // Otherwise, show the app (works with or without auth)
  return <>{children}</>;
};

export default AuthGuard;

