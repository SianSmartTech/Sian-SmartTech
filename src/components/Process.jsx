import "../css/App.css";
const Process = () => {
  const steps = [
    { id: '01', title: 'Consultation', description: 'We discuss your needs, gather requirements, and formulate the initial strategy.', image: '/images/process/define.webp' },
    { id: '02', title: 'Diagnostics', description: 'Comprehensive assessment to trace issues and analyze technical requirements.', image: '/images/process/design.webp' },
    { id: '03', title: 'Implementation', description: 'Expert repair, custom coding, or hardware integration using genuine parts.', image: '/images/process/build.webp' },
    { id: '04', title: 'Quality Assurance', description: 'Rigorous verification protocols and testing to guarantee flawless operation.', image: '/images/process/launch.webp' },
    { id: '05', title: 'Handback', description: 'Final validation check, safe delivery of assets, and post-service walkthrough.', image: '/images/process/handover.webp' }
  ];
  return (
    <section id="process" className="process-section-v2 reveal">
      <div className="process-bg-text">FLOW</div>
      <div className="process-path-wrapper">
        <div className="process-v2-header">
          <p className="process-v2-subtitle">How We Work</p>
          <h2 className="process-v2-title">Our <span className="text-gradient">Technical Workflow</span></h2>
        </div>
        <div className="process-sticker-path">
          <svg className="process-svg-layer desktop-svg" viewBox="0 0 1000 600" fill="none" preserveAspectRatio="none">
            <path d="M166,150 L833,150" className="process-path-line" />
            <path d="M833,150 C833,300 333,300 333,450" className="process-path-line" />
            <path d="M333,450 L667,450" className="process-path-line" />
          </svg>
          <svg className="process-svg-layer mobile-svg" viewBox="0 0 200 1000" fill="none" preserveAspectRatio="none">
            <path d="M100,100 Q150,300 100,500 T100,900" className="process-path-line" />
          </svg>
          <div className="stickers-grid">
            {steps.map((step, index) => (
              <div key={step.id} className={`process-sticker sticker-${index + 1}`}>
                <div className="sticker-pin"></div>
                <div className="sticker-content">
                  <span className="sticker-number">{step.id}</span>
                  <h3 className="sticker-title">{step.title}</h3>
                  <p className="sticker-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Process;