import { useState, useEffect } from 'react';
import { decodeEmail, encodeEmail } from '../utils/emailProtection';

/**
 * ProtectedEmail component renders obfuscated email addresses that are 
 * invisible to automated scraping bots while remaining fully functional 
 * and user-friendly for human visitors.
 */
const ProtectedEmail = ({ 
  email, 
  className = '', 
  children,
  label = null
}) => {
  const [mounted, setMounted] = useState(false);
  const encoded = encodeEmail(email);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const actualEmail = decodeEmail(encoded);
    if (actualEmail) {
      window.location.href = `mailto:${actualEmail}`;
    }
  };

  const actualEmail = mounted ? decodeEmail(encoded) : '';
  const fallbackText = email ? email.replace('@', ' [at] ').replace(/\./g, ' [dot] ') : '';
  const displayText = label || (mounted ? actualEmail : fallbackText);

  return (
    <a
      href="#email"
      onClick={handleClick}
      className={className}
      title="Click to send email"
      rel="nofollow noreferrer"
    >
      {children || displayText}
    </a>
  );
};

export default ProtectedEmail;
