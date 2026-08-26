import { Search, Check, Edit3, AlertCircle, Plus } from 'lucide-react';
export const ITLedgerView = ({
  filteredITBookings = [],
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  quickConfirm,
  openDrawer,
  setIsAddITOpen,
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
              placeholder="Search IT ticket, name, email or service…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ledger-search-input"
            />
          </div>
          <button className="refresh-btn admin-add-booking-btn" onClick={() => setIsAddITOpen(true)}>
            <Plus size={14} /> Log IT Service
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
              {filteredITBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="ledger-ticket">{booking.ticketId}</td>
                  <td>
                    <div className="ledger-customer-name">{booking.name}</div>
                    <div className="ledger-customer-email">{booking.email}</div>
                  </td>
                  <td className="admin-td-font600">{booking.service}</td>
                  <td>{fmtDate(booking.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${(booking.status || 'Pending').toString().toLowerCase().replace(/\s+/g, '_')}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="ledger-actions">
                      {booking.status === 'Pending' && (
                        <button className="btn-confirm" onClick={() => quickConfirm(booking, true)} title="Quick Confirm">
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
  );
};
