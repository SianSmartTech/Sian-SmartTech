import { useEffect, useRef, useState } from 'react';
import "../css/App.css";
import { ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const Hero = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const beat1Ref = useRef(null);
  const beat2Ref = useRef(null);
  const beat3Ref = useRef(null);
  const beat4Ref = useRef(null);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const drawImageCover = (ctx, img, x, y, w, h, offsetX = 0.5, offsetY = 0.5) => {
    if (w <= 0 || h <= 0) return;
    const iw = img.width;
    const ih = img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    let cx, cy, cw, ch, ar = 1;
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;
    cw = iw / (nw / w);
    ch = ih / (nh / h);
    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  };
  useEffect(() => {
    const loadedImages = [];
    const isMobile = window.innerWidth <= 768;
    const totalFrames = isMobile ? 1 : 240;
    for (let i = 1; i <= totalFrames; i++) {
      loadedImages.push(new Image());
    }
    imagesRef.current = loadedImages;
    const firstImg = loadedImages[0];
    firstImg.onload = () => {
      setCanvasLoaded(true);
    };
    firstImg.src = '/cpuframes/ezgif-frame-001.jpg';
    if (firstImg.complete) {
      setCanvasLoaded(true);
    }
    let preloadingStarted = false;
    const loadRemaining = () => {
      if (isMobile || preloadingStarted) return;
      preloadingStarted = true;
      let currentIndex = 1;
      const batchSize = 6;
      const delayBetweenBatches = 80;
      const loadNextBatch = () => {
        if (currentIndex >= totalFrames) return;
        const end = Math.min(currentIndex + batchSize, totalFrames);
        for (let i = currentIndex; i < end; i++) {
          if (!loadedImages[i].src || loadedImages[i].src === window.location.href) {
            const frameNum = String(i + 1).padStart(3, '0');
            loadedImages[i].src = `/cpuframes/ezgif-frame-${frameNum}.jpg`;
          }
        }
        currentIndex = end;
        setTimeout(loadNextBatch, delayBetweenBatches);
      };
      setTimeout(loadNextBatch, 200);
    };
    const startPreloading = () => {
      loadRemaining();
      cleanupListeners();
    };
    const cleanupListeners = () => {
      window.removeEventListener('scroll', startPreloading);
      window.removeEventListener('mousemove', startPreloading);
      window.removeEventListener('touchstart', startPreloading);
    };
    // Load remaining frames after 3 seconds of idle time or immediately on user interaction
    const timerId = setTimeout(startPreloading, 3000);
    window.addEventListener('scroll', startPreloading, { passive: true });
    window.addEventListener('mousemove', startPreloading, { passive: true });
    window.addEventListener('touchstart', startPreloading, { passive: true });
    return () => {
      clearTimeout(timerId);
      cleanupListeners();
    };
  }, []);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      dimensionsRef.current = { width: w, height: h };
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    const intervalId = setInterval(handleResize, 500);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }, [canvasLoaded]);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let animationFrameId;
    let isIntersecting = false;
    const update = () => {
      if (!isIntersecting) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const rect = section.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      let progress = 0;
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        progress = -rect.top / totalHeight;
      } else if (rect.top > 0) {
        progress = 0;
      } else {
        progress = 1;
      }
      let targetFrame = 0;
      if (progress <= 0.5) {
        targetFrame = (progress / 0.5) * 239;
      } else {
        targetFrame = (1 - (progress - 0.5) / 0.5) * 239;
      }
      targetFrameRef.current = Math.max(0, Math.min(239, targetFrame));
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * 0.12;
      }
      const isMobile = window.innerWidth <= 768;
      const renderFrame = isMobile ? 0 : Math.max(0, Math.min(239, Math.round(currentFrameRef.current)));
      const img = imagesRef.current[renderFrame];
      if (img) {
        if (!img.src || img.src === window.location.href) {
          const frameNum = String(renderFrame + 1).padStart(3, '0');
          img.src = `/cpuframes/ezgif-frame-${frameNum}.jpg`;
        }
        if (img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, width, height);
          if (window.innerWidth <= 768) {
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            let drawW, drawH;
            if (canvasAspect < imgAspect) {
              drawW = width * 1.5;
              drawH = drawW / imgAspect;
              if (drawH > height) {
                drawH = height;
                drawW = drawH * imgAspect;
              }
            } else {
              drawW = width;
              drawH = height;
            }
            const drawX = (width - drawW) / 2;
            const drawY = (height - drawH) / 2;
            ctx.drawImage(img, 0, 0, img.width, img.height, drawX, drawY, drawW, drawH);
          } else {
            drawImageCover(ctx, img, 0, 0, width, height);
          }
        }
      }
      const getStyle = (val, start, peakStart, peakEnd, end) => {
        let opacity = 0;
        let translate = 20;
        if (val >= start && val <= end) {
          if (val < peakStart) {
            const factor = (val - start) / (peakStart - start);
            opacity = factor;
            translate = 20 * (1 - factor);
          } else if (val > peakEnd) {
            const factor = (val - peakEnd) / (end - peakEnd);
            opacity = 1 - factor;
            translate = -20 * factor;
          } else {
            opacity = 1;
            translate = 0;
          }
        } else if (val < start) {
          opacity = 0;
          translate = 20;
        } else if (val > end) {
          opacity = 0;
          translate = -20;
        }
        return { opacity, translate };
      };
      const b1 = getStyle(progress, 0, 0, 0.15, 0.25);
      const b2 = getStyle(progress, 0.25, 0.35, 0.45, 0.55);
      const b3 = getStyle(progress, 0.55, 0.65, 0.72, 0.8);
      const b4 = getStyle(progress, 0.8, 0.9, 1.0, 1.0);
      const applyStyle = (ref, styleObj) => {
        const el = ref.current;
        if (!el) return;
        el.style.opacity = styleObj.opacity;
        el.style.transform = `translate3d(0, ${styleObj.translate}px, 0)`;
        el.style.pointerEvents = styleObj.opacity > 0.1 ? 'auto' : 'none';
        el.style.display = styleObj.opacity > 0.001 ? 'flex' : 'none';
      };
      applyStyle(beat1Ref, b1);
      applyStyle(beat2Ref, b2);
      applyStyle(beat3Ref, b3);
      applyStyle(beat4Ref, b4);
      animationFrameId = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          animationFrameId = requestAnimationFrame(update);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasLoaded]);
  return (
    <section ref={sectionRef} id="home" className={`hero-skill-stream ${canvasLoaded ? 'canvas-loaded' : ''}`}>
      <div className="hero-sticky-container">
        <div className="hero-gradient-overlay" />
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-ss-container">
          <div className="hero-ss-content">
            <div ref={beat1Ref} className="hero-beat-overlay">
              <div className="hero-ss-left">
                <h1 className="hero-ss-title">Pro Tech<br />Services</h1>
              </div>
              <div className="hero-ss-right">
                <p className="hero-ss-subtitle">Unlock the full potential of your technology. Professional device repairs, hardware upgrades, and custom IT solutions tailored to your needs.</p>
                <div className="hero-ss-actions">
                  <Link to="/book-service" className="btn-ss-primary">
                    <span>BOOK SERVICE</span>
                    <span className="btn-icon-circle">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </span>
                  </Link>
                  <a href="/" className="btn-ss-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <span>ALL SERVICES</span>
                    <span className="btn-icon-circle">
                      <Zap size={16} strokeWidth={2.5} fill="currentColor" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div ref={beat2Ref} className="hero-beat-overlay hero-beat-initial-hidden">
              <div className="hero-ss-left">
                <h2 className="hero-ss-title">Technical<br />Workflow.</h2>
              </div>
              <div className="hero-ss-right">
                <p className="hero-ss-subtitle">Comprehensive diagnostics, precision chip-level micro-soldering, and rigorous stress testing protocols to ensure your devices function flawlessly.</p>
              </div>
            </div>
            <div ref={beat3Ref} className="hero-beat-overlay hero-beat-initial-hidden">
              <div className="hero-ss-left">
                <h2 className="hero-ss-title">Honest & Fair<br />Pricing.</h2>
              </div>
              <div className="hero-ss-right">
                <p className="hero-ss-subtitle">Pay only for the actual repairs done. Premium technical support and chip-level servicing at rates significantly lower than third-party and authorized stores.</p>
              </div>
            </div>
            <div ref={beat4Ref} className="hero-beat-overlay hero-beat-initial-hidden">
              <div className="hero-ss-left">
                <h2 className="hero-ss-title">Expert Repair.<br />Guaranteed Value.</h2>
              </div>
              <div className="hero-ss-right">
                <p className="hero-ss-subtitle">Whether it is a laptop repair, CCTV installation, or custom website development, Sian SmartTech delivers high-quality service at unbeatable prices.</p>
                <div className="hero-ss-actions">
                  <Link to="/book-service" className="btn-ss-primary">
                    <span>BOOK SERVICE</span>
                    <span className="btn-icon-circle">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </span>
                  </Link>
                  <a href="/" className="btn-ss-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <span>ALL SERVICES</span>
                    <span className="btn-icon-circle">
                      <Zap size={16} strokeWidth={2.5} fill="currentColor" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;