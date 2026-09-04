import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoHeader from '../assets/logo-header.jpg';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);
  const location = useLocation();

  // Sticky header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu + dropdown whenever the route changes
  useEffect(() => {
    setNavOpen(false);
    setDdOpen(false);
  }, [location.pathname, location.hash]);

  // Close the Services dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const toggleDdOnMobile = (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setDdOpen((o) => !o);
    }
  };

  const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header id="header" className={scrolled ? 'scrolled' : ''}>
      <NavLink to="/" className="logo" aria-label="MainCrafts Technology – home">
        <img src={logoHeader} alt="MainCrafts Technology" className="logo-img" />
      </NavLink>

      <nav id="main-nav" aria-label="Main navigation">
        <ul id="nav-list" role="list" className={navOpen ? 'open' : ''}>
          <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
          <li><NavLink to="/#features" className={navLinkClass}>Features</NavLink></li>
          <li className={`has-dd${ddOpen ? ' open' : ''}`} id="services-dd" ref={ddRef}>
            <a
              href="/#services"
              aria-haspopup="true"
              aria-expanded={ddOpen}
              onClick={toggleDdOnMobile}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDdOpen((o) => !o); }
                if (e.key === 'Escape') setDdOpen(false);
              }}
            >
              Services
            </a>
            <ul className="dropdown" role="menu">
              <li role="menuitem"><a href="/#services"><i className="fa-solid fa-palette fa-fw" aria-hidden="true"></i> Web Design</a></li>
              <li role="menuitem"><a href="/#services"><i className="fa-solid fa-mobile-screen fa-fw" aria-hidden="true"></i> App Development</a></li>
              <li role="menuitem"><a href="/#services"><i className="fa-solid fa-cloud fa-fw" aria-hidden="true"></i> Cloud Hosting</a></li>
              <li role="menuitem"><a href="/#services"><i className="fa-solid fa-chart-line fa-fw" aria-hidden="true"></i> SEO &amp; Analytics</a></li>
            </ul>
          </li>
          <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
          <li><NavLink to="/contact" className={navLinkClass}>Contact</NavLink></li>
          <li><NavLink to="/submissions" className={navLinkClass}>Submissions</NavLink></li>
          <li><NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
          <li><NavLink to="/contact" className="nav-cta">Apply Now</NavLink></li>
        </ul>
      </nav>
      <button
        className="hamburger"
        id="hamburger"
        aria-label="Toggle menu"
        aria-expanded={navOpen}
        aria-controls="nav-list"
        onClick={() => setNavOpen((o) => !o)}
      >
        <span></span><span></span><span></span>
      </button>
    </header>
  );
}
