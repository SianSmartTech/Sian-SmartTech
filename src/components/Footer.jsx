import "../css/App.css";
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { companyInfo } from '../mockData';
import { Link } from 'react-router-dom';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">{companyInfo.name}</h3>
            <p className="footer-tagline">{companyInfo.tagline}</p>
            <p className="footer-description">{companyInfo.description}</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/price-list">Price List</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/book-service">Book Service</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={16} />
                <span>{companyInfo.phone}</span>
              </li>
              <li>
                <Mail size={16} />
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'mailto:' + 'siansmarttech' + '@' + 'gmail.com';
                  }}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {companyInfo.email}
                </a>
              </li>
              <li>
                <MapPin size={16} />
                <span>{companyInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://www.facebook.com/share/14gwyQLfC7J/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/sian_smart_tech?igsh=MTJ5Y3YybXl3aXBrYQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link"> <Instagram size={20} /></a>
          </div>
          <p className="footer-copyright">© {currentYear} {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;