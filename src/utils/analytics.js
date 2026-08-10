const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const ENABLE_IN_DEV = process.env.REACT_APP_GA_ENABLE_IN_DEV === 'true';
const IS_PROD = process.env.NODE_ENV === 'production';

// Helper to check if analytics should run
const shouldRun = () => {
  return typeof window !== 'undefined' && !!MEASUREMENT_ID && (IS_PROD || ENABLE_IN_DEV);
};

/**
 * Dynamically loads Google Analytics (gtag.js) script
 */
export const initGA = () => {
  if (!shouldRun()) {
    return;
  }

  // Check if already initialized to avoid duplicate tag injection
  if (window.dataLayer && window.gtag) {
    return;
  }

  try {
    // Inject the gtag script tag into the head
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize the dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());

    // Configure gtag with send_page_view: false to prevent duplicate pageviews on initial load
    // since we manually track route changes inside the application routing
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
    });
  } catch (error) {
    console.warn('Google Analytics failed to initialize:', error);
  }
};

/**
 * Tracks page view
 * @param {string} path - The relative URL path (e.g. '/about')
 * @param {string} [title] - The page title
 */
export const pageview = (path, title) => {
  if (!shouldRun()) return;

  try {
    initGA(); // Ensure it's initialized
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
      });
    }
  } catch (error) {
    console.warn('Failed to track pageview:', error);
  }
};

/**
 * Tracks a custom event
 * @param {Object} options
 * @param {string} options.action - Event action name (e.g. 'whatsapp_click')
 * @param {string} options.category - Event category (e.g. 'engagement')
 * @param {string} options.label - Event label (e.g. 'Contact WhatsApp')
 * @param {number} [options.value] - Optional numeric value
 */
export const event = ({ action, category, label, value, ...rest }) => {
  if (!shouldRun()) return;

  try {
    initGA(); // Ensure it's initialized
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...rest,
      });
    }
  } catch (error) {
    console.warn('Failed to send event:', error);
  }
};
