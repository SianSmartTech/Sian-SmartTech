import { X, Trash2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
export const BookingDrawers = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedBooking,
  editStatus,
  setEditStatus,
  editNotes,
  setEditNotes,
  editCost,
  setEditCost,
  editDelivery,
  setEditDelivery,
  handleSave,
  handleITDelete,
  isOtherDrawerOpen,
  setIsOtherDrawerOpen,
  selectedOtherBooking,
  handleOtherSave,
  handleOtherDelete,
  isAddITOpen,
  setIsAddITOpen,
  newITBooking,
  setNewITBooking,
  handleAddITBooking,
  isAddOtherOpen,
  setIsAddOtherOpen,
  newOtherBooking,
  setNewOtherBooking,
  handleAddOtherBooking,
  selectedEmail,
  setSelectedEmail,
  showDeleteConfirm,
  setShowDeleteConfirm,
  itBookingToDelete,
  otherBookingToDelete,
  confirmITDelete,
  confirmOtherDelete,
  fmtDate
}) => {
  return (
    <>
      {isDrawerOpen && selectedBooking && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title-sub">
                  Manage {selectedBooking.type === 'IT' ? 'IT Service' : 'Hardware'} Booking
                </div>
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
                <select className="drawer-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Pending">Pending Approval</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed & Ready</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician / Consultant Note</label>
                <textarea
                  rows={3}
                  className="drawer-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Describe diagnostic result or progress..."
                />
              </div>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    placeholder="e.g. ₹850 or Quote"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={editDelivery}
                    onChange={(e) => setEditDelivery(e.target.value)}
                    placeholder="e.g. 2 Days / 1 Week"
                  />
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
                  <button
                    type="button"
                    className="drawer-approve-btn"
                    onClick={() => {
                      setEditStatus('Confirmed');
                      setEditNotes('Booking confirmed. Scheduled for service.');
                      setEditDelivery('Within 24 hours');
                      toast.info('Click "Save" to activate ticket and notify client.');
                    }}
                  >
                    <Check size={16} /> Approve Request
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {isOtherDrawerOpen && selectedOtherBooking && (
        <div className="drawer-overlay" onClick={() => setIsOtherDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
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
                <select className="drawer-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Pending">Pending Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician Note / Log</label>
                <textarea
                  rows={3}
                  className="drawer-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Describe diagnostic result or progress..."
                />
              </div>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    placeholder="e.g. ₹850"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={editDelivery}
                    onChange={(e) => setEditDelivery(e.target.value)}
                    placeholder="e.g. 2 Days"
                  />
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
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
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
                <input
                  type="text"
                  className="drawer-input"
                  value={newITBooking.name}
                  onChange={(e) => setNewITBooking({ ...newITBooking, name: e.target.value })}
                  placeholder="Client Name"
                  required
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Email Address *</label>
                <input
                  type="email"
                  className="drawer-input"
                  value={newITBooking.email}
                  onChange={(e) => setNewITBooking({ ...newITBooking, email: e.target.value })}
                  placeholder="e.g. client@domain.com"
                  required
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Mobile Number</label>
                <input
                  type="tel"
                  className="drawer-input"
                  value={newITBooking.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewITBooking({ ...newITBooking, phone: val });
                  }}
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Company / Address</label>
                <input
                  type="text"
                  className="drawer-input"
                  value={newITBooking.address}
                  onChange={(e) => setNewITBooking({ ...newITBooking, address: e.target.value })}
                  placeholder="e.g. Madurai"
                />
              </div>
              <span className="drawer-section-label">IT Service Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">IT Service *</label>
                <select
                  className="drawer-select"
                  value={newITBooking.service}
                  onChange={(e) => setNewITBooking({ ...newITBooking, service: e.target.value })}
                  required
                >
                  <option value="Website Development & Design">Website Development & Design</option>
                  <option value="Freelancing IT Services">Freelancing IT Services</option>
                  <option value="Custom Web Application">Custom Web Application</option>
                  <option value="Database & Cloud Setup">Database & Cloud Setup</option>
                  <option value="SEO & Speed Optimization">SEO & Speed Optimization</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Project Requirement / Description</label>
                <textarea
                  rows={2}
                  className="drawer-textarea"
                  value={newITBooking.issue}
                  onChange={(e) => setNewITBooking({ ...newITBooking, issue: e.target.value })}
                  placeholder="Project scope details..."
                />
              </div>
              <span className="drawer-section-label">Project Details</span>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={newITBooking.estimatedCost}
                    onChange={(e) => setNewITBooking({ ...newITBooking, estimatedCost: e.target.value })}
                    placeholder="e.g. ₹8,999"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Delivery</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={newITBooking.estimatedDelivery}
                    onChange={(e) => setNewITBooking({ ...newITBooking, estimatedDelivery: e.target.value })}
                    placeholder="e.g. 2 Weeks"
                  />
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
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
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
                <input
                  type="text"
                  className="drawer-input"
                  value={newOtherBooking.name}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, name: e.target.value })}
                  placeholder="Customer Full Name"
                  required
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Email Address *</label>
                <input
                  type="email"
                  className="drawer-input"
                  value={newOtherBooking.email}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, email: e.target.value })}
                  placeholder="e.g. client@domain.com"
                  required
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Mobile Number</label>
                <input
                  type="tel"
                  className="drawer-input"
                  value={newOtherBooking.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewOtherBooking({ ...newOtherBooking, phone: val });
                  }}
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Full Address</label>
                <input
                  type="text"
                  className="drawer-input"
                  value={newOtherBooking.address}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, address: e.target.value })}
                  placeholder="e.g. 12, Main Street, Madurai"
                />
              </div>
              <span className="drawer-section-label">Service Information</span>
              <div className="drawer-form-group">
                <label className="drawer-label">Service Type *</label>
                <select
                  className="drawer-select"
                  value={newOtherBooking.serviceType}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, serviceType: e.target.value })}
                  required
                >
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
                <textarea
                  rows={2}
                  className="drawer-textarea"
                  value={newOtherBooking.issue}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, issue: e.target.value })}
                  placeholder="Describe details of the issue or project requirement..."
                />
              </div>
              <span className="drawer-section-label">Diagnostics & Financials</span>
              <div className="drawer-cost-delivery">
                <div className="drawer-form-group">
                  <label className="drawer-label">Estimated Cost</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={newOtherBooking.estimatedCost}
                    onChange={(e) => setNewOtherBooking({ ...newOtherBooking, estimatedCost: e.target.value })}
                    placeholder="e.g. ₹850"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-label">Est. Turnaround</label>
                  <input
                    type="text"
                    className="drawer-input"
                    value={newOtherBooking.estimatedTurnaround}
                    onChange={(e) => setNewOtherBooking({ ...newOtherBooking, estimatedTurnaround: e.target.value })}
                    placeholder="e.g. 2 Days"
                  />
                </div>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Status</label>
                <select
                  className="drawer-select"
                  value={newOtherBooking.status}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, status: e.target.value })}
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="drawer-form-group">
                <label className="drawer-label">Technician Note</label>
                <textarea
                  rows={2}
                  className="drawer-textarea"
                  value={newOtherBooking.notes}
                  onChange={(e) => setNewOtherBooking({ ...newOtherBooking, notes: e.target.value })}
                  placeholder="Technician diagnostics or initial comment..."
                />
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
          <div className="mail-modal-box" onClick={(e) => e.stopPropagation()}>
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
          <div className="delete-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <AlertCircle size={28} className="delete-confirm-icon" />
              <h3>Confirm Delete</h3>
            </div>
            <p className="delete-confirm-message">
              Are you sure you want to permanently delete this service booking? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button type="button" className="delete-confirm-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="delete-confirm-btn-confirm" onClick={() => {
                  setShowDeleteConfirm(false);
                  if (itBookingToDelete) {
                    confirmITDelete(itBookingToDelete);
                  } else if (otherBookingToDelete) {
                    confirmOtherDelete(otherBookingToDelete);
                  }
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
