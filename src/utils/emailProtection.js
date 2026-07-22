export function encodeEmail(email) {
  if (!email) return '';
  try {
    return btoa(email);
  } catch (e) {
    return email;
  }
}
export function decodeEmail(encoded) {
  if (!encoded) return '';
  try {
    return atob(encoded);
  } catch (e) {
    return encoded;
  }
}
export function formatObfuscatedText(email) {
  if (!email) return '';
  return email.replace('@', ' [at] ').replace(/\./g, ' [dot] ');
}