import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ scrolled, menuOpen, setMenuOpen }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    
    if (isHomePage) {
      // If we're on the home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home page with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <span className="vignan">VIGNAN</span>
          <span className="ecell">E-CELL</span>
        </div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="#verticals" onClick={(e) => handleNavClick(e, 'verticals')}>Verticals</a>
          <a href="#events" onClick={(e) => handleNavClick(e, 'events')}>Events</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        </div>
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;