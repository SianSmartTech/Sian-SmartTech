import { motion } from 'framer-motion';
import { Shield, Cpu, Wrench, FileText, BarChart3, CheckCircle2, Award, Briefcase, Laptop, Printer } from 'lucide-react';
import "../css/App.css";
import "../css/AboutPage.css";
const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14
      }
    }
  };
  const toolkit = [
    {
      title: "Chip-Level & Board Repair",
      desc: "Fixing power failures, short circuits, and dead laptop motherboards at the circuit level so you don't have to spend on expensive full-board replacements.",
      icon: <Cpu size={28} />,
      tags: ["Board Repair", "Power Fix", "Chip Repair", "Dead Laptop Restore"],
    },
    {
      title: "Custom PC Builds",
      desc: "Designing and assembling fast, reliable computers tailored to your exact needs — for gaming, office work, video editing, or everyday tasks.",
      icon: <Laptop size={28} />,
      tags: ["Gaming PCs", "Workstations", "Office PCs", "Custom Rigs"],
    },
    {
      title: "Printers & Projectors",
      desc: "Complete repair and maintenance for home and office equipment, including ink tank printers, paper jam issues, laser printers, and projectors.",
      icon: <Printer size={28} />,
      tags: ["Printer Service", "Paper Jam Fix", "Inkjet & Laser", "Projector Repair"],
    },
    {
      title: "Speed & Performance Boost",
      desc: "Speeding up slow computers, fixing heating issues, adding fast SSD storage, upgrading memory (RAM), and making old laptops work like new.",
      icon: <Wrench size={28} />,
      tags: ["SSD Upgrade", "RAM Boost", "Overheating Fix", "Speed Cleaning"],
    }
  ];
  const milestones = [
    {
      year: "7+ Years Exp",
      title: "Hardware Masterclass & Service",
      desc: "Built deep real-world experience in troubleshooting computer hardware, micro-soldering, power repairs, and servicing all major computer brands."
    },
    {
      year: "2021",
      title: "Drone Research at ARIES",
      desc: "Gained foundational experience at ARIES (Aerobot Research and Innovative Engineering Solutions), working on precision circuitry and drone hardware assembly."
    },
    {
      year: "2025",
      title: "Founding SiAn Smart Tech",
      desc: "Established the business with a clear tagline: 'Tech with Care'. Focused on honest advice, transparent pricing, and treating every device with high care."
    },
    {
      year: "2026",
      title: "Professional Systems & Scale",
      desc: "Expanded into an officially registered MSME business, offering clear digital invoicing, easy service updates, and verified online customer support."
    }
  ];
  const systems = [
    {
      title: "Registered & Verified Business",
      desc: "Fully government registered (MSME) and verified across Google and local platforms, ensuring complete peace of mind when giving us your devices.",
      features: ["MSME Registered", "Google Maps Verified", "JustDial Verified Partner", "Direct Customer Support"],
      icon: <Shield size={24} />
    },
    {
      title: "Organized Job Tracking",
      desc: "Using clear tracking for every service ticket so your device repair status is updated, organized, and completed on time.",
      features: ["Live Job Tracking", "Transparent Status", "On-Time Service", "Detailed Service Logs"],
      icon: <BarChart3 size={24} />
    },
    {
      title: "Simple & Clear Bills",
      desc: "Straightforward invoices without confusing technical terms or unexpected extra costs. You see line-by-line what work was done.",
      features: ["No Hidden Charges", "Clear Itemized Bill", "Digital Receipts", "Transparent Warranty"],
      icon: <FileText size={24} />
    }
  ];
  return (
    <div className="v2-page-layout">
      <div className="about-page-container">
        <div className="about-glow-1"></div>
        <div className="about-glow-2"></div>
        <motion.section className="about-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="about-hero-tag">Tech with Care</span>
          <h1>Behind <span>SiAn Smart Tech</span></h1>
          <p className="about-hero-desc">
            Combining drone engineering precision with 7+ years of dedicated computer and laptop repair experience. Discover our story, honest service promise, and customer-first approach.
          </p>
        </motion.section>
        <motion.section className="founder-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div className="founder-img-wrapper" variants={itemVariants}>
            <div className="founder-img-card">
              <img src="/images/about_repair.webp" alt="Sivakumar SG - Certified Chip Level Laptop Repair Specialist" loading="lazy" decoding="async" />
              <div className="founder-badge-floating">
                <span className="badge-tagline">Founder</span>
                <span className="badge-experience">Sivakumar SG</span>
              </div>
            </div>
          </motion.div>
          <motion.div className="founder-content-wrapper" variants={itemVariants}>
            <span className="section-label">Our Story</span>
            <h2>Expert Tech Repair Made Simple & Honest</h2>
            <p className="founder-bio-text">
              Hello! I am Sivakumar SG, founder of SiAn Smart Tech. My journey in technology started with drone engineering at <strong>ARIES</strong> (Aerobot Research and Innovative Engineering Solutions), where I learned how electronic components work together at a circuit level.
            </p>
            <p className="founder-bio-text">
              Over the last 7+ years, I have applied that same careful precision to repairing laptops, desktop PCs, printers, and custom hardware. At SiAn Smart Tech, our core philosophy is <strong>"Tech with Care"</strong>. We don't believe in quick shortcuts or confusing jargon. We explain what's wrong in plain language, offer transparent pricing, and fix your devices with standard-setting quality.
            </p>
            <div className="founder-meta-cards">
              <div className="meta-card">
                <div className="meta-icon-box">
                  <Award size={24} />
                </div>
                <div className="meta-info">
                  <h4>7+ Years</h4>
                  <p>Tech Repair Experience</p>
                </div>
              </div>
              <div className="meta-card">
                <div className="meta-icon-box">
                  <Briefcase size={24} />
                </div>
                <div className="meta-info">
                  <h4>Drone Engineering</h4>
                  <p>ARIES Research Background</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
        <motion.section className="technical-strengths-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="section-header-centered">
            <span className="section-label">Our Services</span>
            <h2>What We Do Best</h2>
            <p>
              From chip-level laptop repairs to speed upgrades and custom PC builds, we take care of all your device needs.
            </p>
          </div>
          <div className="toolkit-grid">
            {toolkit.map((item, idx) => (
              <motion.div key={idx} className="toolkit-card" variants={itemVariants}>
                <div className="toolkit-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="toolkit-card-tags">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="toolkit-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        <motion.section className="milestones-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="section-header-centered">
            <span className="section-label">Our Journey</span>
            <h2>Milestones & Growth</h2>
            <p>How SiAn Smart Tech grew from hands-on repair experience into a trusted technology service provider.</p>
          </div>
          <div className="timeline-container">
            <div className="timeline-line"></div>
            {milestones.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot"></div>
                <motion.div className="timeline-content-side" variants={itemVariants}>
                  <div className="timeline-card">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
                <motion.div className="timeline-date-side" variants={itemVariants}>
                  {item.year}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section className="systems-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="section-header-centered">
            <span className="section-label">Our Standards</span>
            <h2>Simple, Honest & Professional</h2>
            <p>
              We keep operations transparent with easy tracking, verified business listings, and jargon-free receipts.
            </p>
          </div>
          <div className="systems-grid">
            {systems.map((system, idx) => (
              <motion.div key={idx} className="system-card" variants={itemVariants}>
                <div className="system-header">
                  <div className="system-icon">{system.icon}</div>
                  <h3>{system.title}</h3>
                </div>
                <p>{system.desc}</p>
                <ul className="system-features-list">
                  {system.features.map((feature, fIdx) => (
                    <li key={fIdx}>
                      <CheckCircle2 size={16} className="system-check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>
        <motion.section className="stats-banner" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="stat-item">
            <span className="stat-num">7+</span>
            <span className="stat-name">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">150+</span>
            <span className="stat-name">Satisfied Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-name">Tech With Care</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">0%</span>
            <span className="stat-name">Hidden Fees</span>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
export default AboutPage;