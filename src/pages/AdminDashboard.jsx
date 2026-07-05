import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, ClipboardList, Search, Edit3, X, Mail, TrendingUp, RefreshCw, Send, Check, AlertCircle, ShieldCheck, BarChart2, LogOut } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { bookingStore } from '../utils/bookingStore';
import { useAuth } from '../context/AuthContext';
import "../css/AdminDashboard.css";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editDelivery, setEditDelivery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
    } catch (err) {
      toast.error("Failed to log out: " + err.message);
    }
  };
  const refreshData = async () => {
    setBookings(bookingStore.getAllBookings());
    setEmailLogs(bookingStore.getEmailLogs());
    setIsSyncing(true);
    try {
      if (bookingStore.isGoogleSheetsConfigured()) {
        const fresh = await bookingStore.fetchBookings();
        setBookings(fresh);
      }
      const freshLogs = await bookingStore.fetchEmailLogs();
      setEmailLogs(freshLogs);
    } catch (err) {
      console.error("Failed to sync with Google Sheets:", err);
    } finally {
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    refreshData();
  }, []);
  const filteredBookings = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.ticketId.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const categoryCounts = (() => {
    const counts = {};
    bookings.forEach(b => { counts[b.service] = (counts[b.service] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const openDrawer = (booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setEditCost(booking.estimatedCost || '');
    setEditDelivery(booking.estimatedDelivery || '');
    setIsDrawerOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const toastId = toast.loading("Updating booking in Google Sheets...");
    try {
      const updated = await bookingStore.updateBooking(selectedBooking.id, { status: editStatus, notes: editNotes, estimatedCost: editCost, estimatedDelivery: editDelivery });
      if (updated) {
        toast.success(`Booking ${updated.ticketId} updated!`, { id: toastId });
        if (editStatus !== selectedBooking.status) {
          toast.info(`Email dispatched to ${updated.email}`);
        }
        setIsDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Update failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync changes with Google Sheets.', { id: toastId });
    }
  };
  const quickConfirm = async (booking) => {
    const toastId = toast.loading("Confirming booking in Google Sheets...");
    try {
      const updated = await bookingStore.updateBooking(booking.id, { status: 'Confirmed', notes: 'Booking confirmed. Scheduling technician.', estimatedDelivery: 'Within 2 days', });
      if (updated) {
        toast.success(`${updated.ticketId} Confirmed!`, { id: toastId });
        toast.info(`Email dispatched to ${updated.email}`);
        refreshData();
      } else {
        toast.error('Confirmation failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to communicate with Google Sheets.', { id: toastId });
    }
  };
  const fmtDate = (iso) => {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  return (
    <div className="admin-root">
      <Toaster position="top-right" richColors />
      <div className="admin-dashboard-container">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="admin-sidebar-title">Admin Panel</div>
              <div className="admin-sidebar-sub">Sian SmartTech</div>
            </div>
          </div>
          <div>
            <span className="admin-sidebar-section-label">Navigation</span>
            <ul className="admin-menu-list admin-menu-list-margin">
              {[
                { key: 'dashboard', icon: <BarChart2 size={17} />, label: 'Dashboard Overview' },
                { key: 'ledger', icon: <ClipboardList size={17} />, label: 'Service Ledger' },
                { key: 'outbox', icon: <Mail size={17} />, label: 'Email Outbox' },
              ].map(({ key, icon, label }) => (
                <li key={key} className="admin-menu-item">
                  <button className={`admin-menu-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}><span className="admin-menu-icon">{icon}</span>{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="admin-sidebar-profile admin-sidebar-profile-custom">
            <div className="admin-profile-container">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="admin-profile-avatar-img" />
              ) : (
                <div className="admin-profile-fallback-box">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <div className="admin-profile-info-col">
                <div className="admin-profile-name-text">
                  {user?.displayName || 'Administrator'}
                </div>
                <div className="admin-profile-email-text">{user?.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="admin-btn-logout">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>
        <main className="admin-main-content">
          <div className="admin-page-header">
            <div className="admin-page-header-left">
              <span>Console</span>
              <h1 className="admin-page-title">
                {activeTab === 'dashboard' && 'Operations Dashboard'}
                {activeTab === 'ledger' && 'Service Bookings Ledger'}
                {activeTab === 'outbox' && 'Simulated Email Outbox'}
              </h1>
            </div>
            <button className="refresh-btn" onClick={refreshData} disabled={isSyncing}>
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Refresh"}
            </button>
          </div>
          {activeTab === 'dashboard' && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><Users size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Booked</span>
                    <span className="admin-stat-value">{totalBookings}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><Clock size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Pending</span>
                    <span className="admin-stat-value">{pendingCount}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><TrendingUp size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Active Jobs</span>
                    <span className="admin-stat-value">{activeCount}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><CheckCircle2 size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Completed</span>
                    <span className="admin-stat-value">{completedCount}</span>
                  </div>
                </div>
              </div>
              <div className="admin-analytics-section">
                <div className="analytics-card">
                  <h3 className="analytics-title">Bookings by Service Type</h3>
                  <div className="service-bars-container">
                    {categoryCounts.length === 0 ? (
                      <p className="admin-no-data">No data yet.</p>
                    ) : categoryCounts.map(([name, count]) => {
                      const pct = totalBookings > 0 ? (count / totalBookings) * 100 : 0;
                      return (
                        <div key={name} className="service-bar-row">
                          <div className="service-bar-info">
                            <span className="service-bar-name">{name}</span>
                            <span className="service-bar-count">{count} ({Math.round(pct)}%)</span>
                          </div>
                          <div className="service-bar-bg">
                            <div className="service-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="analytics-card">
                  <h3 className="analytics-title">Attention Required</h3>
                  <div className="alerts-inner">
                    {pendingCount > 0 ? (
                      <div className="alert-banner">
                        <div className="alert-banner-icon">
                          <AlertCircle size={18} />
                        </div>
                        <div className="alert-banner-body">
                          <h4>Pending Requests
                            <span className="alert-count-badge">{pendingCount}</span>
                          </h4>
                          <p>These bookings need diagnostic review and ticket activation before work can begin.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="alerts-all-clear">
                        <div className="alerts-all-clear-icon">
                          <CheckCircle2 size={26} />
                        </div>
                        <h4>All clear!</h4>
                        <p>No pending confirmations at this time.</p>
                      </div>
                    )}

                    <div className="alert-tip">
                      <h5>
                        <Mail size={11} />Operational Tip
                      </h5>
                      <p>Confirming a booking generates a service ticket and sends a live tracking URL directly to the client's email.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 'ledger' && (
            <>
              <div className="ledger-controls">
                <div className="ledger-search-wrapper">
                  <Search size={16} className="ledger-search-icon" />
                  <input type="text" placeholder="Search name, email or Ticket ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ledger-search-input" />
                </div>
                <div className="ledger-filters">
                  {['ALL', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                    <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
                      {s === 'ALL' ? 'All' : s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ledger-table-container">
                {filteredBookings.length > 0 ? (
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(booking => (
                        <tr key={booking.id}>
                          <td className="ledger-ticket">{booking.ticketId}</td>
                          <td>
                            <div className="ledger-customer-name">{booking.name}</div>
                            <div className="ledger-customer-email">{booking.email}</div>
                          </td>
                          <td>{booking.service}</td>
                          <td>{fmtDate(booking.createdAt)}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase().replace(/\s+/g, '_')}`}>{booking.status}</span>
                          </td>
                          <td>
                            <div className="ledger-actions">
                              {booking.status === 'Pending' && (
                                <button className="btn-confirm" onClick={() => quickConfirm(booking)} title="Quick Confirm">
                                  <Check size={13} /> Confirm
                                </button>
                              )}
                              <button className="btn-manage" onClick={() => openDrawer(booking)}>
                                <Edit3 size={13} /> Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <AlertCircle size={40} className="empty-state-icon admin-empty-state-icon" />
                    <h3 className="empty-state-title">No bookings found</h3>
                    <p>Try adjusting your search or filter.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'outbox' && (
            <>
              <p className="outbox-desc">Below are automated email receipts sent to clients when a booking is confirmed or its status changes. Click any row to preview the HTML email template.</p>
              <div className="outbox-list">
                {emailLogs.length > 0 ? emailLogs.map(log => (
                  <div key={log.id} className="outbox-item" onClick={() => setSelectedEmail(log)}>
                    <div className="outbox-item-left">
                      <div className="outbox-recipient">{log.recipient}</div>
                      <div className="outbox-subject">{log.subject}</div>
                      <div className="outbox-ticket">Ticket: {log.ticketId}</div>
                    </div>
                    <div className="outbox-item-right">
                      <div className="outbox-date">{fmtDate(log.sentAt)}</div>
                      <div className="outbox-sent-tag">
                        <Send size={11} /> Delivered
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state admin-empty-state">
                    <Mail size={40} className="empty-state-icon admin-empty-state-icon" />
                    <h3 className="empty-state-title">No emails yet</h3>
                    <p>Confirm pending bookings to generate email receipts.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
      {isDrawerOpen && selectedBooking && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">Manage Booking</div>
                <h3 className="drawer-title">{selectedBooking.ticketId}</h3>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div>
              <span className="drawer-section-label">Client Information</span>
              <div className="drawer-info-block">
                <div className="drawer-info-row"><strong>Name:</strong> {selectedBooking.name}</div>
                <div className="drawer-info-row"><strong>Email:</strong> {selectedBooking.email}</div>
                {selectedBooking.phone && <div className="drawer-info-row"><strong>Phone:</strong> {selectedBooking.phone}</div>}
                <div className="drawer-info-row"><strong>Address:</strong> {selectedBooking.address}</div>
                <div className="drawer-info-row"><strong>Date:</strong> {fmtDate(selectedBooking.createdAt)}</div>
              </div>
            </div>
            <div>
              <span className="drawer-section-label">Reported Issue</span>
              <div className="drawer-issue-block">"{selectedBooking.issue}"</div>
            </div>
            <form onSubmit={handleSave} className="drawer-edit-form">
              <span className="drawer-section-label">Diagnostics & Status</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Ticket Status</label>
                <select className="drawer-select" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="Pending">Pending Approval</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed & Ready</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician Note / Log</label>
                <textarea rows={3} className="drawer-textarea" value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Describe diagnostic result or repair stage..." />
              </div>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input type="text" className="drawer-input" value={editCost} onChange={e => setEditCost(e.target.value)} placeholder="e.g. ₹850" />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input type="text" className="drawer-input" value={editDelivery} onChange={e => setEditDelivery(e.target.value)} placeholder="e.g. 2 Days" />
                </div>
              </div>
              <div>
                <button type="submit" className="drawer-save-btn">Save & Dispatch Status Alert</button>
                {selectedBooking.status === 'Pending' && editStatus === 'Pending' && (
                  <button type="button" className="drawer-approve-btn" onClick={() => {
                    setEditStatus('Confirmed');
                    setEditNotes('Booking confirmed. Scheduled for service.');
                    setEditDelivery('Within 24 hours');
                    toast.info('Click "Save" to activate ticket and notify client.');
                  }}>
                    <Check size={16} />Approve Request
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedEmail && (
        <div className="mail-modal-overlay" onClick={() => setSelectedEmail(null)}>
          <div className="mail-modal-box" onClick={e => e.stopPropagation()}>
            <div className="mail-modal-header">
              <h3>{selectedEmail.subject}</h3>
              <button className="mail-modal-close" onClick={() => setSelectedEmail(null)}>
                <X size={15} />
              </button>
            </div>
            <div className="mail-modal-meta">
              <div><strong>To:</strong> {selectedEmail.recipient}</div>
              <div><strong>Sent:</strong> {fmtDate(selectedEmail.sentAt)}</div>
            </div>
            <div className="mail-modal-body">
              <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;