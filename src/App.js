import "./css/App.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect, Suspense } from "react";
import Header from "./components/Header";
import { pageview } from "./utils/analytics";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HardwareServices from "./pages/HardwareServices";
import ITServices from "./pages/ITServices";
import PriceListPage from "./pages/PriceListPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import AllFaqsPage from "./pages/AllFaqsPage";
import BookServicePage from "./pages/BookServicePage";
import AdminDashboard from "./pages/AdminDashboard";
import TrackTicket from "./pages/TrackTicket";
import Chatbot from "./components/Chatbot";
function PageLoading() {
  return (
    <div className="page-loading-fallback">
      <div className="page-loading-spinner"></div>
    </div>
  );
}
function AppContent() {
  const location = useLocation();
  useEffect(() => {
    const routeTitles = {
      "/": "SiAn SmartTech | Premium Computer & Mobile Repair Services",
      "/hardware-services": "Computer & Mobile Hardware Repairs | SiAn SmartTech",
      "/it-services": "IT Software & Web Development Services | SiAn SmartTech",
      "/price-list": "Computer & Mobile Repair Price List | SiAn SmartTech",
      "/about": "About Us - Tech Repair Experts in Madurai | SiAn SmartTech",
      "/book-service": "Book Computer & Mobile Repair Online | SiAn SmartTech",
      "/faq": "Tech Repair FAQs & Troubleshooting Tips | SiAn SmartTech",
      "/all-faqs": "Complete Tech Repair Guide & FAQs | SiAn SmartTech",
      "/admin": "Admin Dashboard | SiAn SmartTech",
      "/track": "Track Your Tech Repair Ticket Online | SiAn SmartTech"
    };
    const routeDescriptions = {
      "/": "Expert computer, laptop & mobile repair in Madurai. SiAn SmartTech offers certified hardware diagnostics, chip-level repairs & genuine replacement parts.",
      "/hardware-services": "Professional hardware repair services in Madurai. Expert chip-level repair, screen replacements, motherboard fixes & laptop servicing.",
      "/it-services": "Comprehensive IT software solutions, web development, custom software, and digital services in Madurai by SiAn SmartTech specialists.",
      "/price-list": "Transparent pricing for computer, laptop, and mobile repair in Madurai. Check diagnostic rates and service costs at SiAn SmartTech.",
      "/about": "Learn about SiAn SmartTech, Madurai's trusted computer and mobile repair center providing reliable hardware and IT tech support.",
      "/book-service": "Book computer, laptop, or mobile repair service online with SiAn SmartTech Madurai. Fast diagnostics, doorstep pickup & quick turnaround.",
      "/faq": "Find answers to frequently asked questions regarding computer and mobile repair services, pricing, warranty, and IT support in Madurai.",
      "/all-faqs": "Comprehensive tech repair guide and FAQs for computer, laptop, and mobile servicing, hardware upgrades, and solutions in Madurai.",
      "/admin": "SiAn SmartTech Admin Dashboard for managing computer repair orders, service tickets, customer inquiries, and system operations in Madurai.",
      "/track": "Track the real-time status of your computer, laptop, or mobile repair ticket online with SiAn SmartTech Madurai quick tracking system."
    };
    document.title = routeTitles[location.pathname] || "SiAn SmartTech | Premium Computer & Mobile Repair Services";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = routeDescriptions[location.pathname] || "Expert computer, laptop & mobile repair in Madurai. SiAn SmartTech offers certified hardware diagnostics, chip-level repairs & genuine replacement parts.";
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = location.pathname === '/' ? 'https://siansmarttech.com/' : `https://siansmarttech.com${location.pathname}`;
    pageview(location.pathname, document.title);
  }, [location.pathname]);
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const cursor = document.querySelector('.custom-cursor');
    const glow = document.querySelector('.cursor-glow');
    let ticking = false;
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    if (isTouchDevice) {
      if (cursor) cursor.classList.add('cursor-hidden');
      if (glow) glow.classList.add('cursor-hidden');
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (cursor) {
            cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
          }
          if (glow) {
            glow.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target && typeof target.closest === 'function'
        ? target.closest('a, button, .dropdown-trigger, .theme-toggle, .btn-primary, .accent-card-action')
        : null;
      if (isInteractive) {
        cursor?.classList.add('cursor-hover');
      } else {
        cursor?.classList.remove('cursor-hover');
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  useEffect(() => {
    const observerOptions = { threshold: 0.02, rootMargin: "0px 0px 80px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    const observeNewElements = () => {
      const revealElements = document.querySelectorAll(".reveal:not(.active)");
      revealElements.forEach((el) => observer.observe(el));
      const images = document.querySelectorAll('img:not(.img-processed)');
      images.forEach(img => {
        img.classList.add('img-reveal', 'img-processed');
        const isHero = img.classList.contains('hero-img') ||
          img.closest('.hero-section') ||
          img.closest('.hero-container') ||
          img.getAttribute('fetchpriority') === 'high' ||
          img.getAttribute('loading') === 'eager';
        if (!img.hasAttribute('loading') && !isHero) {
          img.setAttribute('loading', 'lazy');
        }
        if (isHero && !img.hasAttribute('fetchpriority')) {
          img.setAttribute('fetchpriority', 'high');
        }
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.onload = () => img.classList.add('loaded');
        }
      });
    };
    observeNewElements();
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
  const isAdmin = location.pathname === '/admin';
  return (
    <>
      {!isAdmin && <Header />}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hardware-services" element={<HardwareServices />} />
          <Route path="/it-services" element={<ITServices />} />
          <Route path="/price-list" element={<PriceListPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/all-faqs" element={<AllFaqsPage />} />
          <Route path="/book-service" element={<BookServicePage />} />
          <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
          <Route path="/track" element={<TrackTicket />} />
          <Route path="/track/:ticketId" element={<TrackTicket />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && (<Suspense fallback={null}><Chatbot /></Suspense>)}
    </>
  );
}
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="cursor-glow"></div>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;