import { emailOutboxStore } from './emailOutboxStore';
let itBookingsCache = [];
const getItemSafe = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const setItemSafe = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) { }
};
const cleanServiceName = (serviceStr, addressStr, defaultName = 'IT Service') => {
  if (!serviceStr || typeof serviceStr !== 'string') return defaultName;
  const s = serviceStr.trim();
  const a = (addressStr || '').trim();
  if (!s || (a && s.toLowerCase() === a.toLowerCase())) return defaultName;
  if (/\b(madurai|thoppu|street|nagar|road|625\d{3})\b/i.test(s) || /^\d+\/\d+/.test(s)) {
    return defaultName;
  }
  return s;
};
export const itBookingStore = {
  getITSheetsUrl() {
    return getItemSafe('sian_it_sheets_url') || process.env.REACT_APP_GOOGLE_IT_SHEETS_URL;
  },
  setITSheetsUrl(url) {
    setItemSafe('sian_it_sheets_url', url ? url.trim() : '');
  },
  isITGoogleSheetsConfigured() {
    return !!this.getITSheetsUrl();
  },
  getAllITBookings() {
    return itBookingsCache;
  },
  async fetchITBookings() {
    const url = this.getITSheetsUrl();
    if (!url) return itBookingsCache;
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map(b => ({
          id: b.id || `it-bk-${b.ticketId || Date.now()}`,
          ticketId: b.ticketId || `SIAN-IT-${Date.now()}`,
          name: b.name || '',
          email: b.email || '',
          phone: b.phone || '',
          address: b.address || '',
          service: cleanServiceName(b.service || b.serviceType, b.address, 'IT Service'),
          issue: b.issue || '',
          status: b.status || 'Pending',
          createdAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || new Date().toISOString(),
          notes: b.notes || 'Awaiting review.',
          estimatedCost: b.estimatedCost || 'Based on Project',
          estimatedDelivery: b.estimatedDelivery || b.estimatedTurnaround || 'TBD',
          type: 'IT'
        }));
        itBookingsCache = normalized;
        return normalized;
      }
    } catch (e) {
      console.error('Google Sheets fetch for IT bookings failed, using in-memory cache:', e);
    }
    return itBookingsCache;
  },
  async addITBooking(bookingData) {
    const itBookings = this.getAllITBookings();
    const lastTicketNum = itBookings
      .map(b => {
        const match = (b.ticketId || '').match(/SIAN-IT-2026-(\d+)/) || (b.ticketId || '').match(/SIAN-2026-(\d+)/);
        return match ? parseInt(match[1]) : 1000;
      })
      .reduce((max, val) => Math.max(max, val), 1000);
    const newTicketId = `SIAN-IT-2026-${lastTicketNum + 1}`;
    const newBooking = {
      id: `it-bk-${Date.now()}`,
      ticketId: newTicketId,
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone || '',
      address: bookingData.address || '',
      service: bookingData.service || bookingData.serviceType || 'IT Service',
      issue: bookingData.issue || '',
      status: bookingData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: bookingData.notes || 'Awaiting IT service review & consultation.',
      estimatedCost: bookingData.estimatedCost || 'Based on Project',
      estimatedDelivery: bookingData.estimatedDelivery || bookingData.estimatedTurnaround || '1-2 Weeks',
      type: 'IT'
    };
    itBookingsCache.unshift(newBooking);
    const url = this.getITSheetsUrl();
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
        console.error('Failed to write IT booking to Google Sheets:', err);
      }
    }
    emailOutboxStore.sendSimulatedEmail(newBooking, 'Pending');
    return newBooking;
  },
  async updateITBooking(id, updatedFields) {
    const bookings = this.getAllITBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    const oldBooking = bookings[index];
    const newBooking = {
      ...oldBooking,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    itBookingsCache[index] = newBooking;
    if (updatedFields.status && updatedFields.status !== oldBooking.status) {
      emailOutboxStore.sendSimulatedEmail(newBooking, updatedFields.status);
    }
    const url = this.getITSheetsUrl();
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
        console.error('Failed to update IT booking in Google Sheets:', err);
      }
    }
    return newBooking;
  },
  async deleteITBooking(id) {
    const bookings = this.getAllITBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    itBookingsCache.splice(index, 1);
    const url = this.getITSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'delete', id: id }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to delete IT booking in Google Sheets:', err);
      }
    }
    return true;
  }
};