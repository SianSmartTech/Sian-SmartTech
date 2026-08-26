import {
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Globe,
  Database,
  Mail
} from 'lucide-react';
export const BookingsOverview = ({
  dashSubTab,
  setDashSubTab,
  bookings = [],
  itBookings = [],
  otherBookings = []
}) => {
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
  const hardwareCategoryCounts = (() => {
    const counts = {};
    bookings.forEach(b => {
      const cat = b.service || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const itCategoryCounts = (() => {
    const counts = {};
    itBookings.forEach(b => {
      const cat = b.service || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const otherCategoryCounts = (() => {
    const counts = {};
    otherBookings.forEach(b => {
      const cat = b.serviceType || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  return (
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
  );
};
