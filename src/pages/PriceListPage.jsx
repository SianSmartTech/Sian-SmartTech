import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Check,
  Star,
  Shield,
  Wrench,
  Globe,
  FileSearch,
  Search,
  Settings,
  Laptop,
  Monitor,
  HardDrive,
  Save,
  Cpu,
  Settings2,
  BarChart2
} from 'lucide-react';

const Icons = {
  FileSearch,
  Search,
  Wrench,
  Settings,
  Laptop,
  Monitor,
  HardDrive,
  Save,
  Cpu,
  Settings2,
  Globe,
  BarChart2
};
import { pricing, itPricing } from '../mockData';
import "../css/App.css";
const PriceListPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('hardware');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam && ['hardware', 'it'].includes(typeParam.toLowerCase())) {
      setActiveTab(typeParam.toLowerCase());
    }
  }, [location]);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set('type', tab);
    window.history.pushState({}, '', url);
  };
  const scrollToContact = () => {
    window.location.href = '/#contact';
  };
  const getHardwareIcon = (planId) => {
    switch (planId) {
      case 1: return Icons.FileSearch || Icons.Search;
      case 2: return Icons.Wrench || Icons.Settings;
      case 3: return Icons.Laptop || Icons.Monitor;
      case 4: return Icons.HardDrive || Icons.Save;
      case 5: return Icons.Cpu || Icons.Settings2;
      default: return Icons.Settings;
    }
  };
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">PRICING</div>
      <section className="page-hero hero-pricing">
        <div className="container reveal pricing-hero-container">
          <span className="services-v2-subtitle">Simple & Transparent</span>
          <h1 className="services-v2-title pricing-hero-title">Our Price List</h1>
          <p className="pricing-v2-desc pricing-hero-desc">Price depends on the problem and it depends on the work case scenario.</p>
        </div>
      </section>
      <div className="pricing-tabs-container reveal">
        <button onClick={() => handleTabClick('hardware')} className={`pricing-tab-btn ${activeTab === 'hardware' ? 'active' : ''}`}>
          <span>Hardware Services</span>
          <span className="btn-icon-circle">
            <Wrench size={16} strokeWidth={2.5} />
          </span>
        </button>
        <button onClick={() => handleTabClick('it')} className={`pricing-tab-btn ${activeTab === 'it' ? 'active' : ''}`}>
          <span>IT Services</span>
          <span className="btn-icon-circle">
            <Globe size={16} strokeWidth={2.5} />
          </span>
        </button>
      </div>
      {activeTab === 'hardware' && (
        <div className="curved-section">
          <section className="pricing-section-v2 pricing-section-v2-adjusted">
            <div className="pricing-v2-wrapper pricing-v2-wrapper-top0">
              <div className="reveal pricing-v2-grid-header">
                <span className="services-v2-subtitle">Hardware & Repair</span>
                <h2 className="services-v2-title pricing-v2-grid-title">Hardware Services Pricing</h2>
              </div>
              <div className="pricing-v2-grid">
                {pricing.map((plan, index) => {
                  const HardwareIcon = getHardwareIcon(plan.id);
                  return (
                    <div key={plan.id} className={`pricing-v2-card reveal ${plan.popular ? 'pricing-v2-popular' : ''}`} style={{ '--delay': `${index * 120}ms` }}>
                      {plan.popular && <div className="pricing-v2-badge">Most Popular</div>}
                      <div className="pricing-v2-card-header">
                        <div className="pricing-card-header-row">
                          <h3 className="pricing-v2-plan-name pricing-card-header-plan-name">{plan.name}</h3>
                          <div className="pricing-v2-icon-wrapper">
                            <HardwareIcon size={20} />
                          </div>
                        </div>
                        <div className="pricing-v2-price pricing-card-price-col">
                          <span className="pricing-card-price-label">Started at</span>
                          <div className="pricing-card-price-row">{plan.price}
                            <span className="pricing-v2-period">/{plan.period}</span>
                          </div>
                        </div>
                      </div>
                      <ul className="pricing-v2-features">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="pricing-v2-feature">
                            <Check size={18} className="pricing-v2-check" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={scrollToContact} className="pricing-v2-btn pricing-v2-btn-auto-margin">Book Service </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
      {activeTab === 'it' && (
        <div className="curved-section">
          <section className="pricing-section-v2 pricing-section-v2-adjusted2">
            <div className="pricing-v2-wrapper pricing-v2-wrapper-top0">
              <div className="reveal pricing-v2-grid-header">
                <span className="services-v2-subtitle">Digital Solutions</span>
                <h2 className="services-v2-title pricing-v2-grid-title">IT Services Pricing</h2>
              </div>
              <div className="pricing-v2-grid">
                {itPricing.map((plan, index) => {
                  const IconComp = Icons[plan.icon] || Icons.Globe;
                  return (
                    <div key={plan.id} className={`pricing-v2-card reveal ${plan.popular ? 'pricing-v2-popular' : ''}`} style={{ '--delay': `${index * 150}ms` }}>
                      {plan.popular && <div className="pricing-v2-badge">Most Popular</div>}
                      <div className="pricing-v2-card-header">
                        <div className="pricing-card-header-row">
                          <h3 className="pricing-v2-plan-name pricing-card-header-plan-name">{plan.name}</h3>
                          <div className="pricing-v2-icon-wrapper">
                            <IconComp size={20} />
                          </div>
                        </div>
                        <div className="pricing-v2-price pricing-card-price-col">
                          <span className="pricing-card-price-label">
                            {plan.price === 'Custom' ? 'Quote-based' : 'Started at'}
                          </span>
                          <div className="pricing-card-price-row">
                            {plan.price}
                            <span className="pricing-v2-period">/{plan.period}</span>
                          </div>
                          {plan.hostingNote && (
                            <span className="pricing-card-note-hosting">
                              {plan.hostingNote}
                            </span>
                          )}
                          {plan.subtitle && (
                            <span className="pricing-card-note-subtitle">
                              {plan.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <ul className="pricing-v2-features">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="pricing-v2-feature">
                            <Check size={18} className="pricing-v2-check" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={scrollToContact} className="pricing-v2-btn pricing-v2-btn-auto-margin">Get Started</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
      <div className="curved-section">
        <section className="section why-choose-section">
          <div className="container">
            <div className="section-header reveal why-choose-header">
              <h2 className="services-v2-title">Why Choose Us?</h2>
            </div>
            <div className="process-v2-stats why-choose-grid">
              <div className="why-choose-card reveal" style={{ '--delay': '0ms' }}>
                <div className="process-v2-stat-icon"><Shield size={32} /></div>
                <div className="process-v2-stat-info">
                  <h3>Warranty Guaranteed</h3>
                  <p>All repairs come with a minimum 30-day warranty for your peace of mind.</p>
                </div>
              </div>
              <div className="why-choose-card reveal" style={{ '--delay': '120ms' }}>
                <div className="process-v2-stat-icon"><Star size={32} /></div>
                <div className="process-v2-stat-info">
                  <h3>Genuine Parts</h3>
                  <p>We only use authentic, high-quality components in every repair job.</p>
                </div>
              </div>
              <div className="why-choose-card reveal" style={{ '--delay': '240ms' }}>
                <div className="process-v2-stat-icon"><Check size={32} /></div>
                <div className="process-v2-stat-info">
                  <h3>No Fix, No Fee</h3>
                  <p>If we can't fix it, you don't pay — that's our commitment to you.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default PriceListPage;