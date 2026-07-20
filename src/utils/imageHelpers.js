const UNSPLASH_BASE = 'images.unsplash.com';
/**
 * Returns an object { srcSet, sizes } for an image URL.
 * @param {string} src  - Original full-size image URL or path
 * @returns {{ srcSet: string, sizes: string }}
 */
export function getResponsiveImage(src) {
  if (!src) return { srcSet: undefined, sizes: undefined };
  if (src.includes(UNSPLASH_BASE)) {
    const base = src.replace(/[?&]w=\d+/, '').replace(/[?&]q=\d+/, '');
    const sep = base.includes('?') ? '&' : '?';
    return {
      srcSet: [
        `${base}${sep}w=480&q=72 480w`,
        `${base}${sep}w=768&q=78 768w`,
        `${base}${sep}w=1200&q=82 1200w`,
      ].join(', '),
      sizes: '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px',
    };
  }
  if (src.startsWith('/images/')) {
    const dot = src.lastIndexOf('.');
    const noExt = src.slice(0, dot);
    const ext = src.slice(dot);
    return {
      srcSet: [
        `${noExt}-mobile${ext} 480w`,
        `${noExt}-tablet${ext} 768w`,
        `${src} 1200w`,
      ].join(', '),
      sizes: '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px',
    };
  }
  return { srcSet: undefined, sizes: undefined };
}