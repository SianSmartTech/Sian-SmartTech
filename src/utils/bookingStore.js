import { hardwareBookingStore } from '../services/hardwareBookingStore';
import { itBookingStore } from '../services/itBookingStore';
import { otherBookingStore } from '../services/otherBookingStore';
import { invoiceStore } from '../services/invoiceStore';
import { emailOutboxStore } from '../services/emailOutboxStore';
import { businessManagementApi } from '../services/businessManagementApi';
export {
  hardwareBookingStore,
  itBookingStore,
  otherBookingStore,
  invoiceStore,
  emailOutboxStore,
  businessManagementApi
};
export const bookingStore = {
  initialize() {
    businessManagementApi.initialize();
  },
  getHardwareSheetsUrl() {
    return hardwareBookingStore.getHardwareSheetsUrl();
  },
  setHardwareSheetsUrl(url) {
    hardwareBookingStore.setHardwareSheetsUrl(url);
  },
  getSheetsUrl() {
    return this.getHardwareSheetsUrl();
  },
  setSheetsUrl(url) {
    this.setHardwareSheetsUrl(url);
  },
  isHardwareGoogleSheetsConfigured() {
    return hardwareBookingStore.isHardwareGoogleSheetsConfigured();
  },
  isGoogleSheetsConfigured() {
    return this.isHardwareGoogleSheetsConfigured();
  },
  getITSheetsUrl() {
    return itBookingStore.getITSheetsUrl();
  },
  setITSheetsUrl(url) {
    itBookingStore.setITSheetsUrl(url);
  },
  isITGoogleSheetsConfigured() {
    return itBookingStore.isITGoogleSheetsConfigured();
  },
  getOtherBookingsSheetsUrl() {
    return otherBookingStore.getOtherBookingsSheetsUrl();
  },
  setOtherBookingsSheetsUrl(url) {
    otherBookingStore.setOtherBookingsSheetsUrl(url);
  },
  isOtherBookingsConfigured() {
    return otherBookingStore.isOtherBookingsConfigured();
  },
  getInvoiceSheetsUrl() {
    return invoiceStore.getInvoiceSheetsUrl();
  },
  setInvoiceSheetsUrl(url) {
    invoiceStore.setInvoiceSheetsUrl(url);
  },
  isInvoiceConfigured() {
    return invoiceStore.isInvoiceConfigured();
  },
  getBusinessManagementUrl() {
    return businessManagementApi.getApiUrl();
  },
  setBusinessManagementUrl(url) {
    businessManagementApi.setApiUrl(url);
  },
  isBusinessManagementConfigured() {
    return businessManagementApi.isConfigured();
  },
  async testConnection(url) {
    if (!url) return { success: false, error: 'URL is empty' };
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) || (data && typeof data === 'object')) {
        return { success: true, count: Array.isArray(data) ? data.length : 1 };
      }
      return { success: false, error: 'Invalid response from Apps Script' };
    } catch (e) {
      return { success: false, error: e.message || 'Connection failed' };
    }
  },
  getAllHardwareBookings() {
    return hardwareBookingStore.getAllHardwareBookings();
  },
  getAllBookings() {
    return this.getAllHardwareBookings();
  },
  async fetchHardwareBookings() {
    return hardwareBookingStore.fetchHardwareBookings();
  },
  async fetchBookings() {
    return this.fetchHardwareBookings();
  },
  async addBooking(bookingData) {
    const serviceName = (bookingData.service || bookingData.serviceType || '').toLowerCase();
    const isITService = bookingData.category === 'IT' || bookingData.type === 'IT' ||
      ['website development', 'web development', 'freelancing', 'software', 'it service', 'consulting'].some(k => serviceName.includes(k));

    if (isITService) {
      return this.addITBooking(bookingData);
    }
    return hardwareBookingStore.addBooking(bookingData);
  },
  async updateBooking(id, updatedFields) {
    const itBooking = itBookingStore.getAllITBookings().find(b => b.id === id);
    if (itBooking) {
      return itBookingStore.updateITBooking(id, updatedFields);
    }
    return hardwareBookingStore.updateBooking(id, updatedFields);
  },

  getAllITBookings() {
    return itBookingStore.getAllITBookings();
  },
  async fetchITBookings() {
    return itBookingStore.fetchITBookings();
  },
  async addITBooking(bookingData) {
    return itBookingStore.addITBooking(bookingData);
  },
  async updateITBooking(id, updatedFields) {
    return itBookingStore.updateITBooking(id, updatedFields);
  },
  async deleteITBooking(id) {
    return itBookingStore.deleteITBooking(id);
  },
  getAllOtherBookings() {
    return otherBookingStore.getAllOtherBookings();
  },
  async fetchOtherBookings() {
    return otherBookingStore.fetchOtherBookings();
  },
  async addOtherBooking(bookingData) {
    return otherBookingStore.addOtherBooking(bookingData);
  },
  async updateOtherBooking(id, updatedFields) {
    return otherBookingStore.updateOtherBooking(id, updatedFields);
  },
  async deleteOtherBooking(id) {
    return otherBookingStore.deleteOtherBooking(id);
  },
  async getBookingByTicket(ticketId, email = null) {
    if (!ticketId) return null;
    const cleanId = ticketId.trim().toUpperCase();
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const matchesFilter = (b) => {
      const matchId = (b.ticketId || '').trim().toUpperCase() === cleanId;
      if (!matchId) return false;
      if (cleanEmail) {
        return (b.email || '').trim().toLowerCase() === cleanEmail;
      }
      return true;
    };
    let hwMatch = hardwareBookingStore.getAllHardwareBookings().find(matchesFilter);
    if (hwMatch) return hwMatch;
    let itMatch = itBookingStore.getAllITBookings().find(matchesFilter);
    if (itMatch) return itMatch;
    if (this.isHardwareGoogleSheetsConfigured()) {
      try {
        const freshHw = await this.fetchHardwareBookings();
        const match = freshHw.find(matchesFilter);
        if (match) return match;
      } catch (err) { }
    }
    if (this.isITGoogleSheetsConfigured()) {
      try {
        const freshIt = await this.fetchITBookings();
        const match = freshIt.find(matchesFilter);
        if (match) return match;
      } catch (err) { }
    }
    const otherMatch = otherBookingStore.getAllOtherBookings().find(b => {
      const matchId = (b.id || b.ticketId || '').trim().toUpperCase() === cleanId;
      if (!matchId) return false;
      if (cleanEmail) {
        return (b.email || '').trim().toLowerCase() === cleanEmail;
      }
      return true;
    });
    return otherMatch || null;
  },
  getOutboxSheetsUrl() {
    return emailOutboxStore.getOutboxSheetsUrl();
  },
  getEmailLogs() {
    return emailOutboxStore.getEmailLogs();
  },
  getEmailHtml(booking, status) {
    return emailOutboxStore.getEmailHtml(booking, status);
  },
  async fetchEmailLogs() {
    const allBookings = [
      ...hardwareBookingStore.getAllHardwareBookings(),
      ...itBookingStore.getAllITBookings(),
      ...otherBookingStore.getAllOtherBookings()
    ];
    return emailOutboxStore.fetchEmailLogs(allBookings);
  },
  sendSimulatedEmail(booking, newStatus) {
    return emailOutboxStore.sendSimulatedEmail(booking, newStatus);
  },
  async fetchInvoices() {
    return invoiceStore.fetchInvoices();
  },
  async addInvoice(invoiceData) {
    return invoiceStore.addInvoice(invoiceData);
  },
  async updateInvoice(id, invoiceData) {
    return invoiceStore.updateInvoice(id, invoiceData);
  },
  async deleteInvoice(id) {
    return invoiceStore.deleteInvoice(id);
  },
  async getBusinessData() {
    return businessManagementApi.getAllData();
  },
  async createSchedule(s) {
    return businessManagementApi.createSchedule(s);
  },
  async updateSchedule(s) {
    return businessManagementApi.updateSchedule(s);
  },
  async deleteSchedule(id) {
    return businessManagementApi.deleteSchedule(id);
  },
  async createIncome(i) {
    return businessManagementApi.createIncome(i);
  },
  async updateIncome(i) {
    return businessManagementApi.updateIncome(i);
  },
  async deleteIncome(id) {
    return businessManagementApi.deleteIncome(id);
  },
  async createExpense(e) {
    return businessManagementApi.createExpense(e);
  },
  async updateExpense(e) {
    return businessManagementApi.updateExpense(e);
  },
  async deleteExpense(id) {
    return businessManagementApi.deleteExpense(id);
  },
  async createDuePayment(d) {
    return businessManagementApi.createDuePayment(d);
  },
  async updateDuePayment(d) {
    return businessManagementApi.updateDuePayment(d);
  },
  async deleteDuePayment(id) {
    return businessManagementApi.deleteDuePayment(id);
  }
};