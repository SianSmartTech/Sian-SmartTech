import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../css/HardwareServices.css";
import { getResponsiveImage } from '../utils/imageHelpers';
import { Layers, Wrench, Laptop, Monitor, Printer, Cctv, Camera, Plane, Cpu, Star, Zap, Video, HardDrive, Settings, RefreshCw, ShoppingBag, Keyboard, Globe, Briefcase, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
const Icons = { Layers, Wrench, Laptop, Monitor, Printer, Cctv, Camera, Plane, Cpu, Star, Zap, Video, HardDrive, Settings, RefreshCw, ShoppingBag, Keyboard, Globe, Briefcase, CheckCircle, ShieldCheck, ArrowRight };
import { services } from '../mockData';
const HardwareServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam && ['laptop', 'computer', 'printer', 'cctv', 'drone'].includes(catParam.toLowerCase())) {
      setActiveTab(catParam.toLowerCase());
    } else {
      setActiveTab('all');
    }
  }, [location]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector('.hw-tabs-container');
      const activeTabEl = document.querySelector('.hw-tab-btn.active');
      if (container && activeTabEl) {
        const containerWidth = container.clientWidth;
        const activeTabOffsetLeft = activeTabEl.offsetLeft;
        const activeTabWidth = activeTabEl.offsetWidth;
        const scrollLeft = activeTabOffsetLeft + (activeTabWidth / 2) - (containerWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const displayServices = activeTab === 'all' ? services : services.filter(s => s.categories.includes(activeTab));
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    if (tab === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', tab);
    }
    window.history.pushState({}, '', url);
  };
  const getTabIcon = (cat) => {
    switch (cat) {
      case 'all': return Icons.Layers || Icons.Wrench;
      case 'laptop': return Icons.Laptop;
      case 'computer': return Icons.Monitor;
      case 'printer': return Icons.Printer;
      case 'cctv': return Icons.Cctv || Icons.Camera;
      case 'drone': return Icons.Plane || Icons.Cpu;
      default: return Icons.Cpu;
    }
  };
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">HARDWARE</div>
      <section className="page-hero hero-hardware">
        <div className="container">
          <span className="section-subtitle">Electronics & Computing</span>
          <h1 className="section-title">Hardware Services</h1>
          <p className="page-description">Professional chip-level repairs, hardware upgrades, and maintenance for all your devices.</p>
        </div>
      </section>
      <div className="curved-section">
        <section className="section bg-alt" id="services-list">
          <div className="container hw-premium-container">
            <div className="hw-tabs-container reveal">
              {['all', 'laptop', 'computer', 'printer', 'cctv', 'drone'].map((cat) => {
                const TabIcon = getTabIcon(cat);
                return (
                  <button key={cat} onClick={() => handleTabClick(cat)} className={`hw-tab-btn ${activeTab === cat ? 'active' : ''}`}>
                    <span>{cat === 'all' ? 'All Services' : cat}</span>
                    <span className="btn-icon-circle">
                      <TabIcon size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="hw-premium-list">
              {displayServices.map((service, index) => {
                const IconComponent = Icons[service.icon] || Icons.Cpu;
                return (
                  <div key={service.id} className="hw-premium-card reveal active">
                    <div className="hw-glow-orb orb-1"></div>
                    <div className="hw-glow-orb orb-2"></div>
                    <div className="hw-card-image-section">
                      <div className="hw-img-overlay"></div>
                      <div className="hw-scanline"></div>
                      <img
                        src={service.image}
                        {...getResponsiveImage(service.image)}
                        alt={`${service.title} - Sian SmartTech Madurai`}
                        className="hw-service-img"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="hw-card-icon-badge">
                        <IconComponent size={32} />
                      </div>
                    </div>
                    <div className="hw-card-content-section">
                      <div className="hw-card-header">
                        <span className="hw-category">{service.category}</span>
                        <div className="hw-rating">
                          <Icons.Star size={16} className="hw-rating-icon" />
                          <span>{service.rating || '4.9'}</span>
                        </div>
                      </div>
                      <h3 className="hw-card-title">{service.title}</h3>
                      <p className="hw-card-desc">{service.description}</p>
                      <div className="hw-metrics-row">
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Turnaround</span>
                          <span className="hw-metric-value">{service.turnaround || '1-3 Days'}</span>
                        </div>
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Warranty</span>
                          <span className="hw-metric-value">{service.warranty || '90 Days'}</span>
                        </div>
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Est. Price</span>
                          <span className="hw-metric-value">{service.priceRange || 'Custom'}</span>
                        </div>
                      </div>
                      <div className="hw-features-grid">
                        <div className="hw-feature-pill">
                          <Icons.CheckCircle size={16} className="hw-feature-icon" />
                          <span>{service.benefits?.[0] || 'Advanced Diagnostics'}</span>
                        </div>
                        <div className="hw-feature-pill">
                          <Icons.ShieldCheck size={16} className="hw-feature-icon" />
                          <span>{service.benefits?.[1] || 'Warranty Covered'}</span>
                        </div>
                        <div className="hw-feature-pill">
                          <Icons.Wrench size={16} className="hw-feature-icon" />
                          <span>{service.benefits?.[2] || 'Quality Spares'}</span>
                        </div>
                      </div>
                      <button className="hw-book-btn" onClick={() => navigate('/book-service', { state: { selectedService: service.title } })}>
                        <span>Book This Service</span> <Icons.ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default HardwareServices;