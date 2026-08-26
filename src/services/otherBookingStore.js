let otherBookingsCache = [];
const getItemSafe = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const setItemSafe = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) { }
};
export const otherBookingStore = {
  getOtherBookingsSheetsUrl() {
    return getItemSafe('sian_other_service_sheets_url') || process.env.REACT_APP_GOOGLE_OTHER_SERVICE_SHEETS_URL;
  },
  setOtherBookingsSheetsUrl(url) {
    setItemSafe('sian_other_service_sheets_url', url ? url.trim() : '');
  },
  isOtherBookingsConfigured() {
    return !!this.getOtherBookingsSheetsUrl();
  },
  getAllOtherBookings() {
    return otherBookingsCache;
  },
  async fetchOtherBookings() {
    const url = this.getOtherBookingsSheetsUrl();
    if (!url) return otherBookingsCache;
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map(b => ({
          id: b.id || `osb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: b.createdAt || new Date().toISOString(),
          name: b.name || '',
          email: b.email || '',
          phone: b.phone || '',
          address: b.address || '',
          serviceType: b.serviceType || '',
          issue: b.issue || '',
          status: b.status || 'Pending',
          estimatedCost: b.estimatedCost || '₹350+',
          estimatedTurnaround: b.estimatedTurnaround || 'TBD',
          notes: b.notes || 'Awaiting diagnostics.'
        }));
        otherBookingsCache = normalized;
        return normalized;
      }
    } catch (e) {
      console.error('Google Sheets fetch for other bookings failed, using in-memory cache:', e);
    }
    return otherBookingsCache;
  },
  async addOtherBooking(bookingData) {
    const newBooking = {
      id: bookingData.id || `osb-${Date.now()}`,
      createdAt: bookingData.createdAt || new Date().toISOString(),
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone || '',
      address: bookingData.address,
      serviceType: bookingData.serviceType,
      issue: bookingData.issue,
      status: bookingData.status || 'Pending',
      estimatedCost: bookingData.estimatedCost || '₹350+',
      estimatedTurnaround: bookingData.estimatedTurnaround || 'TBD',
      notes: bookingData.notes || 'Awaiting admin review & diagnostics.'
    };
    otherBookingsCache.unshift(newBooking);
    const url = this.getOtherBookingsSheetsUrl();
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
        console.error('Failed to write other booking to Google Sheets:', err);
      }
    }
    return newBooking;
  },
  async updateOtherBooking(id, updatedFields) {
    const bookings = this.getAllOtherBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    const oldBooking = bookings[index];
    const newBooking = {
      ...oldBooking,
      ...updatedFields
    };
    otherBookingsCache[index] = newBooking;
    const url = this.getOtherBookingsSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'update',
            data: {
              id: newBooking.id,
              status: newBooking.status,
              notes: newBooking.notes,
              estimatedCost: newBooking.estimatedCost,
              estimatedTurnaround: newBooking.estimatedTurnaround,
              phone: newBooking.phone
            }
          }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to update other booking in Google Sheets:', err);
      }
    }
    return newBooking;
  },
  async deleteOtherBooking(id) {
    const bookings = this.getAllOtherBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    otherBookingsCache.splice(index, 1);
    const url = this.getOtherBookingsSheetsUrl();
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
        console.error('Failed to delete other booking in Google Sheets:', err);
      }
    }
    return true;
  }
};