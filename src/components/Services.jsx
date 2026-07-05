import { useState } from 'react';
import "../css/App.css";
import { services, itServicesData } from '../mockData';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Services = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hardware');
  const currentServices = activeTab === 'hardware' ? services : itServicesData;
  const displayCards = currentServices.slice(0, 6);
  const handleExplore = (service) => {
    if (activeTab === 'it') {
      navigate('/it-services');
    } else {
      const category = service.categories && service.categories[0] ? service.categories[0] : 'all';
      navigate(`/hardware-services?category=${category}`);
      setTimeout(() => {
        const section = document.getElementById('services-list');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  return (
    <section id="services" className="services-premium-section reveal">
      <div className="services-bg-text">SERVICES</div>
      <div className="services-premium-wrapper">
        <div className="services-premium-header">
          <div className="premium-badge">
            <span className="premium-dot"></span>Our Expertise
          </div>
          <h2 className="services-premium-title">Next-Gen <span className="text-gradient">Tech Solutions</span></h2>
          <p className="services-premium-desc">Elevate your technology with our state-of-the-art hardware repair, custom assembly, and premium website development services.</p>
        </div>
        <div className="services-tabs-container">
          <button className={`services-tab-btn ${activeTab === 'hardware' ? 'active' : ''}`} onClick={() => setActiveTab('hardware')}>Hardware Services</button>
          <button className={`services-tab-btn ${activeTab === 'it' ? 'active' : ''}`} onClick={() => setActiveTab('it')}>IT Services</button>
        </div>
        <div className="services-premium-grid">
          {displayCards.map((service) => {
            const IconComponent = Icons[service.icon] || Icons.Wrench;
            return (
              <div key={service.id} className="premium-service-card" onClick={() => handleExplore(service)}>
                <div className="premium-card-bg" style={{ backgroundImage: `url(${service.image})` }}></div>
                <div className="premium-card-overlay"></div>
                <div className="premium-card-content">
                  <div className="premium-icon-wrapper">
                    <IconComponent className="premium-icon" size={28} />
                  </div>
                  <div className="premium-card-text">
                    <span className="premium-category">{service.category}</span>
                    <h3 className="premium-title">{service.title}</h3>
                    <p className="premium-desc">{service.description}</p>
                  </div>
                  <div className="premium-card-footer">
                    <span className="premium-explore">Explore Service</span>
                    <Icons.ArrowRight className="premium-arrow" size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Services;