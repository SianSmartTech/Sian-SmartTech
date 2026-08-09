import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, Search, Edit3, X, Mail, TrendingUp, RefreshCw, Send, Check, AlertCircle, BarChart2, LogOut, Menu, Database, Plus, Sun, Moon, ChevronLeft, Trash2, FileText, Wrench, Globe, Laptop } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { bookingStore } from '../utils/bookingStore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InvoiceGenerator from '../components/InvoiceGenerator';
import "../css/AdminDashboard.css";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashSubTab, setDashSubTab] = useState('hardware');
  const [bookings, setBookings] = useState([]);
  const [itBookings, setITBookings] = useState([]);
  const [otherBookings, setOtherBookings] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOtherBooking, setSelectedOtherBooking] = useState(null);
  const [isOtherDrawerOpen, setIsOtherDrawerOpen] = useState(false);
  const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);
  const [isAddITOpen, setIsAddITOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
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
  const [newITBooking, setNewITBooking] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: 'Website Development & Design',
    issue: '',
    estimatedCost: 'Based on Project',
    estimatedDelivery: '1-2 Weeks',
    status: 'Pending',
    notes: 'Awaiting IT consultation.'
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
    setBookings(bookingStore.getAllHardwareBookings());
    setITBookings(bookingStore.getAllITBookings());
    setOtherBookings(bookingStore.getAllOtherBookings());
    setEmailLogs(bookingStore.getEmailLogs());
    setIsSyncing(true);
    try {
      if (bookingStore.isHardwareGoogleSheetsConfigured()) {
        const freshHw = await bookingStore.fetchHardwareBookings();
        setBookings(freshHw);
      }
      if (bookingStore.isITGoogleSheetsConfigured()) {
        const freshIt = await bookingStore.fetchITBookings();
        setITBookings(freshIt);
      }
      if (bookingStore.isOtherBookingsConfigured()) {
        const freshOther = await bookingStore.fetchOtherBookings();
        setOtherBookings(freshOther);
      }
      if (bookingStore.isInvoiceConfigured()) {
        const freshInvoices = await bookingStore.fetchInvoices();
        setInvoices(freshInvoices);
      } else {
        setInvoices([]);
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
    const matchSearch = (b.name || '').toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q) || (b.ticketId || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredITBookings = itBookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (b.name || '').toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q) || (b.ticketId || '').toLowerCase().includes(q) || (b.service || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredOtherBookings = otherBookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (b.name || '').toLowerCase().includes(q) || (b.email || '').toLowerCase().includes(q) || (b.phone || '').toLowerCase().includes(q) || (b.address || '').toLowerCase().includes(q) || (b.serviceType && b.serviceType.toLowerCase().includes(q)) || (b.issue && b.issue.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalHardwareBookings = bookings.length;
  const pendingHardwareCount = bookings.filter(b => b.status === 'Pending').length;
  const activeHardwareCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedHardwareCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledHardwareCount = bookings.filter(b => b.status === 'Cancelled').length;
  const totalITBookings = itBookings.length;
  const pendingITCount = itBookings.filter(b => b.status === 'Pending').length;
  const activeITCount = itBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedITCount = itBookings.filter(b => b.status === 'Completed').length;
  const cancelledITCount = itBookings.filter(b => b.status === 'Cancelled').length;
  const totalOtherBookings = otherBookings.length;
  const pendingOtherCount = otherBookings.filter(b => b.status === 'Pending').length;
  const activeOtherCount = otherBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedOtherCount = otherBookings.filter(b => b.status === 'Completed').length;
  const cancelledOtherCount = otherBookings.filter(b => b.status === 'Cancelled').length;
  const cleanServiceName = (serviceStr, addressStr, defaultName = 'General Service') => {
    if (!serviceStr || typeof serviceStr !== 'string') return defaultName;
    const s = serviceStr.trim();
    const a = (addressStr || '').trim();
    if (!s || (a && s.toLowerCase() === a.toLowerCase())) return defaultName;
    if (/\b(madurai|thoppu|street|nagar|road|625\d{3})\b/i.test(s) || /^\d+\/\d+/.test(s)) {
      return defaultName;
    }
    return s;
  };
  const hardwareCategoryCounts = (() => {
    const counts = {};
    bookings.forEach(b => {
      const name = cleanServiceName(b.service, b.address, 'Hardware Service');
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const itCategoryCounts = (() => {
    const counts = {};
    itBookings.forEach(b => {
      const name = cleanServiceName(b.service || b.serviceType, b.address, 'IT Service');
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const otherCategoryCounts = (() => {
    const counts = {};
    otherBookings.forEach(b => {
      const name = cleanServiceName(b.serviceType || b.service, b.address, 'Other Service');
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const openDrawer = (booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setEditCost(booking.estimatedCost || '');
    setEditDelivery(booking.estimatedDelivery || booking.estimatedTurnaround || '');
    setIsDrawerOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const toastId = toast.loading("Updating booking in Google Sheets...");
    try {
      const isIT = selectedBooking.type === 'IT' || (selectedBooking.id || '').startsWith('it-bk-');
      const updated = isIT
        ? await bookingStore.updateITBooking(selectedBooking.id, { status: editStatus, notes: editNotes, estimatedCost: editCost, estimatedDelivery: editDelivery })
        : await bookingStore.updateBooking(selectedBooking.id, { status: editStatus, notes: editNotes, estimatedCost: editCost, estimatedDelivery: editDelivery });
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
      const isIT = booking.type === 'IT' || (booking.id || '').startsWith('it-bk-');
      const updated = isIT ? await bookingStore.updateITBooking(booking.id, { status: 'Confirmed', notes: 'IT booking confirmed. Assigning consultant.', estimatedDelivery: '1 Week' }) : await bookingStore.updateBooking(booking.id, { status: 'Confirmed', notes: 'Booking confirmed. Scheduling technician.', estimatedDelivery: 'Within 2 days' });
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
  const handleAddITBooking = async (e) => {
    e.preventDefault();
    if (!newITBooking.name.trim() || !newITBooking.email.trim() || !newITBooking.service.trim()) {
      toast.error("Please fill in Name, Email and Service Type!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newITBooking.email.trim())) {
      toast.error("Email invalid!");
      return;
    }
    const toastId = toast.loading("Adding IT Service booking to Google Sheets...");
    try {
      const added = await bookingStore.addITBooking(newITBooking);
      if (added) {
        toast.success("IT Service booking logged successfully!", { id: toastId });
        setIsAddITOpen(false);
        setNewITBooking({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: 'Website Development & Design',
          issue: '',
          estimatedCost: 'Based on Project',
          estimatedDelivery: '1-2 Weeks',
          status: 'Pending',
          notes: 'Awaiting IT consultation.'
        });
        refreshData();
      } else {
        toast.error("Failed to add IT booking.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to write to Google Sheets: " + err.message, { id: toastId });
    }
  };
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
  const [itBookingToDelete, setITBookingToDelete] = useState(null);
  const handleOtherDelete = (id) => {
    setOtherBookingToDelete(id);
    setITBookingToDelete(null);
    setShowDeleteConfirm(true);
  };
  const handleITDelete = (id) => {
    setITBookingToDelete(id);
    setOtherBookingToDelete(null);
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
  const confirmITDelete = async (id) => {
    const toastId = toast.loading("Deleting IT booking from Google Sheets...");
    try {
      const success = await bookingStore.deleteITBooking(id);
      if (success) {
        toast.success("IT Service booking deleted successfully!", { id: toastId });
        setIsDrawerOpen(false);
        refreshData();
      } else {
        toast.error("Failed to delete IT booking.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete IT booking: " + err.message, { id: toastId });
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
        <div className="admin-mobile-spacer" />
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
                { key: 'ledger', icon: <Wrench size={17} />, label: 'Hardware Services Ledger' },
                { key: 'other-bookings', icon: <Database size={17} />, label: 'Other Service Bookings' },
                { key: 'invoices', icon: <FileText size={17} />, label: 'Invoice Generator' },
                { key: 'outbox', icon: <Mail size={17} />, label: 'Email Outbox' },
                { key: 'it-ledger', icon: <Globe size={17} />, label: 'IT Services Ledger' },
              ].map(({ key, icon, label }) => (
                <li key={key} className="admin-menu-item">
                  <button className={`admin-menu-btn ${activeTab === key ? 'active' : ''}`} onClick={() => { setActiveTab(key); setIsSidebarOpen(false); }}>
                    <span className="admin-menu-icon">{icon}</span>{label}
                  </button>
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
            <div className="admin-page-header-left admin-header-left-flex">
              {isSidebarCollapsed && (
                <button className="admin-sidebar-toggle-desktop" onClick={() => setIsSidebarCollapsed(false)} aria-label="Open Sidebar">
                  <Menu size={18} />
                </button>
              )}
              <h1 className="admin-page-title">
                {activeTab === 'dashboard' && 'Operations Dashboard'}
                {activeTab === 'ledger' && 'Hardware Services Bookings Ledger'}
                {activeTab === 'it-ledger' && 'IT Services Bookings Ledger'}
                {activeTab === 'other-bookings' && 'Other Service Bookings Ledger'}
                {activeTab === 'invoices' && 'Invoice Generator & Templates'}
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
              <div className="admin-dash-subtabs">
                <button className={`admin-subtab-btn ${dashSubTab === 'hardware' ? 'active' : ''}`} onClick={() => setDashSubTab('hardware')}>
                  <Wrench size={16} /> Hardware Services
                </button>
                <button className={`admin-subtab-btn ${dashSubTab === 'it' ? 'active' : ''}`} onClick={() => setDashSubTab('it')}>
                  <Globe size={16} /> IT Services
                </button>
                <button className={`admin-subtab-btn ${dashSubTab === 'other' ? 'active' : ''}`} onClick={() => setDashSubTab('other')}>
                  <Database size={16} /> Other Services
                </button>
              </div>
              {dashSubTab === 'hardware' && (
                <>
                  <h2 className="admin-section-heading">
                    <span className="admin-section-pill"></span> Hardware Services Overview
                  </h2>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><Users size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Total Booked</span>
                        <span className="admin-stat-value">{totalHardwareBookings}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><Clock size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Pending</span>
                        <span className="admin-stat-value">{pendingHardwareCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><TrendingUp size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Active Jobs</span>
                        <span className="admin-stat-value">{activeHardwareCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><CheckCircle2 size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Completed</span>
                        <span className="admin-stat-value">{completedHardwareCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-red">
                      <div className="admin-stat-icon-wrap red"><AlertCircle size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Cancelled</span>
                        <span className="admin-stat-value">{cancelledHardwareCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-analytics-section mt-section">
                    <div className="analytics-card">
                      <h3 className="analytics-title">Hardware Bookings by Category</h3>
                      <div className="service-bars-container">
                        {hardwareCategoryCounts.length === 0 ? (
                          <p className="admin-no-data">No data yet.</p>
                        ) : hardwareCategoryCounts.map(([name, count]) => {
                          const pct = totalHardwareBookings > 0 ? (count / totalHardwareBookings) * 100 : 0;
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
                      <h3 className="analytics-title">Attention Required (Hardware)</h3>
                      <div className="alerts-inner">
                        {pendingHardwareCount > 0 ? (
                          <div className="alert-banner">
                            <div className="alert-banner-icon">
                              <AlertCircle size={18} />
                            </div>
                            <div className="alert-banner-body">
                              <h4>Pending Hardware Requests
                                <span className="alert-count-badge">{pendingHardwareCount}</span>
                              </h4>
                              <p>These hardware bookings need diagnostic review and technician assignment.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="alerts-all-clear">
                            <div className="alerts-all-clear-icon">
                              <CheckCircle2 size={26} />
                            </div>
                            <h4>All Clear!</h4>
                            <p>No pending hardware repair requests at this time.</p>
                          </div>
                        )}
                        <div className="alert-tip">
                          <h5>
                            <Mail size={11} />Operational Tip
                          </h5>
                          <p>Confirming a hardware booking generates a ticket ID and emails tracking link to client.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {dashSubTab === 'it' && (
                <>
                  <h2 className="admin-section-heading">
                    <span className="admin-section-pill"></span>IT Services Overview
                  </h2>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><Users size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Total Booked</span>
                        <span className="admin-stat-value">{totalITBookings}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><Clock size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Pending</span>
                        <span className="admin-stat-value">{pendingITCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><TrendingUp size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Active Projects</span>
                        <span className="admin-stat-value">{activeITCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-blue">
                      <div className="admin-stat-icon-wrap blue"><CheckCircle2 size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Delivered Projects</span>
                        <span className="admin-stat-value">{completedITCount}</span>
                      </div>
                    </div>
                    <div className="admin-stat-card card-red">
                      <div className="admin-stat-icon-wrap red"><AlertCircle size={22} /></div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">Cancelled</span>
                        <span className="admin-stat-value">{cancelledITCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-analytics-section mt-section">
                    <div className="analytics-card">
                      <h3 className="analytics-title">IT Bookings by Service Type</h3>
                      <div className="service-bars-container">
                        {itCategoryCounts.length === 0 ? (
                          <p className="admin-no-data">No IT project data yet.</p>
                        ) : itCategoryCounts.map(([name, count]) => {
                          const pct = totalITBookings > 0 ? (count / totalITBookings) * 100 : 0;
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
                      <h3 className="analytics-title">Attention Required (IT Services)</h3>
                      <div className="alerts-inner">
                        {pendingITCount > 0 ? (
                          <div className="alert-banner">
                            <div className="alert-banner-icon">
                              <AlertCircle size={18} />
                            </div>
                            <div className="alert-banner-body">
                              <h4>Pending IT Project Requests
                                <span className="alert-count-badge">{pendingITCount}</span>
                              </h4>
                              <p>These IT development/consulting requests need scope review and confirmation.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="alerts-all-clear">
                            <div className="alerts-all-clear-icon">
                              <CheckCircle2 size={26} />
                            </div>
                            <h4>All Clear!</h4>
                            <p>No pending IT service requests at this time.</p>
                          </div>
                        )}
                        <div className="alert-tip">
                          <h5>
                            <Mail size={11} />Operational Tip
                          </h5>
                          <p>You can manage IT service proposals and dispatch client email receipts directly from the IT Ledger.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {dashSubTab === 'other' && (
                <>
                  <h2 className="admin-section-heading">
                    <span className="admin-section-pill"></span>Other Services Overview
                  </h2>
                  <div className="admin-stats-grid">
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
                  <div className="admin-analytics-section mt-section">
                    <div className="analytics-card">
                      <h3 className="analytics-title">Other Bookings by Service Type</h3>
                      <div className="service-bars-container">
                        {otherCategoryCounts.length === 0 ? (
                          <p className="admin-no-data">No other service booking data yet.</p>
                        ) : otherCategoryCounts.map(([name, count]) => {
                          const pct = totalOtherBookings > 0 ? (count / totalOtherBookings) * 100 : 0;
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
                      <h3 className="analytics-title">Attention Required (Other Services)</h3>
                      <div className="alerts-inner">
                        {pendingOtherCount > 0 ? (
                          <div className="alert-banner">
                            <div className="alert-banner-icon">
                              <AlertCircle size={18} />
                            </div>
                            <div className="alert-banner-body">
                              <h4>Pending Other Requests
                                <span className="alert-count-badge">{pendingOtherCount}</span>
                              </h4>
                              <p>These service requests need diagnostic review and technician assignment.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="alerts-all-clear">
                            <div className="alerts-all-clear-icon">
                              <CheckCircle2 size={26} />
                            </div>
                            <h4>All Clear!</h4>
                            <p>No pending service requests at this time.</p>
                          </div>
                        )}
                        <div className="alert-tip">
                          <h5>
                            <Mail size={11} />Operational Tip
                          </h5>
                          <p>You can manage and update status of other bookings directly in the Other Service Bookings tab.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === 'ledger' && (
            <>
              <div className="ledger-controls">
                <div className="ledger-search-wrapper">
                  <Search size={16} className="ledger-search-icon" />
                  <input type="text" placeholder="Search hardware ticket, name, or email…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ledger-search-input" />
                </div>
                <div className="ledger-filters">
                  {['ALL', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                    <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>{s === 'ALL' ? 'All' : s}</button>
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
                        <th>Hardware Service</th>
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
                            <span className={`status-badge ${(booking.status || 'Pending').toString().toLowerCase().replace(/\s+/g, '_')}`}>{booking.status}</span>
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
                    <h3 className="empty-state-title">No hardware bookings found</h3>
                    <p>Try adjusting your search or filter.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'it-ledger' && (
            <>
              <div className="ledger-controls">
                <div className="admin-search-btn-group">
                  <div className="ledger-search-wrapper admin-search-wrapper-flex">
                    <Search size={16} className="ledger-search-icon" />
                    <input type="text" placeholder="Search IT ticket, name, email or service…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ledger-search-input" />
                  </div>
                  <button className="refresh-btn admin-add-booking-btn" onClick={() => setIsAddITOpen(true)}>
                    <Plus size={14} /> Log IT Service
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
                {filteredITBookings.length > 0 ? (
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer Details</th>
                        <th>IT Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredITBookings.map(booking => (
                        <tr key={booking.id}>
                          <td className="ledger-ticket">{booking.ticketId}</td>
                          <td>
                            <div className="ledger-customer-name">{booking.name}</div>
                            <div className="ledger-customer-email">{booking.email}</div>
                          </td>
                          <td className="admin-td-font600">{booking.service}</td>
                          <td>{fmtDate(booking.createdAt)}</td>
                          <td>
                            <span className={`status-badge ${(booking.status || 'Pending').toString().toLowerCase().replace(/\s+/g, '_')}`}>{booking.status}</span>
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
                    <h3 className="empty-state-title">No IT service bookings found</h3>
                    <p>Try adjusting your search or filter.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'other-bookings' && (
            <>
              <div className="ledger-controls">
                <div className="admin-search-btn-group">
                  <div className="ledger-search-wrapper admin-search-wrapper-flex">
                    <Search size={16} className="ledger-search-icon" />
                    <input type="text" placeholder="Search name, email, phone, service type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ledger-search-input" />
                  </div>
                  <button className="refresh-btn admin-add-booking-btn" onClick={() => setIsAddOtherOpen(true)}>
                    <Plus size={14} /> Add Booking
                  </button>
                </div>
                <div className="ledger-filters">
                  {['ALL', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                    <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>{s === 'ALL' ? 'All' : s}</button>
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
                            <div className="ledger-customer-email admin-customer-phone">{booking.phone}</div>
                          </td>
                          <td className="admin-td-address" title={booking.address}>
                            {booking.address}
                          </td>
                          <td className="admin-td-font600">{booking.serviceType}</td>
                          <td className="admin-td-issue" title={booking.issue}>
                            {booking.issue}
                          </td>
                          <td className="admin-td-cost">{booking.estimatedCost}</td>
                          <td>
                            <span className={`status-badge ${(booking.status || 'Pending').toString().toLowerCase().replace(/\s+/g, '_')}`}>{booking.status}</span>
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
          {activeTab === 'invoices' && (
            <InvoiceGenerator
              invoices={invoices}
              setInvoices={setInvoices}
              bookings={[...bookings, ...itBookings]}
              otherBookings={otherBookings}
              isSyncing={isSyncing}
              setIsSyncing={setIsSyncing}
            />
          )}
        </main>
      </div>
      {isDrawerOpen && selectedBooking && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">Manage {selectedBooking.type === 'IT' ? 'IT Service' : 'Hardware'} Booking</div>
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
                {selectedBooking.address && <div className="drawer-info-row"><strong>Address:</strong> {selectedBooking.address}</div>}
                <div className="drawer-info-row"><strong>Service:</strong> {selectedBooking.service}</div>
                <div className="drawer-info-row"><strong>Date:</strong> {fmtDate(selectedBooking.createdAt)}</div>
              </div>
            </div>
            <div>
              <span className="drawer-section-label">Reported Issue / Scope</span>
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
                <label className="drawer-label">Technician / Consultant Note</label>
                <textarea rows={3} className="drawer-textarea" value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Describe diagnostic result or progress..." />
              </div>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input type="text" className="drawer-input" value={editCost} onChange={e => setEditCost(e.target.value)} placeholder="e.g. ₹850 or Quote" />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input type="text" className="drawer-input" value={editDelivery} onChange={e => setEditDelivery(e.target.value)} placeholder="e.g. 2 Days / 1 Week" />
                </div>
              </div>
              <div>
                <button type="submit" className="drawer-save-btn">Save & Dispatch Status Alert</button>
                {(selectedBooking.type === 'IT' || (selectedBooking.id || '').startsWith('it-bk-')) && (
                  <button type="button" className="drawer-delete-btn" onClick={() => handleITDelete(selectedBooking.id)}>
                    <Trash2 size={16} /> Delete IT Booking
                  </button>
                )}
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
                <div className="drawer-info-row admin-drawer-row-mt"><strong>Reported Issue:</strong></div>
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
      {isAddITOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddITOpen(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">Add New IT Service Booking</div>
                <h3 className="drawer-title">Log IT Project</h3>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsAddITOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddITBooking} className="drawer-edit-form admin-drawer-form-mt">
              <span className="drawer-section-label">Client Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Full Name *</label>
                <input type="text" className="drawer-input" value={newITBooking.name} onChange={e => setNewITBooking({ ...newITBooking, name: e.target.value })} placeholder="Client Name" required />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Email Address *</label>
                <input type="email" className="drawer-input" value={newITBooking.email} onChange={e => setNewITBooking({ ...newITBooking, email: e.target.value })} placeholder="e.g. client@domain.com" required />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Mobile Number</label>
                <input type="tel" className="drawer-input" value={newITBooking.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setNewITBooking({ ...newITBooking, phone: val }); }} placeholder="e.g. 9876543210" />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Company / Address</label>
                <input type="text" className="drawer-input" value={newITBooking.address} onChange={e => setNewITBooking({ ...newITBooking, address: e.target.value })} placeholder="e.g. Madurai" />
              </div>
              <span className="drawer-section-label">IT Service Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">IT Service *</label>
                <select className="drawer-select" value={newITBooking.service} onChange={e => setNewITBooking({ ...newITBooking, service: e.target.value })} required>
                  <option value="Website Development & Design">Website Development & Design</option>
                  <option value="Freelancing IT Services">Freelancing IT Services</option>
                  <option value="Custom Web Application">Custom Web Application</option>
                  <option value="Database & Cloud Setup">Database & Cloud Setup</option>
                  <option value="SEO & Speed Optimization">SEO & Speed Optimization</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Project Requirement / Description</label>
                <textarea rows={2} className="drawer-textarea" value={newITBooking.issue} onChange={e => setNewITBooking({ ...newITBooking, issue: e.target.value })} placeholder="Project scope details..." />
              </div>
              <span className="drawer-section-label">Project Details</span>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input type="text" className="drawer-input" value={newITBooking.estimatedCost} onChange={e => setNewITBooking({ ...newITBooking, estimatedCost: e.target.value })} placeholder="e.g. ₹8,999" />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Delivery</label>
                  <input type="text" className="drawer-input" value={newITBooking.estimatedDelivery} onChange={e => setNewITBooking({ ...newITBooking, estimatedDelivery: e.target.value })} placeholder="e.g. 2 Weeks" />
                </div>
              </div>
              <div className="admin-drawer-submit-wrapper">
                <button type="submit" className="drawer-save-btn">Log IT Service Booking</button>
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
            <form onSubmit={handleAddOtherBooking} className="drawer-edit-form admin-drawer-form-mt">
              <span className="drawer-section-label">Customer Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Full Name *</label>
                <input type="text" className="drawer-input" value={newOtherBooking.name} onChange={e => setNewOtherBooking({ ...newOtherBooking, name: e.target.value })} placeholder="Customer Full Name" required />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Email Address *</label>
                <input type="email" className="drawer-input" value={newOtherBooking.email} onChange={e => setNewOtherBooking({ ...newOtherBooking, email: e.target.value })} placeholder="e.g. client@domain.com" required />
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
              <div className="admin-drawer-submit-wrapper">
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
                if (itBookingToDelete) {
                  confirmITDelete(itBookingToDelete);
                } else if (otherBookingToDelete) {
                  confirmOtherDelete(otherBookingToDelete);
                }
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