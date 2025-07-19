import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasRedirected) {
      if (requireAuth && !isAuthenticated) {
        setHasRedirected(true);
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        setHasRedirected(true);
        router.replace('/dashboard/user');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, hasRedirected]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until auth check is complete
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
