import { Search, Edit3, AlertCircle, Plus } from 'lucide-react';
export const OtherLedgerView = ({
  filteredOtherBookings = [],
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  openOtherDrawer,
  setIsAddOtherOpen,
  fmtDate
}) => {
  return (
    <>
      <div className="ledger-controls">
        <div className="admin-search-btn-group">
          <div className="ledger-search-wrapper admin-search-wrapper-flex">
            <Search size={16} className="ledger-search-icon" />
            <input
              type="text"
              placeholder="Search name, email, phone, service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ledger-search-input"
            />
          </div>
          <button className="refresh-btn admin-add-booking-btn" onClick={() => setIsAddOtherOpen(true)}>
            <Plus size={14} /> Add Booking
          </button>
        </div>
        <div className="ledger-filters">
          {['ALL', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
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
              {filteredOtherBookings.map((booking) => (
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
                    <span className={`status-badge ${(booking.status || 'Pending').toString().toLowerCase().replace(/\s+/g, '_')}`}>
                      {booking.status}
                    </span>
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
  );
};
