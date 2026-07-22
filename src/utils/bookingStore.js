const BOOKINGS_KEY = 'sian_bookings';
const EMAIL_LOGS_KEY = 'sian_email_logs';
let bookingsCache = [];
let emailLogsCache = [];
let otherBookingsCache = [];
const getItemSafe = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const setItemSafe = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) {}
};
const removeItemSafe = (key) => {
  try { localStorage.removeItem(key); } catch (e) {}
};

export const bookingStore = {
  initialize() {
    removeItemSafe(BOOKINGS_KEY);
    removeItemSafe(EMAIL_LOGS_KEY);
    removeItemSafe('sian_other_service_sheets_url');
    const storedUrl = getItemSafe('sian_sheets_url');
    if (storedUrl && (
      storedUrl.includes('AKfycbzmJ8qfcRvNxyabOXSyIkTuZTd9XkDEwMXTPAoKjnc5kO3x2lkLRNpFCaBAP2cd8zVr') ||
      storedUrl.includes('AKfycbzArusSl-EWhyizx3gjh2FuLA348ZGBVanw63XF8xbyDke-XCBRrvbdZwsBDZi5rg1T') ||
      storedUrl.includes('AKfycbzoSrQSG-fMUSnJPucqMnDasDaFCxOAng1YoCHaf7Sez9BYj3n9I1o3bL4Sco2VH7YN')
    )) {
      removeItemSafe('sian_sheets_url');
    }
  },
  getSheetsUrl() {
    return getItemSafe('sian_sheets_url') || process.env.REACT_APP_GOOGLE_SHEETS_URL;
  },
  setSheetsUrl(url) {
    setItemSafe('sian_sheets_url', url ? url.trim() : '');
  },
  getOtherBookingsSheetsUrl() {
    return getItemSafe('sian_other_service_sheets_url') || process.env.REACT_APP_GOOGLE_OTHER_SERVICE_SHEETS_URL;
  },
  setOtherBookingsSheetsUrl(url) {
    setItemSafe('sian_other_service_sheets_url', url ? url.trim() : '');
  },
  isGoogleSheetsConfigured() {
    return !!this.getSheetsUrl();
  },
  isOtherBookingsConfigured() {
    return !!this.getOtherBookingsSheetsUrl();
  },
  async testConnection(url) {
    if (!url) return { success: false, error: 'URL is empty' };
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        return { success: true, count: data.length };
      }
      return { success: false, error: 'Response from Apps Script was not a valid JSON array' };
    } catch (e) {
      return { success: false, error: e.message || 'Connection failed' };
    }
  },
  async fetchBookings() {
    const url = this.getSheetsUrl();
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
          service: b.service || '',
          issue: b.issue || '',
          status: b.status || 'Pending',
          createdAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || new Date().toISOString(),
          notes: b.notes || 'Awaiting diagnostics.',
          estimatedCost: b.estimatedCost || '₹350+',
          estimatedDelivery: b.estimatedDelivery || 'TBD'
        }));
        bookingsCache = normalized;
        return normalized;
      }
    } catch (e) {
      console.error('Google Sheets fetch failed, using in-memory cache:', e);
    }
    return bookingsCache;
  },
  getAllBookings() {
    this.initialize();
    return bookingsCache;
  },
  async addBooking(bookingData) {
    this.initialize();
    const bookings = this.getAllBookings();
    const lastTicketNum = bookings
      .map(b => {
        const match = b.ticketId.match(/SIAN-2026-(\d+)/);
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
      estimatedDelivery: 'TBD'
    };
    bookingsCache.unshift(newBooking);
    const url = this.getSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify({
            action: 'add',
            data: newBooking
          }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to write booking to Google Sheets:', err);
      }
    }
    this.sendSimulatedEmail(newBooking, 'Pending');
    return newBooking;
  },
  async updateBooking(id, updatedFields) {
    const bookings = this.getAllBookings();
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
      this.sendSimulatedEmail(newBooking, updatedFields.status);
    }
    const url = this.getSheetsUrl();
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain'
          },
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
  },
  async getBookingByTicket(ticketId) {
    const url = this.getSheetsUrl();
    if (url) {
      try {
        const fresh = await this.fetchBookings();
        const match = fresh.find(b => b.ticketId.trim().toUpperCase() === ticketId.trim().toUpperCase());
        if (match) return match;
      } catch (err) {
        console.error('Failed to fetch ticket info from Google Sheets, using cache:', err);
      }
    }
    return bookingsCache.find(b => b.ticketId.trim().toUpperCase() === ticketId.trim().toUpperCase()) || null;
  },
  getOutboxSheetsUrl() {
    return process.env.REACT_APP_GOOGLE_SHEETS_OUTBOX_URL;
  },
  getEmailLogs() {
    return emailLogsCache;
  },
  getEmailHtml(booking, status) {
    if (!booking) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://siansmarttech.com';
    const statusBadges = {
      Pending: '<span style="background-color: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Pending Review</span>',
      Confirmed: '<span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Confirmed</span>',
      'In Progress': '<span style="background-color: #f3e8ff; color: #6b21a8; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">In Progress</span>',
      Completed: '<span style="background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Completed & Ready</span>',
      Cancelled: '<span style="background-color: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Cancelled</span>'
    };
    const statusTexts = {
      Pending: 'Your service booking request has been <strong>RECEIVED</strong>. Our team will review and contact you shortly with diagnostics.',
      Confirmed: 'Your service booking request has been <strong>CONFIRMED</strong>. We have assigned a technician to look at your device.',
      'In Progress': 'Our technicians are now actively working to resolve your hardware/software issue.',
      Completed: 'Great news! Your service order has been <strong>COMPLETED</strong> successfully. Your device is ready for collection/delivery.',
      Cancelled: 'Please note that your service request has been <strong>CANCELLED</strong>. Contact us if this was an error.'
    };
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #11678E; border-radius: 8px; background-color: #ffffff; color: #333;">
        <div style="text-align: center; border-bottom: 2px solid #11678E; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="color: #11678E; margin: 0;">Sian SmartTech</h2>
          <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">Computer Hardware Repair & Services</p>
        </div>
        <p>Dear <strong>${booking.name || 'Customer'}</strong>,</p>
        <p>${statusTexts[status] || `Your service booking status is now: <strong>${status}</strong>.`}</p>
        
        <div style="background-color: #f5f9fc; border-left: 4px solid #11678E; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #11678E;">Booking & Service Details:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 140px;">Ticket ID:</td>
              <td style="padding: 4px 0; color: #11678E; font-weight: bold;">${booking.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Service Type:</td>
              <td style="padding: 4px 0;">${booking.service || 'Diagnostic Service'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Current Status:</td>
              <td style="padding: 4px 0;">${statusBadges[status] || status}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Estimated Cost:</td>
              <td style="padding: 4px 0; font-weight: bold;">${booking.estimatedCost || '₹350+'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Technician Note:</td>
              <td style="padding: 4px 0; font-style: italic; color: #555;">"${booking.notes || 'Awaiting diagnostics.'}"</td>
            </tr>
          </table>
        </div>
        <p style="margin-bottom: 25px;">You can track the real-time status of your repair at any time by clicking the link below:</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${origin}/track/${booking.ticketId}" style="background-color: #11678E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; box-shadow: 0 4px 6px rgba(17, 103, 142, 0.2);">Track Live Status</a>
        </p>

        <p style="font-size: 0.85rem; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
          If you have any questions, please contact our support team at +91 93446 78135 or reply directly to this email.<br/>
          <strong>Sian SmartTech</strong>, 5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.
        </p>
      </div>
    `;
  },
  async fetchEmailLogs() {
    const url = this.getOutboxSheetsUrl();
    if (!url) return this.getEmailLogs();
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const bookings = this.getAllBookings();
        const hydrated = data.map(log => {
          let status = 'Pending';
          const subj = log.subject || '';
          if (subj.includes('Confirmed')) status = 'Confirmed';
          else if (subj.includes('In Progress')) status = 'In Progress';
          else if (subj.includes('Completed')) status = 'Completed';
          else if (subj.includes('Cancelled')) status = 'Cancelled';
          const booking = bookings.find(b => b.ticketId.trim().toUpperCase() === log.ticketId.trim().toUpperCase());
          return {
            ...log,
            html: log.html || this.getEmailHtml(booking || { ticketId: log.ticketId }, status)
          };
        });
        emailLogsCache = hydrated;
        return hydrated;
      }
    } catch (e) {
      console.error('Google Sheets outbox fetch failed:', e);
    }
    return this.getEmailLogs();
  },
  sendSimulatedEmail(booking, newStatus) {
    const logs = this.getEmailLogs();
    const subjectText = newStatus === 'Pending' ? `Booking Request Received - Ticket #${booking.ticketId} | Sian SmartTech` : newStatus === 'Confirmed' ? `Booking Confirmed - Ticket #${booking.ticketId} | Sian SmartTech` : `Service Status Updated (#${booking.ticketId}) - ${newStatus} | Sian SmartTech`;
    const htmlContent = this.getEmailHtml(booking, newStatus);
    const newEmailLog = {
      id: `em-${Date.now()}`,
      ticketId: booking.ticketId,
      recipient: booking.email,
      subject: subjectText,
      sentAt: new Date().toISOString(),
      html: htmlContent
    };
    logs.unshift(newEmailLog);
    const outboxUrl = this.getOutboxSheetsUrl();
    if (outboxUrl) {
      const { html, ...logDataWithoutHtml } = newEmailLog;
      fetch(outboxUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'add',
          data: logDataWithoutHtml,
          html: htmlContent
        }),
        redirect: 'follow'
      }).catch(err => console.error('Failed to sync email to Google Sheets:', err));
    }
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
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify({
            action: 'add',
            data: newBooking
          }),
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
          headers: {
            'Content-Type': 'text/plain'
          },
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
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify({
            action: 'delete',
            id: id
          }),
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Failed to delete other booking in Google Sheets:', err);
      }
    }
    return true;
  },
  getInvoiceSheetsUrl() {
    return getItemSafe('sian_invoice_sheets_url') || process.env.REACT_APP_GOOGLE_INVOICE_TEMPLATE_URL;
  },
  setInvoiceSheetsUrl(url) {
    setItemSafe('sian_invoice_sheets_url', url ? url.trim() : '');
  },
  isInvoiceConfigured() {
    return !!this.getInvoiceSheetsUrl();
  },
  async fetchInvoices() {
    const url = this.getInvoiceSheetsUrl();
    if (!url) return [];
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map(inv => {
          let parsedItems = [];
          if (inv.items) {
            try {
              parsedItems = typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items;
            } catch (e) {
              console.error("Failed to parse items column JSON:", e);
              parsedItems = [];
            }
          }
          return {
            id: inv.id || `inv-${Date.now()}`,
            invoiceNumber: inv.invoiceNumber || '',
            date: inv.date || new Date().toISOString().split('T')[0],
            dueDate: inv.dueDate || new Date().toISOString().split('T')[0],
            status: inv.status || 'Pending',
            template: inv.template || 'challan',
            fromName: inv.fromName || 'SiAn Smart Tech',
            fromEmail: inv.fromEmail || '',
            fromPhone: inv.fromPhone || '',
            fromAddress: inv.fromAddress || '',
            fromGst: inv.fromGst || '',
            toName: inv.toName || '',
            toEmail: inv.toEmail || '',
            toPhone: inv.toPhone || '',
            toAddress: inv.toAddress || '',
            modeOfPayment: inv.modeOfPayment || 'Online',
            billReceiverName: inv.billReceiverName || '',
            bankHolderName: inv.bankHolderName || 'Sivakumar S G',
            bankName: inv.bankName || 'State Bank of India',
            bankBranchName: inv.bankBranchName || 'Anuppanadi Branch',
            accountNumber: inv.accountNumber || '35846100378',
            ifscCode: inv.ifscCode || 'SBIN0061291',
            upiId: inv.upiId || 'sivask7kumar@oksbi',
            items: Array.isArray(parsedItems) ? parsedItems : [],
            discount: parseFloat(inv.discount) || 0,
            notes: inv.notes || '',
            createdAt: inv.createdAt || new Date().toISOString(),
            updatedAt: inv.updatedAt || new Date().toISOString()
          };
        });
        return normalized;
      }
    } catch (e) {
      console.error('Google Sheets fetch for invoices failed:', e);
    }
    return [];
  },
  async addInvoice(invoiceData) {
    const url = this.getInvoiceSheetsUrl();
    if (!url) return invoiceData;
    try {
      const payload = {
        ...invoiceData,
        items: JSON.stringify(invoiceData.items)
      };
      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'add',
          data: payload
        }),
        redirect: 'follow'
      });
    } catch (err) {
      console.error('Failed to write invoice to Google Sheets:', err);
    }
    return invoiceData;
  },
  async updateInvoice(id, invoiceData) {
    const url = this.getInvoiceSheetsUrl();
    if (!url) return invoiceData;
    try {
      const payload = {
        ...invoiceData,
        items: JSON.stringify(invoiceData.items)
      };
      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'update',
          data: payload
        }),
        redirect: 'follow'
      });
    } catch (err) {
      console.error('Failed to update invoice in Google Sheets:', err);
    }
    return invoiceData;
  },
  async deleteInvoice(id) {
    const url = this.getInvoiceSheetsUrl();
    if (!url) return false;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'delete',
          id: id
        }),
        redirect: 'follow'
      });
    } catch (err) {
      console.error('Failed to delete invoice in Google Sheets:', err);
    }
    return true;
  }
};