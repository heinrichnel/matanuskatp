import React, { lazy, Suspense, Fragment } from 'react';
import { Route } from 'react-router-dom';
import { sidebarConfig } from './config/sidebarConfig';

// Loader component for lazy loading
const Loader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Dynamic component import function
const importComponent = (path) => {
  // Remove the prefix 'pages/' or 'components/' from the path
  const componentPath = path.includes('/')
    ? path.substring(path.indexOf('/') + 1)
    : path;

  // Try to import from pages directory first
  if (path.startsWith('pages/')) {
    return lazy(() => {
      try {
        return import(`./pages/${componentPath}.tsx`);
      } catch (error) {
        console.error(`Failed to load page component: ${path}`, error);
        return import('./components/ErrorBoundary.tsx').then(module => ({
          default: () => <module.default error={`Failed to load: ${path}`} />
        }));
      }
    });
  }
  
  // Try to import from components directory
  return lazy(() => {
    try {
      return import(`./components/${componentPath}.tsx`);
    } catch (error) {
      console.error(`Failed to load component: ${path}`, error);
      return import('./components/ErrorBoundary').then(module => ({
        default: () => <module.default error={`Failed to load: ${path}`} />
      }));
    }
  });
};

// Recursive function to generate routes from sidebar config
const generateRoutes = (items) => {
  return items.flatMap(item => {
    const Component = importComponent(item.component);
    // Convert absolute path to relative for nested routing
    const routePath = item.path.startsWith('/') ? item.path.slice(1) : item.path;
    const routes = [
      <Route
        key={item.id}
        path={routePath}
        element={
          <Suspense fallback={<Loader />}>
            <Component />
          </Suspense>
        }
      />
    ];
    
    // Generate routes for children if they exist
    if (item.children && item.children.length > 0) {
      routes.push(...generateRoutes(item.children));
    }
    
    return routes;
  });
};

// AppRoutes component
export const AppRoutes = () => {
  return (
    <Fragment>
      {/* Generate routes from sidebarConfig */}
      {generateRoutes(sidebarConfig)}

      {/* Catch-all route for 404 page */}
      <Route
        path="*"
        element={
          <Suspense fallback={<Loader />}>
            <div className="not-found-page">
              <h1>Page Not Found</h1>
              <p>The page you are looking for doesn't exist or has been moved.</p>
            </div>
          </Suspense>
        }
      />
    </Fragment>
  );
};
