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
      title: "Motherboard & Chip-Level",
      desc: "Component-level diagnosis and micro-soldering. Identifying faulty MOSFETs, diodes, capacitors, and SMD components with precision multimeters to restore systems from board-level failures.",
      icon: <Cpu size={28} />,
      tags: ["MOSFETs", "SMD Repair", "Diodes", "Diagnostics"],
    },
    {
      title: "Custom Hardware Builds",
      desc: "Designing and assembling high-performance rigs, such as AMD Ryzen 5 7000-series DDR5 gaming computers with built-in high-speed WiFi, tailored for raw performance and reliability.",
      icon: <Laptop size={28} />,
      tags: ["Ryzen 7000", "DDR5", "Gaming Rigs", "Workstations"],
    },
    {
      title: "Printers & Projectors",
      desc: "Specialized servicing and repair for mechanical and electronic hardware. Professional troubleshooting for systems like Epson L3255 printers and Panasonic PT-LB423D projectors.",
      icon: <Printer size={28} />,
      tags: ["Epson L3255", "Panasonic Projectors", "Office Systems"],
    },
    {
      title: "System Diagnostics",
      desc: "Resolving compatibility bottlenecks, RAM timing conflicts, and performance degradation. Expert upgrade paths utilizing high-speed SSDs and optimal thermal management solutions.",
      icon: <Wrench size={28} />,
      tags: ["Lenovo T480", "RAM Compatibility", "SSD Upgrades", "Thermal Paste"],
    }
  ];
  const milestones = [
    {
      year: "2021",
      title: "Drone Research at ARIES",
      desc: "Began journey at ARIES (Aerobot Research and Innovative Engineering Solutions). Gained deep, specialized drone hardware mechanics, avionics integration, and electronic soldering knowledge."
    },
    {
      year: "2022 - 2024",
      title: "Hardware Masterclass & Service",
      desc: "Accumulated 5+ years of real-world troubleshooting experience. Mastered micro-soldering, schematic diagnostic paths, and system architectures, handling complex board-level electronics repair."
    },
    {
      year: "2025",
      title: "Founding SiAn Smart Tech",
      desc: "Established the brand with a core tagline: 'Tech with Care'. Built on the principles of honest diagnosis, meticulous assembly, and providing care-oriented, transparent services to the community."
    },
    {
      year: "2026",
      title: "Professional Systems & Scale",
      desc: "Integrated structured systems: MSME registered, current account set up, active on platforms like Just Dial and Amazon, with automated sheets dashboards and clean, practical billing software."
    }
  ];
  const systems = [
    {
      title: "Structured Operations",
      desc: "Operating with professional credibility and broad reach. Fully registered as an MSME, operating with a corporate current account, and listed on top service and retail marketplaces.",
      features: ["MSME Registered", "Just Dial Verified", "Google Business Profile", "Amazon Seller Platform Ready"],
      icon: <Shield size={24} />
    },
    {
      title: "Data-Driven Decisions",
      desc: "Employing custom analytical dashboards in Google Sheets and Excel to monitor business health. Tracking income/expense statements, shop metrics, and automated service turnaround charts.",
      features: ["Income & Expense Logs", "Shop Growth Tables", "Automated Turnaround Charts", "Resource Auditing"],
      icon: <BarChart3 size={24} />
    },
    {
      title: "Simplified Invoicing",
      desc: "Designed custom, customer-first invoices. Removed complex tax jargon like GST, HSN/SAC, CGST, and SGST for micro-services, leaving clear itemized services, footer branding, and digital signatures.",
      features: ["No Unnecessary GST Jargon", "Itemized Care Actions", "Official Footer Branding", "Clear Digital Signatures"],
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
          <p className="about-hero-desc"> Combining rigorous aerospace-grade engineering knowledge with 5+ years of dedicated, component-level computer servicing. Discover our history, custom toolkits, and commitment to transparency.</p>
        </motion.section>
        <motion.section className="founder-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div className="founder-img-wrapper" variants={itemVariants}>
            <div className="founder-img-card">
              <img
                src="/images/about_repair.webp"
                srcSet="/images/about_repair-mobile.webp 480w, /images/about_repair-tablet.webp 768w, /images/about_repair.webp 1200w"
                sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
                alt="Sivakumar SG - Certified Chip Level Laptop Repair Specialist"
                loading="lazy"
                decoding="async"
              />
              <div className="founder-badge-floating">
                <span className="badge-tagline">Founder</span>
                <span className="badge-experience">Sivakumar SG</span>
              </div>
            </div>
          </motion.div>
          <motion.div className="founder-content-wrapper" variants={itemVariants}>
            <span className="section-label">Our Story</span>
            <h2>Bridging Advanced Engineering & Tech Care</h2>
            <p className="founder-bio-text"> I am Sivakumar SG, a technology service professional and the founder of SiAn Smart Tech. My journey in hardware technology began with a strong foundation at <strong>ARIES</strong> (Aerobot Research and Innovative Engineering Solutions), where I gained specialized knowledge in drone  engineering, avionics circuitry, and mechanical hardware assembly.</p>
            <p className="founder-bio-text"> Transitioning this aerospace-grade discipline into computer hardware, I have spent the last 5+ years troubleshooting, upgrading, and servicing digital hardware. SiAn Smart Tech was founded on a simple yet powerful ethos: <strong>"Tech with Care"</strong>. We do not believe in quick fixes or shortcut diagnostics. Whether it is identifying a single malfunctioning diode or deploying a custom DDR5 workstation, we treat every device with the highest standard of technical care.</p>
            <div className="founder-meta-cards">
              <div className="meta-card">
                <div className="meta-icon-box">
                  <Award size={24} />
                </div>
                <div className="meta-info">
                  <h4>5+ Years</h4>
                  <p>Tech Repair Service</p>
                </div>
              </div>
              <div className="meta-card">
                <div className="meta-icon-box">
                  <Briefcase size={24} />
                </div>
                <div className="meta-info">
                  <h4>Ex-ARIES</h4>
                  <p>Drone Hardware Knowledge</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
        <motion.section className="technical-strengths-section" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="section-header-centered">
            <span className="section-label">Technical Toolkit</span>
            <h2>Our Specialized Expertise</h2>
            <p> We dive deeper than simple module swapping. From micro-soldering motherboard chips to custom cooling loops, we ensure optimized compatibility and long-term reliability.</p>
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
            <p>From drone research to custom billing ecosystems, here is how SiAn Smart Tech has evolved.</p>
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
            <span className="section-label">Business Systems</span>
            <h2>Organized, Clear, Professional</h2>
            <p> We believe structured businesses build long-term trust. We've replaced confusing operations  with automated tracking and simplified billing.</p>
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
            <span className="stat-num">5+</span>
            <span className="stat-name">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">150+</span>
            <span className="stat-name">Happy Clients</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-name">Care Tagline Guarantee</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">0%</span>
            <span className="stat-name">Hidden Taxes/Fees</span>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
export default AboutPage;