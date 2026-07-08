import { Users, Zap, Star, CalendarCheck, Clock, Wrench, Smile, Award, Shield, Heart } from 'lucide-react';
import "../css/App.css";
const AboutPage = () => {
  const steps = [
    { id: '01', title: 'Make Appointment', description: 'Schedule a repair at your convenience through our website or phone. We offer flexible timeslots to fit your busy schedule.', icon: <CalendarCheck size={32} color="#41C8F3" /> },
    { id: '02', title: 'We Connect As Soon As Possible', description: 'We will contact you as fast as possible to confirm details and coordinate the service. We prioritize quick and direct support.', icon: <Clock size={32} color="#41C8F3" /> },
    { id: '03', title: 'Solve Your Problem', description: 'Fast and efficient repair using genuine parts to get you back on track. We ensure quality with every fix.', icon: <Wrench size={32} color="#41C8F3" /> }
  ];
  const stats = [
    { label: 'Happy Clients', count: '1500+', icon: <Smile size={40} color="var(--accent-primary)" /> },
    { label: 'Members Active', count: '25+', icon: <Users size={40} color="var(--accent-primary)" /> },
    { label: 'Years Experience', count: '10+', icon: <Award size={40} color="var(--accent-primary)" /> }
  ];
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">ABOUT</div>
      <section className="page-hero hero-about">
        <div className="container">
          <span className="section-subtitle">About SiAn Smart Tech</span>
          <h1 className="section-title">About Us</h1>
          <p className="page-description">Your trusted partner for all computer, hardware, and electronic repair needs. Discover who we are and how we work.</p>
        </div>
      </section>
      <div className="curved-section">
        <section className="section">
          <div className="container">
            <div className="about-page-grid reveal">
              <div className="about-page-image">
                <img src="/images/about_repair.webp" alt="Expert Electronic Repair" />
                <div className="about-page-badge">
                  <div className="about-page-stars">
                    <Star size={16} fill="#41C8F3" color="#41C8F3" />
                    <Star size={16} fill="#41C8F3" color="#41C8F3" />
                    <Star size={16} fill="#41C8F3" color="#41C8F3" />
                    <Star size={16} fill="#41C8F3" color="#41C8F3" />
                    <Star size={16} fill="#41C8F3" color="#41C8F3" />
                  </div>
                  <p>Rated 5 out of 5 by our clients</p>
                </div>
              </div>
              <div className="about-page-content">
                <span className="section-subtitle">Who We Are</span>
                <h2 className="section-title"> We Can Fix All Types Of <br /> Computers & Laptops<span className="dot"></span>
                </h2>
                <p className="about-page-desc"> Providing reliable and professional repair services for all your electronic devices. From high-end gaming laptops to custom workstations, we ensure your tech is back in perfect condition with genuine parts and expert care.</p>
                <p className="about-page-desc"> Founded with a vision to make quality tech repair accessible to everyone, SiAn SmartTech has grown into a trusted name in hardware services. Our team of certified professionals brings years of hands-on experience to every repair job.</p>
                <div className="about-page-features">
                  <div className="about-page-feature">
                    <div className="feature-icon-box">
                      <Zap size={24} color="#FFFFFF" />
                    </div>
                    <div className="feature-text">
                      <h3>Quick Repair</h3>
                      <p>We understand your time is valuable. Most laptop and computer repairs are completed within 24 hours with our express service.</p>
                    </div>
                  </div>
                  <div className="about-page-feature">
                    <div className="feature-icon-box">
                      <Shield size={24} color="#FFFFFF" />
                    </div>
                    <div className="feature-text">
                      <h3>Genuine Parts</h3>
                      <p>We use only authentic, high-quality components for every repair to ensure long-lasting performance and reliability.</p>
                    </div>
                  </div>
                  <div className="about-page-feature">
                    <div className="feature-icon-box">
                      <Heart size={24} color="#FFFFFF" />
                    </div>
                    <div className="feature-text">
                      <h3>Customer Satisfaction</h3>
                      <p>Your satisfaction is our top priority. We provide transparent pricing, regular updates, and after-service support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="curved-section">
        <section className="section bg-alt">
          <div className="container">
            <div className="process-wrapper reveal">
              <div className="process-left">
                <span className="section-subtitle">How We Work</span>
                <h2 className="section-title">Our Process</h2>
                <div className="process-steps">
                  {steps.map((step) => (
                    <div key={step.id} className="process-step">
                      <div className="step-number">{step.id}</div>
                      <div className="step-content">
                        <div className="step-icon-header">
                          {step.icon}
                          <h3>{step.title}</h3>
                        </div>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="process-right">
                <div className="stats-grid">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-info">
                        <span className="stat-count">{stat.count}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default AboutPage;