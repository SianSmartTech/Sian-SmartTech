import { useState } from 'react';
import {
  ClockAlert,
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check
} from 'lucide-react';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const DuePaymentsView = ({ duePayments = [], onOpenModal, onEdit, onDelete, onMarkPaid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const filtered = duePayments.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (d.name || '').toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q) ||
      (d.dueType || '').toLowerCase().includes(q) ||
      (d.notes || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchType = typeFilter === 'ALL' || d.dueType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });
  const overdueItems = duePayments.filter((d) => d.status === 'Overdue');
  const pendingItems = duePayments.filter((d) => d.status === 'Pending');
  const paidItems = duePayments.filter((d) => d.status === 'Paid');
  const overdueTotal = overdueItems.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const pendingTotal = pendingItems.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const paidTotal = paidItems.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Interest, Loan EMIs & Recurring Dues</h2>
          <p className="bm-view-sub">
            Monitor and manage equipment loan EMIs, office rent, power bills, and scheduled liabilities
          </p>
        </div>
        <button className="bm-btn-primary amber" onClick={() => onOpenModal('due')}>
          <Plus size={16} /> New Due Payment
        </button>
      </div>
      <div className="bm-summary-grid-3">
        <div className="bm-summary-card card-alert-rose">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Overdue Obligations</span>
            <AlertTriangle size={18} className="text-rose" />
          </div>
          <div className="bm-summary-val text-rose">{formatINR(overdueTotal)}</div>
          <span className="bm-summary-sub">{overdueItems.length} overdue payments</span>
        </div>
        <div className="bm-summary-card card-alert-amber">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Upcoming Pending Dues</span>
            <Clock size={18} className="text-amber" />
          </div>
          <div className="bm-summary-val text-amber">{formatINR(pendingTotal)}</div>
          <span className="bm-summary-sub">{pendingItems.length} upcoming obligations</span>
        </div>
        <div className="bm-summary-card card-alert-emerald">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Settled / Paid Dues</span>
            <CheckCircle2 size={18} className="text-emerald" />
          </div>
          <div className="bm-summary-val text-emerald">{formatINR(paidTotal)}</div>
          <span className="bm-summary-sub">{paidItems.length} settled payments</span>
        </div>
      </div>
      <div className="bm-filter-bar">
        <div className="bm-search-box">
          <Search size={16} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by due title, description, bank/account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bm-filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Due Types</option>
            <option value="Loan">Loan EMI</option>
            <option value="Interest">Interest</option>
            <option value="Rent">Office Rent</option>
            <option value="Electricity">Electricity</option>
            <option value="Internet">Internet</option>
            <option value="Salary">Salary</option>
            <option value="Recharge">Recharge</option>
            <option value="Vendor">Vendor</option>
            <option value="Tax">Tax</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="bm-table-card">
        <div className="bm-table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Due Type</th>
                <th>Obligation Title & Details</th>
                <th>Amount (₹)</th>
                <th>Due Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className={`bm-due-type-badge type-${(d.dueType || 'other').toLowerCase()}`}>
                      {d.dueType || 'Other'}
                    </span>
                  </td>
                  <td>
                    <div className="bm-cell-primary">{d.name}</div>
                    {d.description && <div className="bm-cell-sub">{d.description}</div>}
                    {d.notes && <div className="bm-work-notes">{d.notes}</div>}
                  </td>
                  <td>
                    <span className="bm-due-cell-amount">{formatINR(d.amount)}</span>
                  </td>
                  <td>
                    <div className="bm-date-cell">
                      <Calendar size={14} />
                      <span>{d.dueDate || 'N/A'}</span>
                    </div>
                    {d.reminderDate && (
                      <div className="bm-reminder-sub">Alert: {d.reminderDate}</div>
                    )}
                  </td>
                  <td>
                    <span className="bm-freq-badge">{d.frequency || 'Monthly'}</span>
                  </td>
                  <td>
                    <span className={`bm-status-pill status-${(d.status || 'pending').toLowerCase()}`}>
                      {d.status || 'Pending'}
                    </span>
                    {d.status === 'Paid' && d.paidDate && (
                      <div className="bm-reminder-sub">Paid on {d.paidDate}</div>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="bm-action-btn-group">
                      {d.status !== 'Paid' && (
                        <button
                          className="bm-icon-btn check"
                          title="Mark as Settled / Paid"
                          onClick={() => onMarkPaid && onMarkPaid(d)}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        className="bm-icon-btn edit"
                        title="Edit Due Payment"
                        onClick={() => onEdit(d)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="bm-icon-btn delete"
                        title="Delete Record"
                        onClick={() => onDelete(d.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="bm-empty-cell py-12">
                    <ClockAlert size={36} className="bm-empty-icon text-amber" />
                    <h4>No Due Payments Found</h4>
                    <p>Click "New Due Payment" to schedule an upcoming obligation or loan EMI.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
