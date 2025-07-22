import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { sidebarConfig } from './config/sidebarConfig';

// Mock the lazy loaded components
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: (importFn) => {
      return importFn().then(module => module.default);
    },
    Suspense: ({ children }) => children,
  };
});

// Mock some components
jest.mock('./pages/DashboardPage', () => () => <div>Dashboard Page</div>);
jest.mock('./pages/trips/TripManagementPage', () => () => <div>Trip Management Page</div>);

describe('Routing System', () => {
  // Test 1: Verify the router renders
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );
  });

  // Test 2: Count the routes
  test('has the correct number of routes', () => {
    // Recursive function to count all routes in the config
    const countRoutes = (items) => {
      return items.reduce((count, item) => {
        let total = 1; // Count this item
        if (item.children && item.children.length > 0) {
          total += countRoutes(item.children); // Add children count
        }
        return count + total;
      }, 0);
    };

    const totalConfigRoutes = countRoutes(sidebarConfig);
    
    // Check if the total routes is greater than a threshold
    expect(totalConfigRoutes).toBeGreaterThan(50);
  });

  // Test 3: Verify route structure
  test('has the correct hierarchical structure', () => {
    // Check that every main section has children
    const mainSections = sidebarConfig.filter(item => 
      ['trip-management', 'invoices', 'diesel', 'clients', 'drivers', 'compliance', 'analytics', 'workshop', 'reports', 'notifications', 'settings'].includes(item.id)
    );
    
    // Every main section should have children
    mainSections.forEach(section => {
      expect(section.children).toBeDefined();
      expect(section.children.length).toBeGreaterThan(0);
    });
  });

  // Test 4: Test for specific routes
  test('contains essential routes', () => {
    const essentialPaths = [
      '/dashboard',
      '/trips',
      '/invoices',
      '/diesel',
      '/clients',
      '/drivers',
      '/compliance',
      '/workshop',
    ];

    // Flatten the config to get all paths
    const getAllPaths = (items) => {
      return items.reduce((paths, item) => {
        paths.push(item.path);
        if (item.children && item.children.length > 0) {
          paths.push(...getAllPaths(item.children));
        }
        return paths;
      }, []);
    };

    const allPaths = getAllPaths(sidebarConfig);
    
    // Check if all essential paths exist
    essentialPaths.forEach(path => {
      expect(allPaths).toContain(path);
    });
  });

  // Test 5: Test maximum nesting level
  test('has appropriate nesting depth', () => {
    // Function to get max nesting depth
    const getMaxDepth = (items, currentDepth = 1) => {
      if (!items || items.length === 0) {
        return currentDepth;
      }

      return Math.max(...items.map(item => 
        item.children 
          ? getMaxDepth(item.children, currentDepth + 1) 
          : currentDepth
      ));
    };

    const maxDepth = getMaxDepth(sidebarConfig);
    
    // We expect at least 3 levels of nesting
    expect(maxDepth).toBeGreaterThanOrEqual(3);
  });
});
