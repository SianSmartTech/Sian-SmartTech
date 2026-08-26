import { emailOutboxStore } from './emailOutboxStore';
let bookingsCache = [];
const getItemSafe = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const setItemSafe = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) { }
};
const cleanServiceName = (serviceStr, addressStr, defaultName = 'General Service') => {
  if (!serviceStr || typeof serviceStr !== 'string') return defaultName;
  const s = serviceStr.trim();
  const a = (addressStr || '').trim();
  if (!s || (a && s.toLowerCase() === a.toLowerCase())) return defaultName;
  if (/\b(madurai|thoppu|street|nagar|road|625\d{3})\b/i.test(s) || /^\d+\/\d+/.test(s)) {
    return defaultName;
  }
  return s;
};
export const hardwareBookingStore = {
  getHardwareSheetsUrl() {
    return getItemSafe('sian_hardware_sheets_url') || process.env.REACT_APP_GOOGLE_HARDWARE_SHEETS_URL || getItemSafe('sian_sheets_url') || process.env.REACT_APP_GOOGLE_SHEETS_URL;
  },
  setHardwareSheetsUrl(url) {
    setItemSafe('sian_hardware_sheets_url', url ? url.trim() : '');
  },
  isHardwareGoogleSheetsConfigured() {
    return !!this.getHardwareSheetsUrl();
  },
  getAllHardwareBookings() {
    return bookingsCache;
  },
  async fetchHardwareBookings() {
    const url = this.getHardwareSheetsUrl();
    if (!url) return bookingsCache;
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map(b => ({
          id: b.id || `bk-${b.ticketId}`,
          ticketId: b.ticketId,
          name: b.name || '',
          email: b.email || '',
          phone: b.phone || '',
          address: b.address || '',
          service: cleanServiceName(b.service, b.address, 'Hardware Repair Service'),
          issue: b.issue || '',
          status: b.status || 'Pending',
          createdAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || new Date().toISOString(),
          notes: b.notes || 'Awaiting diagnostics.',
          estimatedCost: b.estimatedCost || '₹350+',
          estimatedDelivery: b.estimatedDelivery || 'TBD',
          type: 'Hardware'
        }));
        bookingsCache = normalized;
        return normalized;
      }
    } catch (e) {
      console.error('Google Sheets fetch for hardware bookings failed, using in-memory cache:', e);
    }
    return bookingsCache;
  },
  async addBooking(bookingData) {
    const bookings = this.getAllHardwareBookings();
    const lastTicketNum = bookings
      .map(b => {
        const match = (b.ticketId || '').match(/SIAN-2026-(\d+)/);
        return match ? parseInt(match[1]) : 1000;
      })
      .reduce((max, val) => Math.max(max, val), 1000);
    const newTicketId = `SIAN-2026-${lastTicketNum + 1}`;
    const newBooking = {
      id: `bk-${Date.now()}`,
      ticketId: newTicketId,
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone || '',
      address: bookingData.address,
      service: bookingData.service,
      issue: bookingData.issue,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Awaiting admin review & diagnostics.',
      estimatedCost: '₹350+',
      estimatedDelivery: 'TBD',
      type: 'Hardware'
    };
    bookingsCache.unshift(newBooking);
    const url = this.getHardwareSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'add', data: newBooking }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to write booking to Google Sheets:', err);
      }
    }
    emailOutboxStore.sendSimulatedEmail(newBooking, 'Pending');
    return newBooking;
  },
  async updateBooking(id, updatedFields) {
    const bookings = this.getAllHardwareBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    const oldBooking = bookings[index];
    const newBooking = {
      ...oldBooking,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    bookingsCache[index] = newBooking;
    if (updatedFields.status && updatedFields.status !== oldBooking.status) {
      emailOutboxStore.sendSimulatedEmail(newBooking, updatedFields.status);
    }
    const url = this.getHardwareSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'update',
            data: {
              ticketId: newBooking.ticketId,
              status: newBooking.status,
              notes: newBooking.notes,
              estimatedCost: newBooking.estimatedCost,
              estimatedDelivery: newBooking.estimatedDelivery,
              phone: newBooking.phone
            }
          }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to update booking in Google Sheets:', err);
      }
    }
    return newBooking;
  }
};