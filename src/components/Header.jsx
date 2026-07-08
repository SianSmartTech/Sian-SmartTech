import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import logo from '../assets/images/heroes/sian_smarttech_logo.webp';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../css/App.css";
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '#', dropdown: [{ label: 'Hardware Services', href: '/hardware-services' }, { label: 'IT Services', href: '/it-services' }] },
    { label: 'Pages', href: '#', dropdown: [{ label: 'Price List', href: '/price-list' }, { label: 'FAQ', href: '/faq' }] },
    { label: 'Track Ticket', href: '/track' },
    { label: 'Book Service', href: '/book-service' }
  ];
  const handleLinkClick = (e, item) => {
    if (item.dropdown) {
      setActiveDropdown(activeDropdown === item.label ? null : item.label);
      if (item.href === '#') {
        e.preventDefault();
        return;
      }
    }
    if (item.href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = item.href.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <header className="header-fixed">
        <div className="header-container">
          <div className="header-logo" onClick={() => navigate('/')}>
            <img src={logo} alt="Sian Smarttech" className="logo-img" />
          </div>
          <nav className="nav-desktop">
            {navItems.map((item) => (
              <div key={item.label} className="nav-item-wrapper">
                {item.dropdown ? (
                  <div className="dropdown-trigger" onMouseEnter={() => setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                    <span className={`nav-link nav-dropdown-link ${(location.pathname === item.href || (item.href !== '#' && location.pathname.startsWith(item.href))) ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, item)}>{item.label}
                      <ChevronDown size={14} />
                    </span>
                    <div className="dropdown-menu">
                      {item.dropdown.map((subItem) => (
                        <Link key={subItem.label} to={subItem.href} className={`dropdown-item ${location.pathname === subItem.href ? 'active' : ''}`} onClick={() => setActiveDropdown(null)}>{subItem.label}</Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link to={item.href.startsWith('/#') ? '/' : item.href} onClick={(e) => handleLinkClick(e, item)} className={`nav-link ${(location.pathname === item.href || (location.pathname === '/' && item.href.startsWith('/#') && location.hash === item.href.substring(1))) ? 'active' : ''}`}>{item.label}</Link>
                )}
              </div>
            ))}
          </nav>
          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a href="/" className="btn-contact-nav" onClick={(e) => { e.preventDefault(); handleLinkClick(e, { href: '/#contact' }); }}>Contact Us</a>
            <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <nav className="nav-mobile">
          {navItems.map((item) => (
            <div key={item.label} className="mobile-nav-item-wrapper">
              {item.dropdown ? (
                <>
                  <div className={`mobile-dropdown-trigger ${(location.pathname === item.href || (item.href !== '#' && location.pathname.startsWith(item.href))) ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, item)}>
                    {item.label} <ChevronDown size={20} className={activeDropdown === item.label ? 'rotate-180' : ''} />
                  </div>
                  {activeDropdown === item.label && (
                    <div className="mobile-dropdown-menu">
                      {item.dropdown.map((subItem) => (
                        <Link key={subItem.label} to={subItem.href} className={`mobile-dropdown-item ${location.pathname === subItem.href ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{subItem.label}</Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link to={item.href.startsWith('/#') ? '/' : item.href} onClick={(e) => handleLinkClick(e, item)} className={`nav-link-mobile ${(location.pathname === item.href || (location.pathname === '/' && item.href.startsWith('/#') && location.hash === item.href.substring(1))) ? 'active' : ''}`}>{item.label}</Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
};
export default Header;