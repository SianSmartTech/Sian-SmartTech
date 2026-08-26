const getItemSafe = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const setItemSafe = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) { }
};
export const invoiceStore = {
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
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'add', data: payload }),
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
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', data: payload }),
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
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'delete', id: id }),
        redirect: 'follow'
      });
    } catch (err) {
      console.error('Failed to delete invoice in Google Sheets:', err);
    }
    return true;
  }
};