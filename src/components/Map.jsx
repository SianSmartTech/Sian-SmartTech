import "../css/App.css";
import { companyInfo } from '../mockData';
import { MapPin, Clock, Navigation } from 'lucide-react';
const Map = () => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyInfo.address)}`;
  return (
    <section id="map" className="map-section-v2 reveal">
      <div className="map-bg-text">CONNECT</div>
      <div className="map-v2-wrapper">
        <div className="map-v2-header">
          <p className="map-v2-subtitle">Locate Our Office</p>
          <h2 className="map-v2-title">Visit Our <span className="text-gradient">Workshop</span></h2>
          <p className="map-v2-desc">Laptop Service Center in Madurai</p>
        </div>
        <div className="map-layout-grid">
          <div className="map-info-card-glass">
            <div className="map-info-item">
              <div className="map-info-icon-wrapper">
                <MapPin className="map-info-icon" size={24} />
              </div>
              <div className="map-info-text">
                <h3>Store Location</h3>
                <p>{companyInfo.address}</p>
              </div>
            </div>
            <div className="map-info-item">
              <div className="map-info-icon-wrapper">
                <Clock className="map-info-icon" size={24} />
              </div>
              <div className="map-info-text">
                <h3>Open Hours</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <span><strong>Mon - Fri:</strong> 9:00 AM - 6:00 PM</span>
                  <span><strong>Saturday:</strong> 10:00 AM - 4:00 PM</span>
                  <span style={{ color: 'rgba(239, 68, 68, 0.95)', fontWeight: '600' }}><strong>Sunday:</strong> Holiday (Leave)</span>
                </div>
              </div>
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="map-directions-btn">
              <Navigation size={18} />
              <span>Get Directions</span>
            </a>
          </div>
          <div className="map-v2-container">
            <iframe src={companyInfo.mapUrl} width="100%" height="100%" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sian SmartTech Location" className="map-v2-iframe map-v2-iframe-border0" style={{ minHeight: '400px', display: 'block' }}></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Map;