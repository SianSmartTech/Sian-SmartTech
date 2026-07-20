import { useEffect, useRef } from 'react';
import "../css/App.css";
import "../css/Testimonials.css";
import { Star, Quote, TrendingUp } from 'lucide-react';
import { testimonials } from '../mockData';
const Testimonials = () => {
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const scrollLeftState = useRef(0);
  const scrollAccumulator = useRef(0);
  let baseTestimonials = testimonials;
  while (baseTestimonials.length < 8) {
    baseTestimonials = [...baseTestimonials, ...baseTestimonials];
  }
  const duplicatedTestimonials = [...baseTestimonials, ...baseTestimonials];
  const getAvatarBg = (name) => {
    const char = name.trim().charAt(0).toUpperCase();
    const code = char.charCodeAt(0);
    const gradients = [
      'linear-gradient(135deg, #2563eb, #60a5fa)',
      'linear-gradient(135deg, #059669, #34d399)',
      'linear-gradient(135deg, #7c3aed, #a78bfa)',
      'linear-gradient(135deg, #ea580c, #fb923c)',
      'linear-gradient(135deg, #db2777, #f472b6)',
      'linear-gradient(135deg, #0d9488, #2dd4bf)',
    ];
    return gradients[code % gradients.length];
  };
  const handleStart = (clientX) => {
    const container = scrollRef.current;
    if (!container) return;
    isDown.current = true;
    container.classList.add('active-dragging');
    startX.current = clientX - container.offsetLeft;
    scrollLeftState.current = container.scrollLeft;
  };
  const handleEnd = () => {
    isDown.current = false;
    const container = scrollRef.current;
    if (container) {
      container.classList.remove('active-dragging');
    }
  };
  const handleMove = (clientX) => {
    if (!isDown.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const x = clientX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    container.scrollLeft = scrollLeftState.current - walk;
  };
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const halfWidth = container.scrollWidth / 2;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollLeft = container.scrollLeft - halfWidth;
      scrollAccumulator.current = container.scrollLeft;
    } else if (container.scrollLeft <= 10) {
      container.scrollLeft = container.scrollLeft + halfWidth;
      scrollAccumulator.current = container.scrollLeft;
    }
  };
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const timer = setTimeout(() => {
      const halfWidth = container.scrollWidth / 2;
      container.scrollLeft = halfWidth;
      scrollAccumulator.current = halfWidth;
    }, 100);
    let animationFrameId;
    let lastTime = performance.now();
    const speed = 0.025;
    const animate = (now) => {
      const delta = Math.min(now - lastTime, 64);
      lastTime = now;
      if (!isDown.current && !isHovered.current) {
        scrollAccumulator.current += speed * delta;
        container.scrollLeft = scrollAccumulator.current;
      } else {
        scrollAccumulator.current = container.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <section id="testimonials" className="testimonials-section-v2 reveal">
      <div className="testimonials-bg-text">REVIEWS</div>
      <div className="testimonials-v2-wrapper">
        <div className="testimonials-v2-header">
          <p className="testimonials-v2-subtitle">What Our Clients Say</p>
          <h2 className="testimonials-v2-title">Customer <span className="text-gradient">Success Stories</span></h2>
          <p className="testimonials-v2-desc">
            While delivering top-notch IT solutions and laptop repair services is our passion, what truly drives us is hearing how Sian SmartTech helps our clients in Madurai optimize their workflow, repair their devices, and build their success stories.
          </p>
        </div>
        <div className="sian-smart-tech-carousel-container">
          <div ref={scrollRef} className="sian-smart-tech-carousel-track" onScroll={handleScroll} onMouseDown={(e) => handleStart(e.pageX)} onMouseUp={handleEnd} onMouseMove={(e) => { handleMove(e.pageX); isHovered.current = true; }} onTouchStart={(e) => handleStart(e.touches[0].pageX)} onTouchEnd={handleEnd} onTouchMove={(e) => handleMove(e.touches[0].pageX)} onMouseEnter={() => { isHovered.current = true; }} onMouseLeave={() => { handleEnd(); isHovered.current = false }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="sian-smart-tech-card">
                <div className="sian-smart-tech-card-quote-badge">
                  <Quote size={18} className="sian-smart-tech-quote-icon" />
                </div>
                <p className="sian-smart-tech-card-text">"{testimonial.content}"</p>
                <div className="sian-smart-tech-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < testimonial.rating ? "#fbbf24" : "transparent"} color={i < testimonial.rating ? "#fbbf24" : "#cbd5e1"} className="sian-smart-tech-star-icon" />))}
                </div>
                <div className="sian-smart-tech-card-profile">
                  <div className="sian-smart-tech-avatar-wrapper">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={`Client ${testimonial.name} - Sian SmartTech Madurai Customer`} className="sian-smart-tech-avatar-img" loading="lazy" decoding="async" />
                    ) : (
                      <div className="sian-smart-tech-avatar-fallback" style={{ '--avatar-bg': getAvatarBg(testimonial.name) }}>
                        {testimonial.name.trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="sian-smart-tech-avatar-badge green-badge">
                      <TrendingUp size={10} color="#fff" />
                    </div>
                  </div>
                  <div className="sian-smart-tech-profile-info">
                    <h4 className="sian-smart-tech-profile-name">{testimonial.name}</h4>
                    <p className="sian-smart-tech-profile-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sian-smart-tech-carousel-hint">← Drag to scroll or hover to pause →</div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;