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

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    const currentCanonicalUrl = `https://siansmarttech.com${location.pathname === '/' ? '' : location.pathname}`;
    canonical.href = currentCanonicalUrl;

    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (location.pathname === '/') {
      if (!amphtml) {
        amphtml = document.createElement('link');
        amphtml.rel = 'amphtml';
        document.head.appendChild(amphtml);
      }
      amphtml.href = 'https://siansmarttech.com/amp.html';
    } else {
      if (amphtml) {
        amphtml.remove();
      }
    }

    const schemaId = 'dynamic-jsonld-schema';
    let script = document.getElementById(schemaId);
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const defaultSchemas = {
      "/hardware-services": {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Hardware Repair & Chip Level Service",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Sian SmartTech",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.",
            "addressLocality": "Madurai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "625009",
            "addressCountry": "IN"
          }
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Hardware Services Catalog",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laptop Repair & Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Computer Repair & Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Printer Repair & Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drone Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Chip Level Motherboard Service" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV Installation & Setup" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Data Backup & File Recovery" } }
          ]
        }
      },
      "/it-services": {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "IT Software Solutions & PC Set Up",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Sian SmartTech",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.",
            "addressLocality": "Madurai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "625009",
            "addressCountry": "IN"
          }
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "IT Services Catalog",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development & Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Freelancing IT Services" } }
          ]
        }
      },
      "/faq": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I change a component after confirming the configuration?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can change components as long as the build process hasn't started. Please contact our support team immediately if you need to make adjustments to your order."
            }
          },
          {
            "@type": "Question",
            "name": "Can I get my PC within 7 working days?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard builds typically take 5-7 business days. Express shipping options may be available depending on component availability and your location."
            }
          },
          {
            "@type": "Question",
            "name": "Do you preinstall games or software on custom PCs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We preinstall the operating system and all necessary drivers. We can also preinstall specific software or games upon request during the configuration process."
            }
          },
          {
            "@type": "Question",
            "name": "Laptop vs. PC: Which is better?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on your needs. Laptops offer portability, while PCs generally provide better performance, cooling, and upgradability for the same price point."
            }
          },
          {
            "@type": "Question",
            "name": "Why should I choose a custom PC over a prebuilt PC?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Custom PCs allow you to choose high-quality components tailored to your specific needs, often resulting in better performance, easier upgrades, and better value for money."
            }
          }
        ]
      },
      "/all-faqs": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Can I change a component after confirming the configuration?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can change components as long as the build process hasn't started. Please contact our support team immediately if you need to make adjustments to your order." } },
          { "@type": "Question", "name": "Can I get my PC within 7 working days?", "acceptedAnswer": { "@type": "Answer", "text": "Standard builds typically take 5-7 business days. Express shipping options may be available depending on component availability and your location." } },
          { "@type": "Question", "name": "Do you preinstall games or software on custom PCs?", "acceptedAnswer": { "@type": "Answer", "text": "We preinstall the operating system and all necessary drivers. We can also preinstall specific software or games upon request during the configuration process." } },
          { "@type": "Question", "name": "Laptop vs. PC: Which is better?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your needs. Laptops offer portability, while PCs generally provide better performance, cooling, and upgradability for the same price point." } },
          { "@type": "Question", "name": "Why should I choose a custom PC over a prebuilt PC?", "acceptedAnswer": { "@type": "Answer", "text": "Custom PCs allow you to choose high-quality components tailored to your specific needs, often resulting in better performance, easier upgrades, and better value for money." } },
          { "@type": "Question", "name": "Do you provide a warranty for service and repairs?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all our repairs come with a standard 30-day warranty. Extended warranties are available for premium subscribers and certain hardware installations." } },
          { "@type": "Question", "name": "What brands of laptops do you service?", "acceptedAnswer": { "@type": "Answer", "text": "We service all major brands including Apple (MacBook), Dell, HP, Lenovo, ASUS, Acer, MSI, and others. We specialize in chip-level repairs for all these brands." } },
          { "@type": "Question", "name": "How long does a typical chip-level repair take?", "acceptedAnswer": { "@type": "Answer", "text": "Chip-level repairs usually take between 3 to 5 business days depending on the complexity of the issue and the availability of specific components." } },
          { "@type": "Question", "name": "Do you offer home pickup and delivery?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we provide home pickup and delivery services for a small additional fee within a certain radius of our service centers." } },
          { "@type": "Question", "name": "Can I track the status of my repair online?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can track the status of your repair online on our Track Ticket page by entering your Ticket ID." } },
          { "@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": { "@type": "Answer", "text": "We accept cash, all major credit/debit cards, UPI, and bank transfers." } },
          { "@type": "Question", "name": "Do you sell refurbished laptops or PCs?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we occasionally have certified refurbished laptops and PCs for sale. All refurbished units undergo rigorous testing and come with a 3-month warranty." } },
          { "@type": "Question", "name": "Can you upgrade my old laptop's RAM and SSD?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! Upgrading RAM and moving to an SSD is the best way to breathe new life into an old laptop. We can help you choose and install the right components." } },
          { "@type": "Question", "name": "Do you provide data recovery from dead hard drives?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our data recovery team specializes in recovering files from failing, corrupted, or physically damaged hard drives and SSDs." } },
          { "@type": "Question", "name": "What are your opening hours?", "acceptedAnswer": { "@type": "Answer", "text": "Our service centers are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays and public holidays." } }
        ]
      },
      "/price-list": {
        "@context": "https://schema.org",
        "@type": "PriceSpecification",
        "name": "Sian SmartTech Service Price List",
        "priceCurrency": "INR",
        "description": "Affordable and transparent price list for PC diagnostics, hardware servicing, operating system installation, website design, and custom building services."
      },
      "/about": {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "Sian SmartTech",
          "image": "https://siansmarttech.com/logo.png",
          "telephone": "+91 93446 78135",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.",
            "addressLocality": "Madurai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "625009",
            "addressCountry": "IN"
          },
          "founder": {
            "@type": "Person",
            "name": "Sivakumar SG"
          },
          "description": "Founded by Sivakumar SG, ex-ARIES researcher, SiAn SmartTech bridges aerospace-grade technical precision with 5+ years of computer repair and motherboard chip-level servicing."
        }
      }
    };

    const currentSchema = defaultSchemas[location.pathname];
    if (currentSchema) {
      script.innerHTML = JSON.stringify(currentSchema);
    } else {
      script.innerHTML = '';
    }
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