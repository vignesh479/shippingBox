import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Shipping Box Calculator</h1>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Add Box
          </Link>
          <Link 
            to="/boxes" 
            className={`navbar-item ${location.pathname === '/boxes' ? 'active' : ''}`}
          >
            View Boxes
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
