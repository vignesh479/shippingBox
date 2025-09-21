/**
 * Main App Component - Enhanced with performance optimizations
 * Implements proper routing and state management
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoxProvider } from './context/BoxContext';
import Navbar from './components/Navbar';
import { ROUTES } from './constants';
import './App.css';

// Lazy load components for better performance
const AddBox = lazy(() => import('./components/AddBox'));
const BoxList = lazy(() => import('./components/BoxList'));

/**
 * Loading Fallback Component
 */
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner large" aria-hidden="true"></div>
    <p>Loading...</p>
  </div>
);

/**
 * 404 Not Found Component
 */
const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

/**
 * Main Application Component
 */
function App() {
  return (
    <BoxProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          <main className="main-content" role="main">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<AddBox />} />
                <Route path={ROUTES.BOX_LIST} element={<BoxList />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </BoxProvider>
  );
}

export default App;
