import React from 'react';

// Skip links component for screen readers and keyboard navigation
export const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-accent text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-4 left-32 z-50 bg-accent text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to navigation
      </a>
    </div>
  );
}; 