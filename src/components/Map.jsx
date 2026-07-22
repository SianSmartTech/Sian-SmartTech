import { useEffect, useRef, useState } from 'react';
import "../css/App.css";
import { companyInfo } from '../mockData';
import { MapPin, Clock, Navigation } from 'lucide-react';

const Map = () => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyInfo.address)}`;
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} id="map" className="map-section-v2 reveal">
      <div className="map-bg-text">CONNECT</div>
      <div className="map-v2-wrapper">
        <div className="map-v2-header">
          <p className="map-v2-subtitle">Locate Our Shop</p>
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
                <div className="map-hours-list">
                  <span><strong>Mon - Fri:</strong> 9:00 AM - 6:00 PM</span>
                  <span><strong>Saturday:</strong> 10:00 AM - 4:00 PM</span>
                  <span className="map-sunday-leave"><strong>Sunday:</strong> Holiday (Leave)</span>
                </div>
              </div>
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="map-directions-btn">
              <Navigation size={18} />
              <span>Get Directions</span>
            </a>
          </div>
          <div className="map-v2-container">
            {shouldRender ? (
              <iframe src={companyInfo.mapUrl} width="100%" height="100%" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sian SmartTech Location" className="map-v2-iframe map-v2-iframe-border0 map-v2-iframe-styled"></iframe>
            ) : (
              <div className="map-loading-placeholder">
                <span className="map-loading-text">Loading Map...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;