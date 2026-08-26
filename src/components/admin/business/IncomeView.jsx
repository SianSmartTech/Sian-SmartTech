import { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Trash2
} from 'lucide-react';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const IncomeView = ({ income = [], onOpenModal, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const filtered = income.filter((i) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (i.customerName || '').toLowerCase().includes(q) ||
      (i.productService || '').toLowerCase().includes(q) ||
      (i.customerPhone || '').toLowerCase().includes(q) ||
      (i.customerEmail || '').toLowerCase().includes(q) ||
      (i.notes || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || i.paymentStatus === statusFilter;
    const matchMethod = methodFilter === 'ALL' || i.paymentMethod === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });
  const totalBill = filtered.reduce((acc, i) => acc + (Number(i.billAmount) || 0), 0);
  const totalCost = filtered.reduce((acc, i) => acc + (Number(i.purchaseAmount) || 0), 0);
  const totalProfit = totalBill - totalCost;
  const avgMargin = totalBill > 0 ? Math.round((totalProfit / totalBill) * 100) : 0;
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Income & Sales Ledger</h2>
          <p className="bm-view-sub">
            Track customer billings, product/service purchases, and calculated gross profit
          </p>
        </div>
        <button className="bm-btn-primary emerald" onClick={() => onOpenModal('income')}>
          <Plus size={16} /> Record Income / Sale
        </button>
      </div>
      <div className="bm-summary-grid-4">
        <div className="bm-summary-card">
          <span className="bm-summary-lbl">Total Billed Revenue</span>
          <div className="bm-summary-val text-emerald">{formatINR(totalBill)}</div>
          <span className="bm-summary-sub">{filtered.length} transactions</span>
        </div>
        <div className="bm-summary-card">
          <span className="bm-summary-lbl">Purchase / Cost of Goods</span>
          <div className="bm-summary-val text-slate">{formatINR(totalCost)}</div>
          <span className="bm-summary-sub">Direct product expenses</span>
        </div>
        <div className="bm-summary-card">
          <span className="bm-summary-lbl">Gross Profit</span>
          <div className="bm-summary-val text-indigo">{formatINR(totalProfit)}</div>
          <span className="bm-summary-sub">Revenue - Purchase cost</span>
        </div>
        <div className="bm-summary-card">
          <span className="bm-summary-lbl">Profit Margin</span>
          <div className="bm-summary-val text-blue">{avgMargin}%</div>
          <span className="bm-summary-sub">Average return on sales</span>
        </div>
      </div>
      <div className="bm-filter-bar">
        <div className="bm-search-box">
          <Search size={16} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by customer, product/service, phone..."
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
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending / Credit</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
      </div>
      <div className="bm-table-card">
        <div className="bm-table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product / Service</th>
                <th>Cost (₹)</th>
                <th>Bill (₹)</th>
                <th>Profit (₹)</th>
                <th>Payment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const profit = Number(i.billAmount || 0) - Number(i.purchaseAmount || 0);
                return (
                  <tr key={i.id}>
                    <td>
                      <div className="bm-date-cell">
                        <Calendar size={14} />
                        <span>{i.date || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="bm-cell-primary">{i.customerName}</div>
                      {i.customerPhone && (
                        <div className="bm-cell-sub"><Phone size={11} /> {i.customerPhone}</div>
                      )}
                      {i.customerEmail && (
                        <div className="bm-cell-sub"><Mail size={11} /> {i.customerEmail}</div>
                      )}
                    </td>
                    <td>
                      <div className="bm-work-desc">{i.productService}</div>
                      {i.notes && <div className="bm-work-notes">{i.notes}</div>}
                    </td>
                    <td>
                      <span className="bm-cost-amt">{formatINR(i.purchaseAmount)}</span>
                    </td>
                    <td>
                      <span className="bm-bill-amt">{formatINR(i.billAmount)}</span>
                    </td>
                    <td>
                      <span className={`bm-profit-amt ${profit >= 0 ? 'text-emerald' : 'text-rose'}`}>
                        {formatINR(profit)}
                      </span>
                    </td>
                    <td>
                      <div className="bm-payment-badges">
                        <span className={`bm-status-pill status-${(i.paymentStatus || 'paid').toLowerCase()}`}>
                          {i.paymentStatus || 'Paid'}
                        </span>
                        <span className="bm-method-tag">
                          {i.paymentMethod || 'UPI'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="bm-action-btn-group">
                        <button
                          className="bm-icon-btn edit"
                          title="Edit Income"
                          onClick={() => onEdit(i)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="bm-icon-btn delete"
                          title="Delete Record"
                          onClick={() => onDelete(i.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="bm-empty-cell py-12">
                    <DollarSign size={36} className="bm-empty-icon text-emerald" />
                    <h4>No Income Records Found</h4>
                    <p>Click "Record Income / Sale" to add your first revenue entry.</p>
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