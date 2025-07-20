# AuthGuard System Documentation

A comprehensive authentication and route protection system for your Next.js application.

## Overview

The AuthGuard system provides:
- **Automatic route protection** based on authentication status
- **Flexible configuration** for different route types
- **Easy integration** with existing pages
- **Comprehensive logging** for debugging
- **Extensible architecture** for future enhancements

## Quick Start

### 1. Basic Setup (Already Done)

The AuthGuard is already configured in your app:

```tsx
// src/pages/_app.tsx
import { AuthGuard } from "@/components/auth/AuthGuard";

function AppContent({ Component, pageProps }) {
  useAuthInitializer();
  
  return (
    <AuthGuard>
      <Component {...pageProps} />
      <Toaster />
    </AuthGuard>
  );
}
```

### 2. Adding New Routes

To add a new route, modify the `defaultRouteConfig` in `src/components/auth/AuthGuard.tsx`:

```tsx
const defaultRouteConfig: RouteConfig = {
  protected: [
    '/dashboard',
    '/settings',
    '/new-protected-route',  // ← Add here
  ],
  publicOnly: [
    '/auth/user/signin',
    '/new-auth-route',       // ← Add here
  ],
  public: [
    '/',
    '/about',
    '/new-public-route',     // ← Add here
  ]
};
```

## Route Types

### Protected Routes
- **Purpose**: Require user authentication
- **Behavior**: Redirect unauthenticated users to login page
- **Examples**: `/dashboard`, `/settings`, `/profile`

### Public-Only Routes  
- **Purpose**: Only for unauthenticated users
- **Behavior**: Redirect authenticated users to dashboard
- **Examples**: `/auth/user/signin`, `/auth/user/signup`

### Public Routes
- **Purpose**: Accessible to everyone
- **Behavior**: No authentication restrictions
- **Examples**: `/`, `/about`, `/contact`

## Current Configuration

### Protected Routes
```
/dashboard
/dashboard/user
/dashboard/admin
/settings
/profile
/chat
```

### Public-Only Routes
```
/auth/user/signin
/auth/user/signup
/auth/user/forgot-password
/auth/user/verify
/auth/user/reset-password
/auth/admin/signin
/auth/admin/signup
```

### Public Routes
```
/
/about
/contact
/privacy-policy
/terms-of-service
/legal/privacy-policy
/legal/terms-of-service
```

## Advanced Usage

### Custom Configuration for Specific Pages

```tsx
// Using withAuthGuard HOC
import { withAuthGuard } from '@/components/auth/AuthGuard';

const SpecialPage = () => <div>Special content</div>;

export default withAuthGuard(SpecialPage, {
  routeConfig: {
    protected: ['/special-route']
  },
  loginRedirect: '/custom-login',
  dashboardRedirect: '/custom-dashboard'
});
```

### Conditional Rendering Based on Route Type

```tsx
import { useRouteAuth } from '@/components/auth/AuthGuard';

const MyComponent = () => {
  const { isProtectedRoute, shouldHaveAccess, isLoading } = useRouteAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (isProtectedRoute && !shouldHaveAccess) {
    return <AccessDenied />;
  }
  
  return <MainContent />;
};
```

## How It Works

### 1. Route Matching
- **Exact Match**: `/dashboard` matches only `/dashboard`
- **Prefix Match**: `/dashboard` also matches `/dashboard/user`, `/dashboard/settings`
- **Automatic**: Works with dynamic routes like `/user/[id]`

### 2. Authentication Flow
1. User navigates to a route
2. AuthGuard checks current authentication status
3. Determines appropriate action based on route type
4. Redirects if necessary or renders content

### 3. Loading States
- Shows loading spinner while checking authentication
- Prevents content flash during route transitions
- Maintains smooth user experience

## Common Scenarios

### Adding a New Feature
1. **Main feature page** → Add to `protected` routes
2. **Feature settings** → Add to `protected` routes  
3. **Feature landing page** → Add to `public` routes

### Admin-Only Features
1. Add `/admin` to `protected` routes
2. Add additional role checks in components
3. Use `useAuth` hook for role-based rendering

### New Authentication Flow
1. Add auth routes to `publicOnly` array
2. Ensure proper redirects after completion
3. Test all authentication scenarios

## Debugging

### Console Logs
The AuthGuard provides detailed console logs:
```
AuthGuard: Current path: /dashboard
AuthGuard: Is authenticated: true
AuthGuard: Action: allow
```

### Common Issues
1. **Unexpected redirects** → Check route configuration
2. **Page not loading** → Verify route is in correct array
3. **Authentication loops** → Check auth initializer

### Debug Steps
1. Open browser console
2. Look for `AuthGuard:` messages
3. Verify current path and authentication status
4. Check action taken by AuthGuard

## File Structure

```
src/
├── components/auth/
│   ├── AuthGuard.tsx              # Main AuthGuard component
│   ├── AuthGuard.examples.ts      # Configuration examples
│   └── RouteGuard.tsx            # Legacy (can be removed)
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   └── useAuthInitializer.ts     # Auth initialization
└── pages/
    └── _app.tsx                  # App wrapper with AuthGuard
```

## Migration from RouteGuard

If you're migrating from the old RouteGuard system:

1. Remove `RouteGuard` imports from individual pages
2. Remove `<RouteGuard>` wrapper components
3. Configure routes in AuthGuard instead
4. Test all routes thoroughly

## Best Practices

1. **Organize routes by functionality** in the configuration
2. **Use comments** to document route purposes
3. **Test thoroughly** after adding new routes
4. **Use consistent naming** for similar route patterns
5. **Monitor console logs** during development

## Testing Checklist

When adding new routes, verify:
- [ ] Unauthenticated user → protected route → redirects to login
- [ ] Authenticated user → public-only route → redirects to dashboard
- [ ] Both users → public route → works correctly
- [ ] Page reload → maintains correct behavior
- [ ] Direct navigation → works as expected

## Need Help?

- Check the examples in `AuthGuard.examples.ts`
- Review console logs for debugging info
- Test changes in different authentication states
- Follow the step-by-step guide above

The AuthGuard system is designed to be simple to use and easy to extend. Most route additions require just adding a single line to the appropriate array in the configuration.
