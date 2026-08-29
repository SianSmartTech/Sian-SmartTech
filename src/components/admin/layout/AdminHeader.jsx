import { Menu, RefreshCw } from 'lucide-react';
export const AdminHeader = ({
  activeTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsSidebarOpen,
  refreshData,
  isSyncing
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'bm-dashboard':
        return 'Business Management Overview';
      case 'bm-schedule':
        return 'Work Schedule & Task Planning';
      case 'bm-income':
        return 'Income & Sales Ledger';
      case 'bm-expenses':
        return 'Operating Expenses & Overheads';
      case 'bm-principals':
        return 'Principal Amounts & Capital Borrowings';
      case 'bm-due-payments':
        return 'Interest, Loan EMIs & Due Payments';
      case 'bm-analysis':
        return 'Business Analytics & Profit Intelligence';
      case 'invoices':
        return 'Invoice & Challan Generator';
      case 'dashboard':
        return 'Client Operations Dashboard';
      case 'ledger':
        return 'Hardware Services Bookings Ledger';
      case 'it-ledger':
        return 'IT Services Bookings Ledger';
      case 'other-bookings':
        return 'Other Service Bookings Ledger';
      case 'outbox':
        return 'Simulated Email Outbox & Logs';
      default:
        return 'Admin Dashboard';
    }
  };
  const isBusinessCategory = [
    'bm-dashboard',
    'bm-schedule',
    'bm-income',
    'bm-expenses',
    'bm-principals',
    'bm-due-payments',
    'bm-analysis',
    'invoices'
  ].includes(activeTab);
  return (
    <>
      <header className="admin-mobile-header">
        <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Toggle Sidebar">
          <Menu size={22} />
        </button>
        <div className="admin-mobile-brand">
          <div className="admin-sidebar-brand-icon">
            <img src="/favicon.png" alt="Logo" className="admin-brand-logo-img" width="32" height="32" />
          </div>
          <span className="admin-mobile-title">Admin Panel</span>
        </div>
        <div className="admin-mobile-spacer" />
      </header>
      <div className="admin-page-header">
        <div className="admin-page-header-left admin-header-left-flex">
          {isSidebarCollapsed && (
            <button className="admin-sidebar-toggle-desktop" onClick={() => setIsSidebarCollapsed(false)} aria-label="Open Sidebar">
              <Menu size={18} />
            </button>
          )}
          <div className="admin-header-title-col">
            <div className="admin-header-category-crumb">
              {isBusinessCategory ? 'Business Management' : 'Client Booking Services'}
            </div>
            <h1 className="admin-page-title">{getTabTitle()}</h1>
          </div>
        </div>
        <div className="admin-header-actions">
          <button className="refresh-btn" onClick={refreshData} disabled={isSyncing} title="Synchronize data with Google Sheets">
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>
    </>
  );
};