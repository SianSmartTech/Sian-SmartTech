import "./css/App.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HardwareServices from "./pages/HardwareServices";
import ITServices from "./pages/ITServices";
import PriceListPage from "./pages/PriceListPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import AllFaqsPage from "./pages/AllFaqsPage";
import ScrollToTop from "./components/ScrollToTop";
import BookServicePage from "./pages/BookServicePage";
import WhatsAppButton from "./components/WhatsAppButton";
import Chatbot from "./components/Chatbot";
import AdminDashboard from "./pages/AdminDashboard";
import TrackService from "./pages/TrackService";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
function AppContent() {
  const location = useLocation();
  useEffect(() => {
    const routeTitles = {
      "/": "Home | Sian SmartTech",
      "/hardware-services": "Hardware Repair Services | Sian SmartTech",
      "/it-services": "IT Software Solutions | Sian SmartTech",
      "/about": "About Us | Sian SmartTech",
      "/book-service": "Book a Service | Sian SmartTech",
      "/faq": "Frequently Asked Questions | Sian SmartTech",
      "/admin": "Admin Dashboard | Sian SmartTech",
      "/track": "Track Service | Sian SmartTech"
    };
    document.title = routeTitles[location.pathname] || "Sian SmartTech | Tech Experts";
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
    const cursor = document.querySelector('.custom-cursor');
    const glow = document.querySelector('.cursor-glow');
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
    const observerOptions = {
      threshold: 0.02,
      rootMargin: "0px 0px 80px 0px",
    };
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
        <Route path="/track" element={<TrackService />} />
        <Route path="/track/:ticketId" element={<TrackService />} />
      </Routes>
      {!isAdmin && <Footer />}
      <ScrollToTop />
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <Chatbot />}
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