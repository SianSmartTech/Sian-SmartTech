import { Users, Zap, Star } from 'lucide-react';
import "../css/App.css";
const About = () => {
  return (
    <section id="about" className="about-section-v2 reveal">
      <div className="about-bg-text">ABOUT</div>
      <div className="about-v2-container">
        <div className="about-v2-left">
          <div className="about-v2-badge">Who we are</div>
          <h2 className="about-v2-title">We Can Fix All Types Of Computers & Laptops</h2>
          <p className="about-v2-desc">Providing reliable and professional repair services for all your electronic devices. From high-end gaming laptops to custom workstations, we ensure your tech is back in perfect condition with genuine parts and expert care.</p>
          <div className="about-v2-cards">
            <div className="accent-card">
              <div className="services-v2-icon-wrapper">
                <Users size={28} className="services-v2-icon" />
              </div>
              <h3 className="services-v2-card-title">Expert Team</h3>
              <p className="services-v2-card-desc">Our certified technicians have years of experience in hardware diagnostics.</p>
              <div className="services-v2-card-border-bottom"></div>
            </div>
            <div className="accent-card">
              <div className="services-v2-icon-wrapper">
                <Zap size={28} className="services-v2-icon" />
              </div>
              <h3 className="services-v2-card-title">Quick Repair</h3>
              <p className="services-v2-card-desc">Most laptop and computer repairs are completed within 24 hours.</p>
              <div className="services-v2-card-border-bottom"></div>
            </div>
          </div>
        </div>
        <div className="about-v2-right">
          <div className="about-image-wrapper">
            <img src="/images/about_repair.webp" alt="Expert Electronic Repair"/>
          </div>
          <div className="about-badge">
            <div className="team-heads">
              <img src="/images/team_avatars.webp" alt="Team members" />
            </div>
            <div className="rating-info">
              <div className="stars">
                <Star size={16} fill="#41C8F3" color="#41C8F3" />
                <Star size={16} fill="#41C8F3" color="#41C8F3" />
                <Star size={16} fill="#41C8F3" color="#41C8F3" />
                <Star size={16} fill="#41C8F3" color="#41C8F3" />
                <Star size={16} fill="#41C8F3" color="#41C8F3" />
              </div>
              <p>Rated 5 out of 5 by our clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;