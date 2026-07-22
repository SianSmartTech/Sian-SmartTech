import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/HardwareServices.css";
import { Star, CheckCircle, ArrowRight, Globe, Briefcase, Cpu } from 'lucide-react';
import { itServicesData } from '../mockData';
const IT_SERVICE_ICONS = { Globe, Briefcase, Cpu};
const ITServices = () => {
  const navigate = useNavigate();
  const [displayServices] = useState(itServicesData);
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">SERVICES</div>
      <section className="page-hero hero-it">
        <div className="container">
          <span className="section-subtitle">Digital Solutions</span>
          <h1 className="section-title">IT Services</h1>
          <p className="page-description">Comprehensive IT support, networking, and software solutions for home and business.</p>
        </div>
      </section>
      <div className="curved-section">
        <section className="section bg-alt" id="services-list">
          <div className="container hw-premium-container">
            <div className="hw-premium-list">
              {displayServices.map((service, index) => {
                const IconComponent = IT_SERVICE_ICONS[service.icon] || Cpu;
                const isSelected = false;
                return (
                  <div key={service.id} className={`hw-premium-card reveal active ${isSelected ? 'hw-selected-card' : ''}`}>
                    <div className="hw-glow-orb orb-1"></div>
                    <div className="hw-glow-orb orb-2"></div>
                    {isSelected && (
                      <div className="hw-selected-badge">
                        <Star size={14} className="hw-star-icon" />Selected Service
                      </div>
                    )}
                    <div className="hw-card-image-section">
                      <div className="hw-img-overlay"></div>
                      <div className="hw-scanline"></div>
                      <img src={service.image} alt={`${service.title} - Sian SmartTech Madurai`} className="hw-service-img" loading="lazy" decoding="async" width="480" height="320" />
                      <div className="hw-card-icon-badge">
                        <IconComponent size={32} />
                      </div>
                    </div>
                    <div className="hw-card-content-section">
                      <div className="hw-card-header">
                        <span className="hw-category">{service.category}</span>
                        <div className="hw-rating">
                          <Star size={16} className="hw-rating-icon" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      <h3 className="hw-card-title">{service.title}</h3>
                      <p className="hw-card-desc">{service.description}</p>
                      <div className="hw-metrics-row">
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Turnaround</span>
                          <span className="hw-metric-value">{service.turnaround}</span>
                        </div>
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Warranty</span>
                          <span className="hw-metric-value">{service.warranty}</span>
                        </div>
                        <div className="hw-metric-box">
                          <span className="hw-metric-label">Est. Price</span>
                          <span className="hw-metric-value">{service.priceRange}</span>
                        </div>
                      </div>
                      <div className="hw-features-grid">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="hw-feature-pill">
                            <CheckCircle size={16} className="hw-feature-icon" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <button className="hw-book-btn" onClick={() => navigate('/book-service', { state: { selectedService: service.title } })}>
                        <span>Book This Service</span> <ArrowRight size={18} />
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
export default ITServices;