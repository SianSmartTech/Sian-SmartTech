import "./css/App.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";


const HardwareServices = lazy(() => import("./pages/HardwareServices"));
const ITServices = lazy(() => import("./pages/ITServices"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AllFaqsPage = lazy(() => import("./pages/AllFaqsPage"));
const BookServicePage = lazy(() => import("./pages/BookServicePage"));
const AdminWrapper = lazy(() => import("./pages/AdminWrapper"));
const TrackTicket = lazy(() => import("./pages/TrackTicket"));
const Chatbot = lazy(() => import("./components/Chatbot"));
function AppContent() {
  const location = useLocation();
  useEffect(() => {
    const routeTitles = {
      "/": "Sian SmartTech | Custom PC & Laptop Service, Madurai",
      "/hardware-services": "Hardware Repair & Chip Level Service | Sian SmartTech",
      "/it-services": "IT Software Solutions & PC Set Up | Sian SmartTech",
      "/price-list": "Repair Service & Custom PC Price List | Sian SmartTech",
      "/about": "About Sian SmartTech | Premium Tech Repair Experts",
      "/book-service": "Book Laptop, PC & Drone Service | Sian SmartTech",
      "/faq": "Frequently Asked Questions on Service | Sian SmartTech",
      "/all-faqs": "All FAQs for Tech Repair Services | Sian SmartTech",
      "/admin": "Admin Dashboard Control Panel | Sian SmartTech",
      "/track": "Track Your Repair Service Ticket | Sian SmartTech"
    };
    const routeDescriptions = {
      "/": "Expert computer, laptop, and mobile repair services in Madurai. Sian SmartTech provides professional hardware diagnostics, IT solutions, and genuine parts.",
      "/hardware-services": "Professional hardware repair services in Madurai. We fix motherboards, screens, batteries, and provide chip-level servicing for laptops and mobiles.",
      "/it-services": "Comprehensive IT software solutions, web development, custom software, and digital services by Sian SmartTech experts.",
      "/price-list": "Transparent and affordable pricing for all computer, laptop, and mobile repair services at Sian SmartTech Madurai.",
      "/about": "Learn more about Sian SmartTech, Madurai's trusted experts in premium computer and mobile repair services with years of experience.",
      "/book-service": "Book your computer or mobile repair service online with Sian SmartTech for fast, reliable, and professional tech support.",
      "/faq": "Find answers to frequently asked questions about our repair services, pricing, warranty, and technical support.",
      "/all-faqs": "Comprehensive list of all frequently asked questions regarding Sian SmartTech services and support.",
      "/admin": "Sian SmartTech Admin Dashboard.",
      "/track": "Track the real-time status of your computer or mobile repair ticket at Sian SmartTech."
    };
    document.title = routeTitles[location.pathname] || "Sian SmartTech | Tech Experts";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = routeDescriptions[location.pathname] || "Expert computer, laptop, and mobile repair services in Madurai. Professional hardware diagnostics and IT solutions.";
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
    const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const cursor = document.querySelector('.custom-cursor');
    const glow = document.querySelector('.cursor-glow');
    
    if (isMobile) {
      if (glow) glow.style.display = 'none';
      if (cursor) cursor.style.display = 'none';
      
      const handleContextMenu = (e) => {
        if (e.target.tagName === 'IMG') {
          e.preventDefault();
        }
      };
      document.addEventListener('contextmenu', handleContextMenu);
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
    
    let ticking = false;
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
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
      const isInteractive = target.closest('a, button, .dropdown-trigger, .theme-toggle, .btn-primary, .accent-card-action');
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
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
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
      <Suspense fallback={
        <div className="route-loading-fallback">
          <div className="spinner-loader"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hardware-services" element={<HardwareServices />} />
          <Route path="/it-services" element={<ITServices />} />
          <Route path="/price-list" element={<PriceListPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/all-faqs" element={<AllFaqsPage />} />
          <Route path="/book-service" element={<BookServicePage />} />
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="/track" element={<TrackTicket />} />
          <Route path="/track/:ticketId" element={<TrackTicket />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      <ScrollToTop />
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </>
  );
}
function App() {
  return (
    <ThemeProvider>
      <div className="cursor-glow"></div>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;