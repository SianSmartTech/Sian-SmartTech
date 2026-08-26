import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Receipt, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { validateCustomerPhone, validateCustomerEmail } from '../../../utils/validation';
export const ScheduleModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    workDescription: '',
    assignedTo: 'SivaKumar S G',
    priority: 'Medium',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        customerName: item.customerName || '',
        customerPhone: item.customerPhone || '',
        customerEmail: item.customerEmail || '',
        workDescription: item.workDescription || '',
        assignedTo: item.assignedTo || 'SivaKumar S G',
        priority: item.priority || 'Medium',
        status: item.status || 'Pending',
        date: item.date || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        workDescription: '',
        assignedTo: 'SivaKumar S G',
        priority: 'Medium',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [item, isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      toast.error('Please enter Customer Name.');
      return;
    }
    const phoneVal = validateCustomerPhone(formData.customerPhone, { required: true, fieldName: 'Customer Phone' });
    if (!phoneVal.isValid) {
      toast.error(phoneVal.error);
      return;
    }
    const emailVal = validateCustomerEmail(formData.customerEmail, { required: false, fieldName: 'Customer Email' });
    if (!emailVal.isValid) {
      toast.error(emailVal.error);
      return;
    }
    onSave({
      ...formData,
      customerPhone: phoneVal.cleaned || formData.customerPhone.trim()
    });
  };
  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-header">
          <div className="bm-modal-header-icon bg-indigo">
            <Calendar size={20} />
          </div>
          <div>
            <h3>{item ? 'Edit Work Schedule' : 'Create Work Schedule'}</h3>
            <p className="bm-modal-sub">Assign service tasks and schedule field / workshop jobs</p>
          </div>
          <button className="bm-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="bm-modal-form">
          <div className="bm-form-grid-3">
            <div className="bm-form-group">
              <label>Client / Customer Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Apex Logistics"
              />
            </div>
            <div className="bm-form-group">
              <label>Customer Phone *</label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            <div className="bm-form-group">
              <label>Customer Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="e.g. client@domain.com"
              />
            </div>
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Scheduled Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="bm-form-group">
              <label>Assigned Technician</label>
              <input
                type="text"
                readOnly
                value={formData.assignedTo || 'SivaKumar S G'}
                style={{ backgroundColor: '#f8fafc', cursor: 'default', fontWeight: 600, color: '#1e293b' }}
              />
            </div>
          </div>
          <div className="bm-form-group">
            <label>Work Description / Scope *</label>
            <textarea
              rows={2}
              required
              value={formData.workDescription}
              onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
              placeholder="e.g. CCTV Camera Installation & Network Cabling..."
            />
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Schedule Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="bm-form-group">
            <label>Internal Technician Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special instructions, parts needed..."
            />
          </div>
          <div className="bm-modal-actions">
            <button type="button" className="bm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="bm-btn-submit">
              <Save size={16} /> {item ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export const IncomeModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    productService: '',
    purchaseAmount: 0,
    billAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        customerName: item.customerName || '',
        customerPhone: item.customerPhone || '',
        customerEmail: item.customerEmail || '',
        productService: item.productService || '',
        purchaseAmount: item.purchaseAmount || 0,
        billAmount: item.billAmount || 0,
        paymentStatus: item.paymentStatus || 'Paid',
        paymentMethod: item.paymentMethod || 'UPI',
        date: item.date || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        productService: '',
        purchaseAmount: 0,
        billAmount: 0,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [item, isOpen]);
  if (!isOpen) return null;
  const profit = Math.max(0, Number(formData.billAmount || 0) - Number(formData.purchaseAmount || 0));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      toast.error('Please enter Customer / Company Name.');
      return;
    }
    const phoneVal = validateCustomerPhone(formData.customerPhone, { required: false, fieldName: 'Customer Mobile' });
    if (!phoneVal.isValid) {
      toast.error(phoneVal.error);
      return;
    }
    const emailVal = validateCustomerEmail(formData.customerEmail, { required: false, fieldName: 'Customer Email' });
    if (!emailVal.isValid) {
      toast.error(emailVal.error);
      return;
    }
    onSave({
      ...formData,
      customerPhone: phoneVal.cleaned || formData.customerPhone.trim()
    });
  };
  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-header">
          <div className="bm-modal-header-icon bg-emerald">
            <DollarSign size={20} />
          </div>
          <div>
            <h3>{item ? 'Edit Income & Sales Record' : 'Record New Income / Sale'}</h3>
            <p className="bm-modal-sub">Log client sales, parts revenue, and calculate margins</p>
          </div>
          <button className="bm-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="bm-modal-form">
          <div className="bm-form-grid-3">
            <div className="bm-form-group">
              <label>Customer / Company Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Zenith Media"
              />
            </div>
            <div className="bm-form-group">
              <label>Customer Mobile</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            <div className="bm-form-group">
              <label>Customer Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="e.g. client@domain.com"
              />
            </div>
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Product / Service Delivered *</label>
              <input
                type="text"
                required
                value={formData.productService}
                onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
                placeholder="e.g. Laptop Motherboard Replacement"
              />
            </div>
            <div className="bm-form-group">
              <label>Transaction Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <div className="bm-financial-inputs-card">
            <div className="bm-form-grid-3">
              <div className="bm-form-group">
                <label>Purchase / Cost Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.purchaseAmount}
                  onChange={(e) => setFormData({ ...formData, purchaseAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="bm-form-group">
                <label>Bill / Sale Amount (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.billAmount}
                  onChange={(e) => setFormData({ ...formData, billAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="bm-form-group">
                <label>Gross Profit (Calculated)</label>
                <div className="bm-calc-display">₹{profit.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="Paid">Paid (Full)</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending / Credit</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>
          <div className="bm-form-group">
            <label>Notes / Invoice Reference</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Invoice #, warranty terms..."
            />
          </div>
          <div className="bm-modal-actions">
            <button type="button" className="bm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="bm-btn-submit">
              <Save size={16} /> {item ? 'Save Changes' : 'Record Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export const ExpenseModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    category: 'Electricity',
    description: '',
    amount: 0,
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        category: item.category || 'Electricity',
        description: item.description || '',
        amount: item.amount || 0,
        paymentMethod: item.paymentMethod || 'UPI',
        date: item.date || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
    } else {
      setFormData({
        category: 'Electricity',
        description: '',
        amount: 0,
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [item, isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-header">
          <div className="bm-modal-header-icon bg-rose">
            <Receipt size={20} />
          </div>
          <div>
            <h3>{item ? 'Edit Business Expense' : 'Log New Expense'}</h3>
            <p className="bm-modal-sub">Track office operating costs, bills, wages & overheads</p>
          </div>
          <button className="bm-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="bm-modal-form">
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Expense Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electricity">Electricity & Power</option>
                <option value="Internet">Internet & Telecom</option>
                <option value="Rent">Office / Space Rent</option>
                <option value="Salary">Staff Wages & Stipends</option>
                <option value="Travel">Travel & Fuel</option>
                <option value="Equipment">Tools & Hardware Equipment</option>
                <option value="Marketing">Marketing & Ads</option>
                <option value="Software">Software & Cloud Subscriptions</option>
                <option value="Maintenance">Shop Maintenance & Tea</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Expense Amount (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="bm-form-group">
            <label>Description / Vendor Name *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Commercial Office EB Bill, Airtel Fiber"
            />
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Payment Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <div className="bm-form-group">
            <label>Notes / Receipt Reference</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="EB consumer number, transaction ID..."
            />
          </div>
          <div className="bm-modal-actions">
            <button type="button" className="bm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="bm-btn-submit">
              <Save size={16} /> {item ? 'Save Changes' : 'Log Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export const DuePaymentModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    dueType: 'Loan',
    name: '',
    description: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'Monthly',
    status: 'Pending',
    paidDate: '',
    reminderDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        dueType: item.dueType || 'Loan',
        name: item.name || '',
        description: item.description || '',
        amount: item.amount || 0,
        dueDate: item.dueDate || new Date().toISOString().split('T')[0],
        frequency: item.frequency || 'Monthly',
        status: item.status || 'Pending',
        paidDate: item.paidDate || '',
        reminderDate: item.reminderDate || new Date().toISOString().split('T')[0],
        notes: item.notes || ''
      });
    } else {
      setFormData({
        dueType: 'Loan',
        name: '',
        description: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        frequency: 'Monthly',
        status: 'Pending',
        paidDate: '',
        reminderDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [item, isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-header">
          <div className="bm-modal-header-icon bg-amber">
            <Clock size={20} />
          </div>
          <div>
            <h3>{item ? 'Edit Due / Recurring Payment' : 'Create Due / Recurring Payment'}</h3>
            <p className="bm-modal-sub">Set up loan EMIs, interest dues, utility bills and reminder dates</p>
          </div>
          <button className="bm-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="bm-modal-form">
          <div className="bm-form-grid-3">
            <div className="bm-form-group">
              <label>Due Type / Obligation *</label>
              <select
                value={formData.dueType}
                onChange={(e) => setFormData({ ...formData, dueType: e.target.value })}
              >
                <option value="Loan">Loan EMI / Equipment Finance</option>
                <option value="Interest">Interest Due</option>
                <option value="Rent">Office Space Rent</option>
                <option value="Electricity">Electricity Bill</option>
                <option value="Internet">Internet / Leased Line</option>
                <option value="Salary">Staff Salary</option>
                <option value="Recharge">SIM / Recharge</option>
                <option value="Vendor">Vendor Balance</option>
                <option value="Tax">GST / Income Tax</option>
                <option value="Other">Other Obligation</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Due Name / Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. HDFC Machinery Loan EMI"
              />
            </div>
            <div className="bm-form-group">
              <label>Due Amount (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="bm-form-grid-3">
            <div className="bm-form-group">
              <label>Payment Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="One-Time">One-Time</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="bm-form-group">
              <label>Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="bm-form-group">
              <label>Reminder Alert Date</label>
              <input
                type="date"
                value={formData.reminderDate}
                onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
              />
            </div>
          </div>
          <div className="bm-form-grid-2">
            <div className="bm-form-group">
              <label>Payment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            {formData.status === 'Paid' && (
              <div className="bm-form-group">
                <label>Paid Date</label>
                <input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="bm-form-group">
            <label>Description & Payment Account Details</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Loan account #, auto-debit bank, installment 12 of 36..."
            />
          </div>
          <div className="bm-modal-actions">
            <button type="button" className="bm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="bm-btn-submit">
              <Save size={16} /> {item ? 'Save Changes' : 'Create Due Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};