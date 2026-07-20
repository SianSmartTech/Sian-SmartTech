import { useEffect, useRef } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import "../css/App.css";
import "../css/Testimonials.css";
import "../css/GoogleReviews.css";
import { googleReviews } from '../mockData';
const GoogleReviews = () => {
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const scrollLeftState = useRef(0);
  const scrollAccumulator = useRef(0);
  let baseReviews = googleReviews;
  while (baseReviews.length < 8) {
    baseReviews = [...baseReviews, ...baseReviews];
  }
  const duplicatedReviews = [...baseReviews, ...baseReviews];
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
    <section id="google-reviews" className="google-reviews-section reveal">
      <div className="google-reviews-bg-text">GOOGLE</div>
      <div className="google-reviews-wrapper">
        <div className="google-reviews-header">
          <p className="google-reviews-subtitle">Google Reviews</p>
          <h2 className="google-reviews-title">What Our Customers Say <span className="text-gradient">On Google</span></h2>
          <p className="google-reviews-desc">Sian SmartTech is rated 4.9/5 stars for the best laptop repair service and computer service center in Madurai. Read verified customer reviews and feedback from our clients.</p>
        </div>
        <div className="sian-smart-tech-carousel-container">
          <div
            ref={scrollRef}
            className="sian-smart-tech-carousel-track"
            onScroll={handleScroll}
            onMouseDown={(e) => handleStart(e.pageX)}
            onMouseUp={handleEnd}
            onMouseMove={(e) => {
              handleMove(e.pageX);
              isHovered.current = true;
            }}
            onTouchStart={(e) => handleStart(e.touches[0].pageX)}
            onTouchEnd={handleEnd}
            onTouchMove={(e) => handleMove(e.touches[0].pageX)}
            onMouseEnter={() => {
              isHovered.current = true;
            }}
            onMouseLeave={() => {
              handleEnd();
              isHovered.current = false;
            }}>
            {duplicatedReviews.map((review, index) => (
              <div key={index} className="sian-smart-tech-card google-card-style">
                <div className="sian-smart-tech-card-quote-badge google-badge-style">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                </div>
                <p className="sian-smart-tech-card-text">"{review.text}"</p>
                <div className="sian-smart-tech-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < review.rating ? "#fbbf24" : "transparent"} color={i < review.rating ? "#fbbf24" : "#cbd5e1"} className="sian-smart-tech-star-icon" />
                  ))}
                </div>
                <div className="sian-smart-tech-card-profile">
                  <div className="sian-smart-tech-avatar-wrapper">
                    <div className="sian-smart-tech-avatar-fallback" style={{ background: getAvatarBg(review.authorName) }}>
                      {review.authorName.trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="sian-smart-tech-avatar-badge google-badge-blue">
                      <TrendingUp size={10} color="#fff" />
                    </div>
                  </div>
                  <div className="sian-smart-tech-profile-info">
                    <h4 className="sian-smart-tech-profile-name">
                      {review.authorName}{review.localGuide && <span className="google-local-guide">Guide</span>}
                    </h4>
                    <p className="sian-smart-tech-profile-role">{review.relativeTime}</p>
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
export default GoogleReviews;