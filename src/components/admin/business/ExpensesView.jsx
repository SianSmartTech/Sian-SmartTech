import { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  Tag,
  CreditCard
} from 'lucide-react';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const ExpensesView = ({ expenses = [], onOpenModal, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const filtered = expenses.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (e.description || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q) ||
      (e.notes || '').toLowerCase().includes(q);
    const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchMethod = methodFilter === 'ALL' || e.paymentMethod === methodFilter;
    return matchSearch && matchCat && matchMethod;
  });
  const totalExpense = filtered.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const categorySummary = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Operating Expenses & Overheads</h2>
          <p className="bm-view-sub">
            Track business bills, office rent, utilities, salaries, tools, and recurring overheads
          </p>
        </div>
        <button className="bm-btn-primary rose" onClick={() => onOpenModal('expense')}>
          <Plus size={16} /> Log Expense
        </button>
      </div>
      <div className="bm-cat-pills-scroll">
        <div
          className={`bm-cat-pill ${categoryFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('ALL')}
        >
          <span>All Categories</span>
          <span className="bm-cat-pill-count">{formatINR(totalExpense)}</span>
        </div>
        {Object.entries(categorySummary).map(([cat, amt]) => (
          <div
            key={cat}
            className={`bm-cat-pill ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            <span>{cat}</span>
            <span className="bm-cat-pill-count">{formatINR(amt)}</span>
          </div>
        ))}
      </div>
      <div className="bm-filter-bar">
        <div className="bm-search-box">
          <Search size={16} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by description, vendor, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bm-filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Categories</option>
            <option value="Electricity">Electricity & Power</option>
            <option value="Internet">Internet & Telecom</option>
            <option value="Rent">Office Rent</option>
            <option value="Salary">Salaries & Wages</option>
            <option value="Travel">Travel & Fuel</option>
            <option value="Equipment">Tools & Hardware</option>
            <option value="Marketing">Marketing & Ads</option>
            <option value="Software">Software & Cloud</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
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
                <th>Category</th>
                <th>Description / Vendor</th>
                <th>Amount (₹)</th>
                <th>Payment Mode</th>
                <th>Notes / Ref</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="bm-date-cell">
                      <Calendar size={14} />
                      <span>{e.date || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`bm-exp-cat-badge cat-${(e.category || 'other').toLowerCase()}`}>
                      <Tag size={11} /> {e.category || 'Other'}
                    </span>
                  </td>
                  <td>
                    <div className="bm-cell-primary">{e.description}</div>
                  </td>
                  <td>
                    <span className="bm-exp-amount">{formatINR(e.amount)}</span>
                  </td>
                  <td>
                    <span className="bm-method-tag">
                      <CreditCard size={11} /> {e.paymentMethod || 'UPI'}
                    </span>
                  </td>
                  <td>
                    <span className="bm-work-notes">{e.notes || '–'}</span>
                  </td>
                  <td className="text-right">
                    <div className="bm-action-btn-group">
                      <button
                        className="bm-icon-btn edit"
                        title="Edit Expense"
                        onClick={() => onEdit(e)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="bm-icon-btn delete"
                        title="Delete Expense"
                        onClick={() => onDelete(e.id)}
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
                    <Receipt size={36} className="bm-empty-icon text-rose" />
                    <h4>No Expenses Recorded</h4>
                    <p>Click "Log Expense" to record an operating cost or overhead.</p>
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
