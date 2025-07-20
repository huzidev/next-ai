import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Route configuration for authentication
 */
interface RouteConfig {
  /** Routes that require authentication */
  protected: string[];
  /** Routes that should redirect to dashboard if user is authenticated */
  publicOnly: string[];
  /** Routes that are accessible regardless of auth status */
  public: string[];
}

/**
 * Default route configuration
 * You can easily modify these arrays to add/remove protected routes
 */
const defaultRouteConfig: RouteConfig = {
  // Routes that require user to be logged in
  protected: [
    '/dashboard',
    '/dashboard/user',
    '/dashboard/admin',
    '/settings',
    '/profile',
    '/chat',
    // Add more protected routes here
  ],
  
  // Routes that should redirect logged-in users to dashboard
  publicOnly: [
    '/auth/user/signin',
    '/auth/user/signup', 
    '/auth/user/forgot-password',
    '/auth/user/verify',
    '/auth/user/reset-password',
    '/auth/admin/signin',
    '/auth/admin/signup',
    // Add more auth-only routes here
  ],
  
  // Routes accessible to everyone (no auth restrictions)
  public: [
    '/',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    // Add more public routes here
  ]
};

interface AuthGuardProps {
  children: React.ReactNode;
  /** Custom route configuration (optional) */
  routeConfig?: Partial<RouteConfig>;
  /** Custom redirect path for unauthenticated users */
  loginRedirect?: string;
  /** Custom redirect path for authenticated users */
  dashboardRedirect?: string;
}

/**
 * AuthGuard Component
 * 
 * This component handles all authentication-based routing logic.
 * It checks the current route against the route configuration and
 * redirects users appropriately based on their authentication status.
 * 
 * Usage:
 * - Wrap your entire app or specific pages with this component
 * - Configure routes by modifying the defaultRouteConfig above
 * - Pass custom configuration via props if needed
 */
export function AuthGuard({ 
  children, 
  routeConfig = {},
  loginRedirect = '/',
  dashboardRedirect = '/dashboard/user'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Merge default config with custom config
  const config: RouteConfig = {
    protected: [...defaultRouteConfig.protected, ...(routeConfig.protected || [])],
    publicOnly: [...defaultRouteConfig.publicOnly, ...(routeConfig.publicOnly || [])],
    public: [...defaultRouteConfig.public, ...(routeConfig.public || [])]
  };

  /**
   * Check if current path matches any route in the given array
   * Supports exact matches and prefix matches (for dynamic routes)
   */
  const isRouteMatch = (routes: string[], currentPath: string): boolean => {
    return routes.some(route => {
      // Exact match
      if (route === currentPath) return true;
      
      // Prefix match for dynamic routes (e.g., /dashboard matches /dashboard/user)
      if (currentPath.startsWith(route + '/')) return true;
      
      return false;
    });
  };

  /**
   * Determine what action to take based on current route and auth status
   */
  const getRouteAction = (currentPath: string, isAuth: boolean) => {
    // Check if route is protected (requires authentication)
    if (isRouteMatch(config.protected, currentPath)) {
      return isAuth ? 'allow' : 'redirect-to-login';
    }
    
    // Check if route is public-only (should redirect authenticated users)
    if (isRouteMatch(config.publicOnly, currentPath)) {
      return isAuth ? 'redirect-to-dashboard' : 'allow';
    }
    
    // Check if route is public (accessible to everyone)
    if (isRouteMatch(config.public, currentPath)) {
      return 'allow';
    }
    
    // Default: treat unknown routes as protected
    return isAuth ? 'allow' : 'redirect-to-login';
  };

  useEffect(() => {
    // Don't do anything while authentication is still loading
    if (isLoading) {
      console.log('AuthGuard: Authentication still loading...');
      return;
    }

    // Don't redirect multiple times
    if (hasRedirected) {
      console.log('AuthGuard: Already redirected, skipping...');
      return;
    }

    const currentPath = router.asPath;
    const action = getRouteAction(currentPath, isAuthenticated);

    console.log('AuthGuard: Current path:', currentPath);
    console.log('AuthGuard: Is authenticated:', isAuthenticated);
    console.log('AuthGuard: Action:', action);

    // Handle different actions
    switch (action) {
      case 'redirect-to-login':
        console.log('AuthGuard: Redirecting to login page...');
        setHasRedirected(true);
        router.replace(loginRedirect);
        break;
        
      case 'redirect-to-dashboard':
        console.log('AuthGuard: Redirecting to dashboard...');
        setHasRedirected(true);
        router.replace(dashboardRedirect);
        break;
        
      case 'allow':
        console.log('AuthGuard: Access allowed');
        break;
        
      default:
        console.warn('AuthGuard: Unknown action:', action);
    }
  }, [isAuthenticated, isLoading, router.asPath, hasRedirected, loginRedirect, dashboardRedirect, config]);

  // Reset redirect flag when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setHasRedirected(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if we're in the process of redirecting
  if (hasRedirected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render children if access is allowed
  return <>{children}</>;
}

/**
 * Hook to check if current route requires authentication
 * Useful for conditional rendering within components
 */
export function useRouteAuth(routeConfig: Partial<RouteConfig> = {}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const config: RouteConfig = {
    protected: [...defaultRouteConfig.protected, ...(routeConfig.protected || [])],
    publicOnly: [...defaultRouteConfig.publicOnly, ...(routeConfig.publicOnly || [])],
    public: [...defaultRouteConfig.public, ...(routeConfig.public || [])]
  };

  const isRouteMatch = (routes: string[], currentPath: string): boolean => {
    return routes.some(route => {
      if (route === currentPath) return true;
      if (currentPath.startsWith(route + '/')) return true;
      return false;
    });
  };

  const currentPath = router.asPath;
  const isProtectedRoute = isRouteMatch(config.protected, currentPath);
  const isPublicOnlyRoute = isRouteMatch(config.publicOnly, currentPath);
  const isPublicRoute = isRouteMatch(config.public, currentPath);

  return {
    isProtectedRoute,
    isPublicOnlyRoute,
    isPublicRoute,
    shouldHaveAccess: !isLoading && (
      (isProtectedRoute && isAuthenticated) ||
      (isPublicOnlyRoute && !isAuthenticated) ||
      isPublicRoute
    ),
    isLoading
  };
}

/**
 * Higher-order component version of AuthGuard
 * Use this to wrap specific pages that need custom auth logic
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    routeConfig?: Partial<RouteConfig>;
    loginRedirect?: string;
    dashboardRedirect?: string;
  } = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
