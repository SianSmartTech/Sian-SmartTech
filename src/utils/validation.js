export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};
export const normalizePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  cleaned = cleaned.replace(/\D/g, '');
  return cleaned;
};
export const isValidPhoneNumber = (phone) => {
  const cleaned = normalizePhoneNumber(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
};
export const validateCustomerEmail = (email, { required = false, fieldName = 'Customer Email' } = {}) => {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    if (required) {
      return { isValid: false, error: `Please enter ${fieldName}.` };
    }
    return { isValid: true, error: null };
  }
  if (!isValidEmail(trimmed)) {
    return { isValid: false, error: `Please enter a valid ${fieldName} (e.g. name@domain.com).` };
  }
  return { isValid: true, error: null };
};
export const validateCustomerPhone = (phone, { required = false, fieldName = 'Customer Phone Number' } = {}) => {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    if (required) {
      return { isValid: false, error: `Please enter ${fieldName}.` };
    }
    return { isValid: true, error: null, cleaned: '' };
  }
  const cleaned = normalizePhoneNumber(trimmed);
  if (!isValidPhoneNumber(cleaned)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.`,
      cleaned
    };
  }
  return { isValid: true, error: null, cleaned };
};