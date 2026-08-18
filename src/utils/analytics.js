const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const ENABLE_IN_DEV = process.env.REACT_APP_GA_ENABLE_IN_DEV === 'true';
const IS_PROD = process.env.NODE_ENV === 'production';
const shouldRun = () => {
  return typeof window !== 'undefined' && !!MEASUREMENT_ID && (IS_PROD || ENABLE_IN_DEV);
};
export const initGA = () => {
  if (!shouldRun()) {
    return;
  }
  if (window.dataLayer && window.gtag) {
    return;
  }
  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };  
    window.gtag('js', new Date());
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
    initGA();
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
    initGA();
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