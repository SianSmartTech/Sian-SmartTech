import { useState, useEffect } from 'react';
import { Briefcase, LayoutDashboard, CalendarCheck, TrendingUp, Receipt, ClockAlert, LineChart, FileText, Users, Wrench, Globe, Database, Mail, ChevronDown, ChevronRight, ChevronLeft, X, Sun, Moon, LogOut, Layers } from 'lucide-react';
export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  user,
  handleLogout,
  theme,
  toggleTheme,
  pendingSchedulesCount = 0,
  dueAlertCount = 0,
  pendingHardwareCount = 0,
  pendingITCount = 0,
  pendingOtherCount = 0
}) => {
  const isBusinessTab = [
    'bm-dashboard',
    'bm-schedule',
    'bm-income',
    'bm-expenses',
    'bm-due-payments',
    'bm-analysis',
    'invoices'
  ].includes(activeTab);
  const isClientBookingTab = [
    'dashboard',
    'ledger',
    'it-ledger',
    'other-bookings',
    'outbox'
  ].includes(activeTab);
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);
  const [isBookingsOpen, setIsBookingsOpen] = useState(true);
  useEffect(() => {
    if (isBusinessTab) {
      setIsBusinessOpen(true);
    } else if (isClientBookingTab) {
      setIsBookingsOpen(true);
    }
  }, [activeTab]);
  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
    setIsSidebarOpen(false);
  };
  const businessNavItems = [
    { key: 'bm-dashboard', label: 'Business Overview', icon: <LayoutDashboard size={16} /> },
    {
      key: 'bm-schedule',
      label: 'Work Schedule',
      icon: <CalendarCheck size={16} />,
      badge: pendingSchedulesCount > 0 ? pendingSchedulesCount : null,
      badgeType: 'amber'
    },
    { key: 'bm-income', label: 'Income & Sales', icon: <TrendingUp size={16} /> },
    { key: 'bm-expenses', label: 'Expenses', icon: <Receipt size={16} /> },
    {
      key: 'bm-due-payments',
      label: 'Interest & Due',
      icon: <ClockAlert size={16} />,
      badge: dueAlertCount > 0 ? dueAlertCount : null,
      badgeType: 'rose'
    },
    { key: 'bm-analysis', label: 'Business Analysis', icon: <LineChart size={16} /> },
    { key: 'invoices', label: 'Invoice Generator', icon: <FileText size={16} /> }
  ];
  const bookingNavItems = [
    { key: 'dashboard', label: 'Operations Overview', icon: <Users size={16} /> },
    {
      key: 'ledger',
      label: 'Hardware Ledger',
      icon: <Wrench size={16} />,
      badge: pendingHardwareCount > 0 ? pendingHardwareCount : null,
      badgeType: 'blue'
    },
    {
      key: 'it-ledger',
      label: 'IT Services Ledger',
      icon: <Globe size={16} />,
      badge: pendingITCount > 0 ? pendingITCount : null,
      badgeType: 'indigo'
    },
    {
      key: 'other-bookings',
      label: 'Other Bookings',
      icon: <Database size={16} />,
      badge: pendingOtherCount > 0 ? pendingOtherCount : null,
      badgeType: 'amber'
    },
    { key: 'outbox', label: 'Email Outbox', icon: <Mail size={16} /> }
  ];
  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-icon">
          <img src="/favicon.png" alt="Logo" className="admin-brand-logo-img" width="32" height="32" />
        </div>
        <div className="admin-brand-texts">
          <div className="admin-sidebar-title">Admin Hub</div>
          <div className="admin-sidebar-sub">Sian SmartTech</div>
        </div>
        <button
          type="button"
          className="admin-brand-theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <button
          className="admin-sidebar-close"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>
        <button
          className="admin-sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed(true)}
          aria-label="Collapse Sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      <div className="admin-sidebar-nav-container">
        <div className="admin-sidebar-group">
          <button
            type="button"
            className={`admin-group-header ${isBusinessTab ? 'group-active' : ''}`}
            onClick={() => setIsBusinessOpen(!isBusinessOpen)}
          >
            <div className="admin-group-header-left">
              <span className="admin-group-icon bg-indigo-soft">
                <Briefcase size={16} />
              </span>
              <span className="admin-group-title">Business Management</span>
            </div>
            <div className="admin-group-header-right">
              {(pendingSchedulesCount > 0 || dueAlertCount > 0) && (
                <span className="admin-group-alert-dot"></span>
              )}
              {isBusinessOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          </button>
          {isBusinessOpen && (
            <ul className="admin-sub-menu-list">
              {businessNavItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <li key={item.key} className="admin-menu-item">
                    <button
                      className={`admin-menu-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectTab(item.key)}
                    >
                      <span className="admin-menu-icon">{item.icon}</span>
                      <span className="admin-menu-text">{item.label}</span>
                      {item.badge && (
                        <span className={`admin-menu-badge badge-${item.badgeType}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="admin-sidebar-group">
          <button
            type="button"
            className={`admin-group-header ${isClientBookingTab ? 'group-active' : ''}`}
            onClick={() => setIsBookingsOpen(!isBookingsOpen)}
          >
            <div className="admin-group-header-left">
              <span className="admin-group-icon bg-blue-soft">
                <Layers size={16} />
              </span>
              <span className="admin-group-title">Client Booking Services</span>
            </div>
            <div className="admin-group-header-right">
              {(pendingHardwareCount > 0 || pendingITCount > 0 || pendingOtherCount > 0) && (
                <span className="admin-group-alert-dot"></span>
              )}
              {isBookingsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          </button>
          {isBookingsOpen && (
            <ul className="admin-sub-menu-list">
              {bookingNavItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <li key={item.key} className="admin-menu-item">
                    <button
                      className={`admin-menu-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectTab(item.key)}
                    >
                      <span className="admin-menu-icon">{item.icon}</span>
                      <span className="admin-menu-text">{item.label}</span>
                      {item.badge && (
                        <span className={`admin-menu-badge badge-${item.badgeType}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="admin-sidebar-profile admin-sidebar-profile-custom">
        <div className="admin-profile-container">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="admin-profile-avatar-img" width="36" height="36" />
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
        <button
          onClick={() => {
            handleLogout();
            setIsSidebarOpen(false);
          }}
          className="admin-btn-logout"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};