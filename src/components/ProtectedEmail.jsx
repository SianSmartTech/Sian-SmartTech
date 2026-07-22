import { decodeEmail, encodeEmail } from '../utils/emailProtection';
const ProtectedEmail = ({ email, className = '', children, label = null }) => {
  const encoded = encodeEmail(email);
  const actualEmail = decodeEmail(encoded);
  const displayText = label || children || actualEmail;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (actualEmail) {
      window.location.href = `mailto:${actualEmail}`;
    }
  };
  return (
    <a href={actualEmail ? `mailto:${actualEmail}` : "#email"} onClick={handleClick} className={className} title="Click to send email" rel="nofollow noreferrer">{displayText}</a>
  );
};
export default ProtectedEmail;