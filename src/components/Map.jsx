import "../css/App.css";
import { companyInfo } from '../mockData';
const Map = () => {
  return (
    <section id="map" className="map-section-v2 reveal">
      <div className="map-bg-text">CONNECT</div>
      <div className="map-v2-wrapper">
        <div className="map-v2-header">
          <p className="map-v2-subtitle">Locate Our Office</p>
          <h2 className="map-v2-title">Visit Our <span className="text-gradient">Workshop</span></h2>
        </div>
        <div className="map-v2-card-wrapper map-v2-card-wrapper-padding0">
          <div className="map-v2-container map-v2-container-full">
            <iframe src={companyInfo.mapUrl} width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sian SmartTech Location" className="map-v2-iframe map-v2-iframe-border0"></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Map;