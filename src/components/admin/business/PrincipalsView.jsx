import { useState } from 'react';
import { Landmark, Plus, Search, Calendar, Edit2, Trash2, DollarSign, ShieldCheck, Percent, PlusCircle, Building2 } from 'lucide-react';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const PrincipalsView = ({
  principals = [],
  duePayments = [],
  onOpenModal,
  onEdit,
  onDelete,
  onAddDueForPrincipal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const filtered = principals.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (p.name || '').toLowerCase().includes(q) ||
      (p.lenderSource || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.notes || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });
  const activePrincipals = principals.filter((p) => p.status === 'Active' || !p.status);
  const settledPrincipals = principals.filter((p) => p.status === 'Settled' || p.status === 'Closed');
  const activePrincipalTotal = activePrincipals.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalPrincipalAll = principals.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const getLinkedDues = (principalId) => {
    if (!principalId) return [];
    return duePayments.filter(
      (d) => d.principalId === principalId || (d.principalName && d.principalName.trim() === principalId)
    );
  };
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Principal Amounts & Capital Borrowings</h2>
          <p className="bm-view-sub">
            Track principal loan balances, financier accounts, capital sources, and link them directly with Interest & Due payments
          </p>
        </div>
        <button className="bm-btn-primary cyan" onClick={() => onOpenModal('principal')}>
          <Plus size={16} /> New Principal Account
        </button>
      </div>
      <div className="bm-summary-grid-3">
        <div className="bm-summary-card card-alert-cyan">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Active Principal Capital</span>
            <Landmark size={18} className="text-cyan" />
          </div>
          <div className="bm-summary-val text-cyan">{formatINR(activePrincipalTotal)}</div>
          <span className="bm-summary-sub">{activePrincipals.length} active principal accounts</span>
        </div>
        <div className="bm-summary-card card-alert-indigo">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Total Capital Handled</span>
            <DollarSign size={18} className="text-indigo" />
          </div>
          <div className="bm-summary-val text-indigo">{formatINR(totalPrincipalAll)}</div>
          <span className="bm-summary-sub">{principals.length} total recorded accounts</span>
        </div>
        <div className="bm-summary-card card-alert-emerald">
          <div className="bm-summary-card-head">
            <span className="bm-summary-lbl">Settled / Closed Principals</span>
            <ShieldCheck size={18} className="text-emerald" />
          </div>
          <div className="bm-summary-val text-emerald">
            {formatINR(settledPrincipals.reduce((acc, p) => acc + (Number(p.amount) || 0), 0))}
          </div>
          <span className="bm-summary-sub">{settledPrincipals.length} accounts fully closed</span>
        </div>
      </div>
      <div className="bm-filter-bar">
        <div className="bm-search-box">
          <Search size={16} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by principal name, lender/financier, category, details..."
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
            <option value="Active">Active</option>
            <option value="Settled">Settled</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Categories</option>
            <option value="Bank Loan">Bank Loan</option>
            <option value="Private Financier">Private Financier</option>
            <option value="Equipment Finance">Equipment Finance</option>
            <option value="Partner Capital">Partner Capital</option>
            <option value="Credit Line">Credit Line</option>
            <option value="Vehicle Loan">Vehicle Loan</option>
            <option value="Personal Borrowing">Personal Borrowing</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="bm-table-card">
        <div className="bm-table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Principal Name & Lender</th>
                <th>Category</th>
                <th>Principal Amount (₹)</th>
                <th>Interest Rate</th>
                <th>Start Date & Tenure</th>
                <th>Linked Dues</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const linkedDues = getLinkedDues(p.id);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="bm-cell-primary">{p.name}</div>
                      {p.lenderSource && (
                        <div className="bm-cell-sub">
                          <Building2 size={12} className="bm-inline-icon" />
                          {p.lenderSource}
                        </div>
                      )}
                      {p.description && <div className="bm-cell-sub">{p.description}</div>}
                      {p.notes && <div className="bm-work-notes">{p.notes}</div>}
                    </td>
                    <td>
                      <span className="bm-freq-badge">
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="bm-principal-cell-amount">
                        {formatINR(p.amount)}
                      </span>
                    </td>
                    <td>
                      <div className="bm-date-cell">
                        <Percent size={13} className="text-cyan" />
                        <span>{p.interestRate ? `${p.interestRate}` : '–'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="bm-date-cell">
                        <Calendar size={14} />
                        <span>{p.startDate || 'N/A'}</span>
                      </div>
                      {p.tenure && (
                        <div className="bm-reminder-sub">Tenure: {p.tenure}</div>
                      )}
                    </td>
                    <td>
                      <div className="bm-linked-dues-tag">
                        {linkedDues.length > 0 ? (
                          <span className="bm-badge-linked">
                            {linkedDues.length} Due{linkedDues.length > 1 ? 's' : ''} Linked
                          </span>
                        ) : (
                          <span className="bm-badge-none">No Dues Yet</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`bm-status-pill status-${(p.status || 'active').toLowerCase()}`}>
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="bm-action-btn-group">
                        <button className="bm-icon-btn amber-action" title="Add Due Payment for this Principal" onClick={() => onAddDueForPrincipal && onAddDueForPrincipal(p)}>
                          <PlusCircle size={14} />
                        </button>
                        <button className="bm-icon-btn edit" title="Edit Principal Record" onClick={() => onEdit(p)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="bm-icon-btn delete" title="Delete Record" onClick={() => onDelete(p.id)}>
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
                    <Landmark size={36} className="bm-empty-icon text-cyan" />
                    <h4>No Principal Accounts Found</h4>
                    <p>Click "New Principal Account" to record a loan principal, capital investment, or financier balance.</p>
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