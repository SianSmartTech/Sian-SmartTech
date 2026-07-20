import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, ClipboardList, Search, Edit3, X, Mail, TrendingUp, RefreshCw, Send, Check, AlertCircle, BarChart2, LogOut, Menu, Database, Plus, Sun, Moon, ChevronLeft, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { bookingStore } from '../utils/bookingStore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import "../css/AdminDashboard.css";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [otherBookings, setOtherBookings] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOtherBooking, setSelectedOtherBooking] = useState(null);
  const [isOtherDrawerOpen, setIsOtherDrawerOpen] = useState(false);
  const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);
  const [newOtherBooking, setNewOtherBooking] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    issue: '',
    estimatedCost: '₹350+',
    estimatedTurnaround: 'TBD',
    status: 'Pending',
    notes: 'Awaiting admin review.'
  });
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editDelivery, setEditDelivery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [otherBookingToDelete, setOtherBookingToDelete] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    setOtherBookings(bookingStore.getAllOtherBookings());
    setEmailLogs(bookingStore.getEmailLogs());
    setIsSyncing(true);
    try {
      if (bookingStore.isGoogleSheetsConfigured()) {
        const fresh = await bookingStore.fetchBookings();
        setBookings(fresh);
      }
      if (bookingStore.isOtherBookingsConfigured()) {
        const freshOther = await bookingStore.fetchOtherBookings();
        setOtherBookings(freshOther);
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
  const filteredOtherBookings = otherBookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(q)) ||
      (b.issue && b.issue.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const openOtherDrawer = (booking) => {
    setSelectedOtherBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setEditCost(booking.estimatedCost || '');
    setEditDelivery(booking.estimatedTurnaround || '');
    setIsOtherDrawerOpen(true);
  };
  const handleOtherSave = async (e) => {
    e.preventDefault();
    if (!selectedOtherBooking) return;
    const toastId = toast.loading("Updating other booking in Google Sheets...");
    try {
      const updated = await bookingStore.updateOtherBooking(selectedOtherBooking.id, {
        status: editStatus,
        notes: editNotes,
        estimatedCost: editCost,
        estimatedTurnaround: editDelivery
      });
      if (updated) {
        toast.success(`Booking updated successfully!`, { id: toastId });
        setIsOtherDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Update failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync changes with Google Sheets.', { id: toastId });
    }
  };
  const handleOtherDelete = (id) => {
    setOtherBookingToDelete(id);
    setShowDeleteConfirm(true);
  };
  const confirmOtherDelete = async (id) => {
    const toastId = toast.loading("Deleting booking from Google Sheets...");
    try {
      const success = await bookingStore.deleteOtherBooking(id);
      if (success) {
        toast.success("Booking deleted successfully!", { id: toastId });
        setIsOtherDrawerOpen(false);
        refreshData();
      } else {
        toast.error("Failed to delete booking.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking: " + err.message, { id: toastId });
    }
  };
  const handleAddOtherBooking = async (e) => {
    e.preventDefault();
    if (!newOtherBooking.name.trim() || !newOtherBooking.email.trim() || !newOtherBooking.serviceType.trim()) {
      toast.error("Please fill in Name, Email and Service Type!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newOtherBooking.email.trim())) {
      toast.error("Email invalid!");
      return;
    }
    const toastId = toast.loading("Adding new booking to Google Sheets...");
    try {
      const added = await bookingStore.addOtherBooking(newOtherBooking);
      if (added) {
        toast.success("Service booking added successfully!", { id: toastId });
        setIsAddOtherOpen(false);
        setNewOtherBooking({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceType: '',
          issue: '',
          estimatedCost: '₹350+',
          estimatedTurnaround: 'TBD',
          status: 'Pending',
          notes: 'Awaiting admin review.'
        });
        refreshData();
      } else {
        toast.error("Failed to add booking.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to write to Google Sheets: " + err.message, { id: toastId });
    }
  };
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  const totalOtherBookings = otherBookings.length;
  const pendingOtherCount = otherBookings.filter(b => b.status === 'Pending').length;
  const activeOtherCount = otherBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedOtherCount = otherBookings.filter(b => b.status === 'Completed').length;
  const cancelledOtherCount = otherBookings.filter(b => b.status === 'Cancelled').length;
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
      <header className="admin-mobile-header">
        <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Toggle Sidebar">
          <Menu size={22} />
        </button>
        <div className="admin-mobile-brand">
          <div className="admin-sidebar-brand-icon">
            <img src="/favicon.png" alt="Logo" className="admin-brand-logo-img" />
          </div>
          <span className="admin-mobile-title">Admin Panel</span>
        </div>
        <div style={{ width: 22 }} />
      </header>
      {isSidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className="admin-dashboard-container">
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <img src="/favicon.png" alt="Logo" className="admin-brand-logo-img" />
            </div>
            <div className="admin-brand-texts">
              <div className="admin-sidebar-title">Admin Panel</div>
              <div className="admin-sidebar-sub">Sian SmartTech</div>
            </div>
            <button className="admin-sidebar-close" onClick={() => setIsSidebarOpen(false)} aria-label="Close Sidebar">
              <X size={18} />
            </button>
            <button className="admin-sidebar-collapse-btn" onClick={() => setIsSidebarCollapsed(true)} aria-label="Collapse Sidebar">
              <ChevronLeft size={18} />
            </button>
          </div>
          <div>
            <span className="admin-sidebar-section-label">Navigation</span>
            <ul className="admin-menu-list admin-menu-list-margin">
              {[
                { key: 'dashboard', icon: <BarChart2 size={17} />, label: 'Dashboard Overview' },
                { key: 'ledger', icon: <ClipboardList size={17} />, label: 'Website Service Ledger' },
                { key: 'other-bookings', icon: <Database size={17} />, label: 'Other Service Bookings' },
                { key: 'outbox', icon: <Mail size={17} />, label: 'Email Outbox' },
              ].map(({ key, icon, label }) => (
                <li key={key} className="admin-menu-item">
                  <button className={`admin-menu-btn ${activeTab === key ? 'active' : ''}`} onClick={() => { setActiveTab(key); setIsSidebarOpen(false); }}><span className="admin-menu-icon">{icon}</span>{label}</button>
                </li>
              ))}
              <li className="admin-menu-item">
                <button className="admin-menu-btn" onClick={() => { toggleTheme(); setIsSidebarOpen(false); }}>
                  <span className="admin-menu-icon">
                    {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                  </span>
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </li>
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
            <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className="admin-btn-logout">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>
        <main className="admin-main-content">
          <div className="admin-page-header">
            <div className="admin-page-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isSidebarCollapsed && (
                <button className="admin-sidebar-toggle-desktop" onClick={() => setIsSidebarCollapsed(false)} aria-label="Open Sidebar">
                  <Menu size={18} />
                </button>
              )}
              <h1 className="admin-page-title">
                {activeTab === 'dashboard' && 'Operations Dashboard'}
                {activeTab === 'ledger' && 'Website Service Bookings Ledger'}
                {activeTab === 'other-bookings' && 'Other Service Bookings Ledger'}
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
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#11678E', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '4px', height: '16px', background: '#11678E', borderRadius: '2px' }}></span>
                Website Services Ledger
              </h2>
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
                <div className="admin-stat-card card-red">
                  <div className="admin-stat-icon-wrap red"><AlertCircle size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Cancelled</span>
                    <span className="admin-stat-value">{cancelledCount}</span>
                  </div>
                </div>
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#11678E', marginTop: '28px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '4px', height: '16px', background: '#11678E', borderRadius: '2px' }}></span>
                Other Services Ledger
              </h2>
              <div className="admin-stats-grid" style={{ marginBottom: '32px' }}>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><Users size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Booked</span>
                    <span className="admin-stat-value">{totalOtherBookings}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><Clock size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Pending Review</span>
                    <span className="admin-stat-value">{pendingOtherCount}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><TrendingUp size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Active Jobs</span>
                    <span className="admin-stat-value">{activeOtherCount}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-blue">
                  <div className="admin-stat-icon-wrap blue"><CheckCircle2 size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Completed</span>
                    <span className="admin-stat-value">{completedOtherCount}</span>
                  </div>
                </div>
                <div className="admin-stat-card card-red">
                  <div className="admin-stat-icon-wrap red"><AlertCircle size={22} /></div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Cancelled</span>
                    <span className="admin-stat-value">{cancelledOtherCount}</span>
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
          {activeTab === 'other-bookings' && (
            <>
              <div className="ledger-controls">
                <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '520px' }}>
                  <div className="ledger-search-wrapper" style={{ flex: 1 }}>
                    <Search size={16} className="ledger-search-icon" />
                    <input type="text" placeholder="Search name, email, phone, service type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ledger-search-input" />
                  </div>
                  <button className="refresh-btn" style={{ borderColor: '#11678E', color: '#11678E', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }} onClick={() => setIsAddOtherOpen(true)}>
                    <Plus size={14} /> Add Booking
                  </button>
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
                {filteredOtherBookings.length > 0 ? (
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th>Booking Date</th>
                        <th>Customer Details</th>
                        <th>Address</th>
                        <th>Service Type</th>
                        <th>Reported Issue</th>
                        <th>Est. Cost</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOtherBookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{fmtDate(booking.createdAt)}</td>
                          <td>
                            <div className="ledger-customer-name">{booking.name}</div>
                            <div className="ledger-customer-email">{booking.email}</div>
                            <div className="ledger-customer-email" style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>{booking.phone}</div>
                          </td>
                          <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={booking.address}>
                            {booking.address}
                          </td>
                          <td style={{ fontWeight: '600' }}>{booking.serviceType}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={booking.issue}>
                            {booking.issue}
                          </td>
                          <td style={{ fontWeight: '700', color: '#11678E' }}>{booking.estimatedCost}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase().replace(/\s+/g, '_')}`}>{booking.status}</span>
                          </td>
                          <td>
                            <div className="ledger-actions">
                              <button className="btn-manage" onClick={() => openOtherDrawer(booking)}>
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
                    <h3 className="empty-state-title">No service bookings found</h3>
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
      {isOtherDrawerOpen && selectedOtherBooking && (
        <div className="drawer-overlay" onClick={() => setIsOtherDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">Manage Other Booking</div>
                <h3 className="drawer-title">{selectedOtherBooking.name}</h3>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsOtherDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div>
              <span className="drawer-section-label">Client Information</span>
              <div className="drawer-info-block">
                <div className="drawer-info-row"><strong>Name:</strong> {selectedOtherBooking.name}</div>
                <div className="drawer-info-row"><strong>Email:</strong> {selectedOtherBooking.email}</div>
                {selectedOtherBooking.phone && <div className="drawer-info-row"><strong>Phone:</strong> {selectedOtherBooking.phone}</div>}
                <div className="drawer-info-row"><strong>Address:</strong> {selectedOtherBooking.address}</div>
                <div className="drawer-info-row"><strong>Date:</strong> {fmtDate(selectedOtherBooking.createdAt)}</div>
              </div>
            </div>
            <div>
              <span className="drawer-section-label">Service Type & Issue</span>
              <div className="drawer-info-block">
                <div className="drawer-info-row"><strong>Service Type:</strong> {selectedOtherBooking.serviceType}</div>
                <div className="drawer-info-row" style={{ marginTop: '6px' }}><strong>Reported Issue:</strong></div>
                <div className="drawer-issue-block">"{selectedOtherBooking.issue}"</div>
              </div>
            </div>
            <form onSubmit={handleOtherSave} className="drawer-edit-form">
              <span className="drawer-section-label">Diagnostics & Status</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Booking Status</label>
                <select className="drawer-select" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="Pending">Pending Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician Note / Log</label>
                <textarea rows={3} className="drawer-textarea" value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Describe diagnostic result or progress..." />
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
                <button type="submit" className="drawer-save-btn">Save Changes</button>
                <button type="button" className="drawer-delete-btn" onClick={() => handleOtherDelete(selectedOtherBooking.id)}>
                  <Trash2 size={16} /> Delete Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddOtherOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddOtherOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">Add New Service Booking</div>
                <h3 className="drawer-title">Manually Log Booking</h3>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsAddOtherOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddOtherBooking} className="drawer-edit-form" style={{ marginTop: '10px' }}>
              <span className="drawer-section-label">Customer Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Full Name *</label>
                <input type="text" className="drawer-input" value={newOtherBooking.name} onChange={e => setNewOtherBooking({ ...newOtherBooking, name: e.target.value })} placeholder="Customer Full Name" required
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Email Address *</label>
                <input type="email" className="drawer-input" value={newOtherBooking.email} onChange={e => setNewOtherBooking({ ...newOtherBooking, email: e.target.value })} placeholder="e.g. client@example.com" required />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Mobile Number</label>
                <input type="tel" className="drawer-input" value={newOtherBooking.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setNewOtherBooking({ ...newOtherBooking, phone: val }); }} placeholder="e.g. 9876543210" />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Full Address</label>
                <input type="text" className="drawer-input" value={newOtherBooking.address} onChange={e => setNewOtherBooking({ ...newOtherBooking, address: e.target.value })} placeholder="e.g. 12, Main Street, Madurai" />
              </div>
              <span className="drawer-section-label">Service Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Service Type *</label>
                <select className="drawer-select" value={newOtherBooking.serviceType} onChange={e => setNewOtherBooking({ ...newOtherBooking, serviceType: e.target.value })} required>
                  <option value="" disabled>-- Select Service --</option>
                  <option value="Laptop Service">Laptop Service</option>
                  <option value="Computer Repair">Computer Repair</option>
                  <option value="Printer Service">Printer Service</option>
                  <option value="CCTV Installation">CCTV Installation</option>
                  <option value="Drone Service">Drone Service</option>
                  <option value="Chip Level Service">Chip Level Service</option>
                  <option value="Data Backup">Data Backup</option>
                  <option value="Software Setup">Software Setup</option>
                  <option value="Custom Build">Custom Build</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Other Service">Other Service</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Reported Issue / Description</label>
                <textarea rows={2} className="drawer-textarea" value={newOtherBooking.issue} onChange={e => setNewOtherBooking({ ...newOtherBooking, issue: e.target.value })} placeholder="Describe details of the issue or project requirement..." />
              </div>
              <span className="drawer-section-label">Diagnostics & Financials</span>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input type="text" className="drawer-input" value={newOtherBooking.estimatedCost} onChange={e => setNewOtherBooking({ ...newOtherBooking, estimatedCost: e.target.value })} placeholder="e.g. ₹850" />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input type="text" className="drawer-input" value={newOtherBooking.estimatedTurnaround} onChange={e => setNewOtherBooking({ ...newOtherBooking, estimatedTurnaround: e.target.value })} placeholder="e.g. 2 Days" />
                </div>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Status</label>
                <select className="drawer-select" value={newOtherBooking.status} onChange={e => setNewOtherBooking({ ...newOtherBooking, status: e.target.value })}>
                  <option value="Pending">Pending Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician Note</label>
                <textarea rows={2} className="drawer-textarea" value={newOtherBooking.notes} onChange={e => setNewOtherBooking({ ...newOtherBooking, notes: e.target.value })} placeholder="Technician diagnostics or initial comment..." />
              </div>
              <div style={{ marginTop: '15px' }}>
                <button type="submit" className="drawer-save-btn">Log Service Booking</button>
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
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-box" onClick={e => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <AlertCircle size={28} className="delete-confirm-icon" />
              <h3>Confirm Delete</h3>
            </div>
            <p className="delete-confirm-message">
              Are you sure you want to permanently delete this service booking? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button type="button" className="delete-confirm-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button type="button" className="delete-confirm-btn-confirm" onClick={() => {
                setShowDeleteConfirm(false);
                confirmOtherDelete(otherBookingToDelete);
              }}>Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;