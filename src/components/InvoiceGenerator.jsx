import { useState, useRef, useEffect } from 'react';
import { Search, Edit3, X, Database, Plus, Trash2, FileText, Printer, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { bookingStore } from '../utils/bookingStore';
import "../css/InvoiceGenerator.css";
const numberToWords = (num) => {
  if (!num || isNaN(num) || num === 0) return 'Zero Rupees Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const convertHundreds = (n) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  };
  let integerPart = Math.floor(num);
  let words = '';
  if (integerPart >= 10000000) {
    words += convertHundreds(Math.floor(integerPart / 10000000)) + ' Crore ';
    integerPart %= 10000000;
  }
  if (integerPart >= 100000) {
    words += convertHundreds(Math.floor(integerPart / 100000)) + ' Lakh ';
    integerPart %= 100000;
  }
  if (integerPart >= 1000) {
    words += convertHundreds(Math.floor(integerPart / 1000)) + ' Thousand ';
    integerPart %= 1000;
  }
  if (integerPart > 0) {
    words += convertHundreds(integerPart);
  }
  return words.trim() + ' Rupees Only';
};
const InvoiceGenerator = ({ invoices, setInvoices, bookings, otherBookings, isSyncing, setIsSyncing }) => {
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('ALL');
  const [prefillBookingId, setPrefillBookingId] = useState('');
  const defaultInvoiceForm = {
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Pending',
    template: 'challan',
    fromName: 'SiAn Smart Tech',
    fromEmail: 'siansmarttech@gmail.com',
    fromPhone: '9344678135',
    fromAddress: '5/195, Ponnu pillai thoppu, Anuppanadi, Madurai - 625009.',
    fromGst: '',
    toName: '',
    toEmail: '',
    toPhone: '',
    toAddress: '',
    modeOfPayment: 'Online',
    billReceiverName: '',
    bankHolderName: 'Sivakumar S G',
    bankName: 'State Bank of India',
    bankBranchName: 'Anuppanadi Branch',
    accountNumber: '35846100378',
    ifscCode: 'SBIN0061291',
    upiId: 'sivask7kumar@oksbi',
    items: [
      { description: 'Tech Diagnostics & Service', quantity: 1, unitPrice: 350, taxRate: 0, per: 'Nos' }
    ],
    discount: 0,
    notes: '',
  };
  const [invoiceForm, setInvoiceForm] = useState(defaultInvoiceForm);
  const containerRef = useRef(null);
  const paperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState('auto');
  useEffect(() => {
    if (!paperRef.current || !containerRef.current) return;
    const handleResize = () => {
      if (!paperRef.current || !containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const paperWidth = 600;
      if (containerWidth < paperWidth) {
        const newScale = containerWidth / paperWidth;
        setScale(newScale);
        setContainerHeight(`${paperRef.current.offsetHeight * newScale}px`);
      } else {
        setScale(1);
        setContainerHeight('auto');
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [isEditingInvoice, invoiceForm]);
  const filteredInvoices = invoices.filter(inv => {
    const q = invoiceSearchTerm.toLowerCase();
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.toName.toLowerCase().includes(q) ||
      inv.toEmail.toLowerCase().includes(q);
    const matchStatus = invoiceStatusFilter === 'ALL' || inv.status === invoiceStatusFilter;
    return matchSearch && matchStatus;
  });
  const prefillCandidates = [
    ...bookings.map(b => ({
      id: b.id,
      ticketId: b.ticketId,
      name: b.name,
      email: b.email,
      phone: b.phone,
      address: b.address,
      service: b.service,
      cost: b.estimatedCost,
      source: 'Website'
    })),
    ...otherBookings.map(b => ({
      id: b.id,
      ticketId: `OTHER-${b.id.substring(0, 5)}`,
      name: b.name,
      email: b.email,
      phone: b.phone,
      address: b.address,
      service: b.serviceType,
      cost: b.estimatedCost,
      source: 'Manual'
    }))
  ];
  const parsePrice = (priceStr) => {
    if (!priceStr) return 350;
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 350 : parsed;
  };
  const handlePrefillFromBooking = (bookingId) => {
    if (!bookingId) return;
    const candidate = prefillCandidates.find(c => c.id === bookingId);
    if (!candidate) return;
    const parsedCost = parsePrice(candidate.cost);
    setInvoiceForm(prev => ({
      ...prev,
      toName: candidate.name || '',
      toEmail: candidate.email || '',
      toPhone: candidate.phone || '',
      toAddress: candidate.address || '',
      billReceiverName: candidate.name || '',
      items: [
        { description: `${candidate.service || 'Tech Service'} - Ticket ${candidate.ticketId}`, quantity: 1, unitPrice: parsedCost, taxRate: 0, per: 'Nos' }
      ]
    }));
    toast.success("Prefilled client info and service fee!");
  };
  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.invoiceNumber.trim()) {
      toast.error("Please enter an Invoice Number!");
      return;
    }
    if (!invoiceForm.toName.trim()) {
      toast.error("Please enter Client Name!");
      return;
    }
    let updatedInvoices;
    const isExisting = invoices.some(inv => inv.id === invoiceForm.id);
    let targetInvoice = null;
    if (isExisting) {
      targetInvoice = { ...invoiceForm, updatedAt: new Date().toISOString() };
      updatedInvoices = invoices.map(inv => inv.id === invoiceForm.id ? targetInvoice : inv);
      toast.success(`Invoice ${invoiceForm.invoiceNumber} updated!`);
    } else {
      targetInvoice = {
        ...invoiceForm,
        id: invoiceForm.id || `inv-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedInvoices = [targetInvoice, ...invoices];
      toast.success(`Invoice ${invoiceForm.invoiceNumber} created!`);
    }
    setInvoices(updatedInvoices);
    setIsEditingInvoice(false);
    if (bookingStore.isInvoiceConfigured()) {
      setIsSyncing(true);
      if (isExisting) {
        await bookingStore.updateInvoice(invoiceForm.id, targetInvoice);
      } else {
        await bookingStore.addInvoice(targetInvoice);
      }
      setIsSyncing(false);
    }
  };
  const handleDuplicateInvoice = async (invoice) => {
    const lastNum = invoices.length + 1;
    const duplicated = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `SIAN-INV-2026-${String(1000 + lastNum).slice(1)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedInvoices = [duplicated, ...invoices];
    setInvoices(updatedInvoices);
    toast.success(`Duplicated to ${duplicated.invoiceNumber}`);
    if (bookingStore.isInvoiceConfigured()) {
      setIsSyncing(true);
      await bookingStore.addInvoice(duplicated);
      setIsSyncing(false);
    }
  };
  const handleDeleteInvoice = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      toast.success("Invoice deleted successfully!");
      if (bookingStore.isInvoiceConfigured()) {
        setIsSyncing(true);
        await bookingStore.deleteInvoice(id);
        setIsSyncing(false);
      }
    }
  };
  const handleNewInvoiceClick = () => {
    const lastNum = invoices.length + 1;
    const newInvoiceNo = `SIAN-INV-2026-${String(1000 + lastNum).slice(1)}`;
    setInvoiceForm({
      ...defaultInvoiceForm,
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvoiceNo,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setPrefillBookingId('');
    setIsEditingInvoice(true);
  };
  const calculateFinancials = (items = [], discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice) || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + ((Number(item.quantity) * Number(item.unitPrice) || 0) * (Number(item.taxRate) / 100) || 0), 0);
    const discountAmt = Number(discount) || 0;
    const grandTotal = Math.max(0, subtotal + totalTax - discountAmt);
    return {
      subtotal: subtotal.toFixed(2),
      totalTax: totalTax.toFixed(2),
      cgst: (totalTax / 2).toFixed(2),
      sgst: (totalTax / 2).toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  };
  const fmtDate = (iso) => {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  return (
    <div className="invoice-tab-root">
      {!isEditingInvoice ? (
        <>
          <div className="invoice-actions-row">
            <div className="invoice-search-filter">
              <div className="invoice-search-input-wrap">
                <Search size={16} className="invoice-search-icon" />
                <input type="text" placeholder="Search customer or invoice #..." value={invoiceSearchTerm} onChange={e => setInvoiceSearchTerm(e.target.value)} className="invoice-search-input" />
              </div>
              <select className="invoice-filter-select" value={invoiceStatusFilter} onChange={e => setInvoiceStatusFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button className="invoice-btn-primary" onClick={handleNewInvoiceClick}>
              <Plus size={16} /> Create Invoice
            </button>
          </div>
          <div className="ledger-table-container">
            {filteredInvoices.length > 0 ? (
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(invoice => {
                    const { grandTotal } = calculateFinancials(invoice.items, invoice.discount);
                    return (
                      <tr key={invoice.id}>
                        <td className="ledger-ticket inv-td-num">{invoice.invoiceNumber}</td>
                        <td>{fmtDate(invoice.date)}</td>
                        <td>
                          <div className="ledger-customer-name">{invoice.toName}</div>
                          <div className="ledger-customer-email">{invoice.toEmail}</div>
                        </td>
                        <td className="inv-td-cost">₹{grandTotal}</td>
                        <td>
                          <span className={`invoice-badge ${invoice.status.toLowerCase()}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td>
                          <div className="ledger-actions inv-ledger-actions">
                            <button className="invoice-view-btn" onClick={() => { setInvoiceForm(invoice); setPrefillBookingId(''); setIsEditingInvoice(true); }}><Edit3 size={13} /> Edit</button>
                            <button className="invoice-duplicate-btn" onClick={() => handleDuplicateInvoice(invoice)} title="Duplicate Invoice"><Copy size={13} /> Duplicate</button>
                            <button className="invoice-delete-btn-ledger" onClick={() => handleDeleteInvoice(invoice.id)} title="Delete"><Trash2 size={13} /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <FileText size={40} className="empty-state-icon admin-empty-state-icon" />
                <h3 className="empty-state-title">No Invoices Found</h3>
                <p>Create a new invoice template to get started.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="invoice-manager-grid">
          <form onSubmit={handleSaveInvoice} className="invoice-editor-panel">
            <div className="invoice-actions-row inv-actions-header">
              <h3 className="inv-actions-title">
                {invoiceForm.id && invoices.some(inv => inv.id === invoiceForm.id) ? 'Edit Invoice' : 'New Invoice'}
              </h3>
              <button type="button" className="refresh-btn inv-cancel-btn" onClick={() => setIsEditingInvoice(false)}>Cancel</button>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">
                <Database size={14} /> Quick Prefill from Booking
              </h4>
              <div className="invoice-form-group">
                <label className="invoice-label">Select Client / Ticket</label>
                <select className="invoice-select" value={prefillBookingId} onChange={e => {
                  const val = e.target.value;
                  setPrefillBookingId(val);
                  handlePrefillFromBooking(val);
                }}>
                  <option value="">-- Manual Entry (Or Select Booking to Prefill) --</option>
                  {prefillCandidates.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.source}] {c.ticketId} - {c.name} ({c.service})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">
                <FileText size={14} /> Invoice Settings
              </h4>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group inv-span-2">
                  <label className="invoice-label">Invoice Number *</label>
                  <input type="text" required className="invoice-input" value={invoiceForm.invoiceNumber} onChange={e => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} placeholder="e.g. SIAN-INV-2026-001" />
                </div>
              </div>
              <div className="invoice-form-row-3">
                <div className="invoice-form-group">
                  <label className="invoice-label">Issue Date</label>
                  <input type="date" className="invoice-input" value={invoiceForm.date} onChange={e => setInvoiceForm({ ...invoiceForm, date: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Due Date</label>
                  <input type="date" className="invoice-input" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Status</label>
                  <select className="invoice-select" value={invoiceForm.status} onChange={e => setInvoiceForm({ ...invoiceForm, status: e.target.value })}>
                    <option value="Pending">Pending / Draft</option>
                    <option value="Unpaid">Unpaid / Invoiced</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">Business Details (Bill From)</h4>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Business Name</label>
                  <input type="text" className="invoice-input" value={invoiceForm.fromName} onChange={e => setInvoiceForm({ ...invoiceForm, fromName: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">GSTIN / Tax ID</label>
                  <input type="text" className="invoice-input" value={invoiceForm.fromGst} onChange={e => setInvoiceForm({ ...invoiceForm, fromGst: e.target.value })} placeholder="Optional" />
                </div>
              </div>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Email</label>
                  <input type="email" className="invoice-input" value={invoiceForm.fromEmail} onChange={e => setInvoiceForm({ ...invoiceForm, fromEmail: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Phone</label>
                  <input type="text" className="invoice-input" value={invoiceForm.fromPhone} onChange={e => setInvoiceForm({ ...invoiceForm, fromPhone: e.target.value })} />
                </div>
              </div>
              <div className="invoice-form-group">
                <label className="invoice-label">Address</label>
                <textarea rows={2} className="invoice-textarea" value={invoiceForm.fromAddress} onChange={e => setInvoiceForm({ ...invoiceForm, fromAddress: e.target.value })} />
              </div>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">Client Details (Bill To)</h4>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Customer Name *</label>
                  <input type="text" required className="invoice-input" value={invoiceForm.toName} onChange={e => setInvoiceForm({ ...invoiceForm, toName: e.target.value })} placeholder="Client Full Name" />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Phone Number</label>
                  <input type="text" className="invoice-input" value={invoiceForm.toPhone} onChange={e => setInvoiceForm({ ...invoiceForm, toPhone: e.target.value })} placeholder="e.g. 9876543210" />
                </div>
              </div>
              <div className="invoice-form-group inv-mb-12">
                <label className="invoice-label">Email Address</label>
                <input type="email" className="invoice-input" value={invoiceForm.toEmail} onChange={e => setInvoiceForm({ ...invoiceForm, toEmail: e.target.value })} placeholder="e.g. customer [at] domain.com" />
              </div>
              <div className="invoice-form-group">
                <label className="invoice-label">Billing Address</label>
                <textarea rows={2} className="invoice-textarea" value={invoiceForm.toAddress} onChange={e => setInvoiceForm({ ...invoiceForm, toAddress: e.target.value })} placeholder="Client Delivery / Billing Address" />
              </div>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">Classic Challan Fields</h4>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Mode of Payment</label>
                  <select className="invoice-select" value={invoiceForm.modeOfPayment || 'Online'} onChange={e => setInvoiceForm({ ...invoiceForm, modeOfPayment: e.target.value })}>
                    <option value="Online">Online</option>
                    <option value="Bank">Bank</option>
                    <option value="IN - Hand">IN - Hand</option>
                  </select>
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Bill Receiver Name</label>
                  <input type="text" className="invoice-input" value={invoiceForm.billReceiverName} onChange={e => setInvoiceForm({ ...invoiceForm, billReceiverName: e.target.value })} placeholder="Receiver's Name (defaults to Customer)" />
                </div>
              </div>
              <div className="inv-bank-subhead">Bank Details</div>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Bank Holder Name</label>
                  <input type="text" className="invoice-input" value={invoiceForm.bankHolderName} onChange={e => setInvoiceForm({ ...invoiceForm, bankHolderName: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Bank Name</label>
                  <input type="text" className="invoice-input" value={invoiceForm.bankName} onChange={e => setInvoiceForm({ ...invoiceForm, bankName: e.target.value })} />
                </div>
              </div>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Bank Branch Name</label>
                  <input type="text" className="invoice-input" value={invoiceForm.bankBranchName} onChange={e => setInvoiceForm({ ...invoiceForm, bankBranchName: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">Account Number</label>
                  <input type="text" className="invoice-input" value={invoiceForm.accountNumber} onChange={e => setInvoiceForm({ ...invoiceForm, accountNumber: e.target.value })} />
                </div>
              </div>
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">IFSC Code</label>
                  <input type="text" className="invoice-input" value={invoiceForm.ifscCode} onChange={e => setInvoiceForm({ ...invoiceForm, ifscCode: e.target.value })} />
                </div>
                <div className="invoice-form-group">
                  <label className="invoice-label">UPI ID</label>
                  <input type="text" className="invoice-input" value={invoiceForm.upiId} onChange={e => setInvoiceForm({ ...invoiceForm, upiId: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="invoice-editor-section">
              <h4 className="invoice-section-title">Services & Line Items</h4>
              <div className="invoice-items-editor-wrap">
                <div className="items-list-header inv-grid-7col">
                  <span>Item Description</span>
                  <span>Qty</span>
                  <span>Unit Price</span>
                  <span>per</span>
                  <span>Tax %</span>
                  <span className="inv-text-right">Total</span>
                  <span></span>
                </div>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} className="item-row inv-grid-7col">
                    <input type="text" required className="invoice-input inv-input-padded" value={item.description} onChange={e => {
                      const updatedItems = [...invoiceForm.items];
                      updatedItems[idx].description = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: updatedItems });
                    }} placeholder="e.g. Hard Drive Swap" />
                    <input type="number" required min="1" className="invoice-input inv-input-padded" value={item.quantity} onChange={e => {
                      const updatedItems = [...invoiceForm.items];
                      updatedItems[idx].quantity = parseInt(e.target.value) || 1;
                      setInvoiceForm({ ...invoiceForm, items: updatedItems });
                    }} />
                    <input type="number" required min="0" className="invoice-input inv-input-padded" value={item.unitPrice} onChange={e => {
                      const updatedItems = [...invoiceForm.items];
                      updatedItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                      setInvoiceForm({ ...invoiceForm, items: updatedItems });
                    }}
                    />
                    <input type="text" className="invoice-input inv-input-padded" value={item.per || 'Nos'} onChange={e => {
                      const updatedItems = [...invoiceForm.items];
                      updatedItems[idx].per = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: updatedItems });
                    }}
                      placeholder="e.g. Nos"
                    />
                    <input type="number" required min="0" max="100" className="invoice-input inv-input-padded" value={item.taxRate}
                      onChange={e => {
                        const updatedItems = [...invoiceForm.items];
                        updatedItems[idx].taxRate = parseFloat(e.target.value) || 0;
                        setInvoiceForm({ ...invoiceForm, items: updatedItems });
                      }}
                    />
                    <span className="inv-text-right inv-td-font600">₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                    <button type="button" className="item-delete-btn" onClick={() => {
                      if (invoiceForm.items.length === 1) {
                        toast.error("Invoice must have at least 1 line item!");
                        return;
                      }
                      const updatedItems = invoiceForm.items.filter((_, i) => i !== idx);
                      setInvoiceForm({ ...invoiceForm, items: updatedItems });
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="add-item-btn" onClick={() => {
                const newItem = { description: 'Additional Tech Service', quantity: 1, unitPrice: 0, taxRate: 0, per: 'Nos' };
                setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, newItem] });
              }}>
                <Plus size={12} /> Add Line Item
              </button>
            </div>
            <div className="invoice-editor-section">
              <div className="invoice-form-row-2">
                <div className="invoice-form-group">
                  <label className="invoice-label">Discount Amount (₹)</label>
                  <input type="number" min="0" className="invoice-input" value={invoiceForm.discount} onChange={e => setInvoiceForm({ ...invoiceForm, discount: parseFloat(e.target.value) || 0 })} placeholder="e.g. 100" />
                </div>
              </div>
              <div className="invoice-form-group" style={{ marginTop: '12px' }}>
                <label className="invoice-label">Notes & Terms / Declaration Notes</label>
                <textarea rows={3} className="invoice-textarea" value={invoiceForm.notes} onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} placeholder="Special conditions or notes..." />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="invoice-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Save Invoice Details</button>
            </div>
          </form>
          <div className="invoice-preview-panel">
            <div className="invoice-actions-row">
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Live A4 Paper Preview</span>
              <button type="button" className="invoice-btn-primary" style={{ background: '#22c55e' }} onClick={() => window.print()}>
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
            <div className="invoice-paper-shadow" ref={containerRef} style={{ '--invoice-container-height': containerHeight }}>
              <div className="invoice-paper theme-challan" ref={paperRef} style={{ '--invoice-scale': scale, '--invoice-position': scale < 1 ? 'absolute' : 'relative' }}>
                <div className={`invoice-stamp ${invoiceForm.status.toLowerCase()}`} style={{ top: '160px', right: '60px' }}>{invoiceForm.status}</div>
                <div className="challan-title-bar">INVOICE CUM DELIVERY CHALLAN</div>
                <div className="challan-header-grid">
                  <div className="challan-logo-box">
                    <img src="/invoice/siansmarttech.jpg" alt="SiAn Smart Tech Logo" className="challan-logo-img" />
                  </div>
                  <div className="challan-address-box">
                    <h3>{invoiceForm.fromName}</h3>
                    <span style={{ fontSize: '9px', fontStyle: 'italic', fontWeight: 'bold', color: '#3b82f6', marginTop: '-4px', marginBottom: '2px' }}>Tech with Care</span>
                    <span>{invoiceForm.fromAddress}</span>
                    <span>PH - {invoiceForm.fromPhone}</span>
                    <span>E-Mail - {invoiceForm.fromEmail}</span>
                  </div>
                  <div className="challan-meta-box">
                    <div className="challan-meta-row">
                      <span className="challan-meta-label">Invoice No.</span>
                      <span className="challan-meta-value">{invoiceForm.invoiceNumber}</span>
                    </div>
                    <div className="challan-meta-row">
                      <span className="challan-meta-label">Dated</span>
                      <span className="challan-meta-value">{fmtDate(invoiceForm.date)}</span>
                    </div>
                    <div className="challan-meta-row">
                      <span className="challan-meta-label">Mode of Payment</span>
                      <div className="challan-payment-grid">
                        <div className="challan-payment-col">
                          <span className="challan-payment-lbl">Online</span>
                          <span className="challan-payment-val">
                            {invoiceForm.modeOfPayment === 'Online' ? 'YES' : ''}
                          </span>
                        </div>
                        <div className="challan-payment-col">
                          <span className="challan-payment-lbl">Bank</span>
                          <span className="challan-payment-val">
                            {invoiceForm.modeOfPayment === 'Bank' ? 'YES' : ''}
                          </span>
                        </div>
                        <div className="challan-payment-col">
                          <span className="challan-payment-lbl">IN - Hand</span>
                          <span className="challan-payment-val">
                            {invoiceForm.modeOfPayment === 'IN - Hand' ? 'YES' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="challan-billto-grid">
                  <div className="challan-billto-box">
                    <div style={{ fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>Bill to Details</div>To,<br />
                    <strong>{invoiceForm.toName || '(Customer Name)'}</strong><br />
                    {invoiceForm.toAddress || '(Billing Address)'}<br />
                    {invoiceForm.toPhone && <>PH: {invoiceForm.toPhone}</>}
                  </div>
                  <div className="challan-receiver-box">
                    <div className="challan-receiver-row">
                      <span className="challan-meta-label">Bill Receiver Name</span>
                      <span className="challan-meta-value" style={{ padding: '4px', fontSize: '11px' }}>
                        {invoiceForm.billReceiverName || invoiceForm.toName || '(Receiver Name)'}
                      </span>
                    </div>
                    <div className="challan-receiver-row">
                      <span className="challan-meta-label">Note</span>
                      <span className="challan-meta-value" style={{ padding: '4px', fontSize: '10px', fontWeight: 'normal', textAlign: 'left', minHeight: '30px' }}>
                        {invoiceForm.notes}
                      </span>
                    </div>
                  </div>
                </div>
                <table className="challan-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>S/NO.</th>
                      <th>Item Description</th>
                      <th style={{ width: '80px', textAlign: 'right' }}>Rate</th>
                      <th style={{ width: '70px', textAlign: 'center' }}>Quantity</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>per</th>
                      <th style={{ width: '100px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const item = invoiceForm.items[idx];
                      return (
                        <tr key={idx}>
                          <td style={{ textAlign: 'center' }}>{item ? `${idx + 1}.` : ''}</td>
                          <td style={{ fontWeight: item ? '500' : 'normal' }}>{item ? item.description : ''}</td>
                          <td style={{ textAlign: 'right' }}>{item ? `₹${item.unitPrice.toFixed(2)}` : ''}</td>
                          <td style={{ textAlign: 'center' }}>{item ? item.quantity : ''}</td>
                          <td style={{ textAlign: 'center' }}>{item ? (item.per || 'Nos') : ''}</td>
                          <td style={{ textAlign: 'right', fontWeight: item ? 'bold' : 'normal' }}>
                            {item ? `₹${(item.quantity * item.unitPrice).toFixed(2)}` : ''}
                          </td>
                        </tr>
                      );
                    })}
                    {(() => {
                      const { grandTotal } = calculateFinancials(invoiceForm.items, invoiceForm.discount);
                      return (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', textTransform: 'uppercase', paddingRight: '15px' }}>Grand Total</td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>₹{grandTotal}</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
                {(() => {
                  const { grandTotal } = calculateFinancials(invoiceForm.items, invoiceForm.discount);
                  return (
                    <div className="challan-words-row">
                      <div className="challan-words-lbl">Amount Chargeable in Word</div>
                      <div className="challan-words-val">{numberToWords(parseFloat(grandTotal))}</div>
                    </div>
                  );
                })()}
                <div className="challan-footer-grid">
                  <div className="challan-bank-box">
                    <div className="challan-bank-title">Bank Details</div>
                    <table className="challan-bank-table">
                      <tbody>
                        <tr>
                          <td>Bank Holder Name</td>
                          <td>{invoiceForm.bankHolderName || 'Sivakumar S G'}</td>
                        </tr>
                        <tr>
                          <td>Bank Name</td>
                          <td>{invoiceForm.bankName || 'State Bank of India'}</td>
                        </tr>
                        <tr>
                          <td>Bank Branch Name</td>
                          <td>{invoiceForm.bankBranchName || 'Anuppanadi Branch'}</td>
                        </tr>
                        <tr>
                          <td>Account Number</td>
                          <td>{invoiceForm.accountNumber || '35846100378'}</td>
                        </tr>
                        <tr>
                          <td>IFSC Code</td>
                          <td>{invoiceForm.ifscCode || 'SBIN0061291'}</td>
                        </tr>
                        <tr>
                          <td>UPI ID</td>
                          <td style={{ color: '#11678E', fontWeight: 'bold' }}>{invoiceForm.upiId || 'sivask7kumar@oksbi'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="challan-seal-box">
                    <div className="challan-seal-title">For SiAn Smart Tech</div>
                    <div className="challan-seal-img-wrap">
                      <img src="/invoice/Seal with sign for bill.jpg" alt="SiAn SmartTech Seal" className="challan-seal-img" />
                    </div>
                    <div className="challan-seal-sign-lbl">Authorised Signatory</div>
                  </div>
                </div>
                <div className="challan-dec-box">
                  <div className="challan-dec-title">Company Declaration</div>
                  <ul className="challan-dec-list">
                    <li>1. Goods/services are delivered in working condition.</li>
                    <li>2. We are not liable for damage after delivery.</li>
                    <li>3. Warranty applies as per item.</li>
                  </ul>
                </div>
                <div className="challan-tagline">
                  Laptop Mother Board Level Service / Laptop, System, Printer are Best Level Sale & Services / Drone Repair
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InvoiceGenerator;