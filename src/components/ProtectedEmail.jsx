const ProtectedEmail = ({ email = '', className = '', children, label = null, type = 'default' }) => {
  if (label || children) {
    return <span className={className}>{label || children}</span>;
  }
  const isIT = type === 'it' || (email && email.includes('santhosh'));
  const badgeClass = isIT ? 'email-img-badge email-img-badge-it' : 'email-img-badge';
  return (
    <span
      className={`${badgeClass} ${className}`.trim()}
      role="img"
      aria-label="Email"
    />
  );
};
export default ProtectedEmail;