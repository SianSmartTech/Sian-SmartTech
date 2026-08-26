import { useState } from 'react';
import { CalendarCheck, Plus, Search, Edit2, Trash2, Phone, Mail, User, Calendar } from 'lucide-react';
export const WorkScheduleView = ({ schedules = [], onOpenModal, onEdit, onDelete, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const filtered = schedules.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.workDescription || '').toLowerCase().includes(q) ||
      (s.customerPhone || '').toLowerCase().includes(q) ||
      (s.assignedTo || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });
  const pendingCount = schedules.filter((s) => s.status === 'Pending').length;
  const inProgressCount = schedules.filter((s) => s.status === 'In Progress').length;
  const completedCount = schedules.filter((s) => s.status === 'Completed').length;
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Work Schedule & Field Tasks</h2>
          <p className="bm-view-sub">
            Assign, schedule and track on-site and in-store computer/mobile service jobs
          </p>
        </div>
        <button className="bm-btn-primary" onClick={() => onOpenModal('schedule')}>
          <Plus size={16} /> New Work Schedule
        </button>
      </div>
      <div className="bm-mini-stats-row">
        <div className="bm-mini-stat">
          <span className="bm-mini-stat-num">{schedules.length}</span>
          <span className="bm-mini-stat-lbl">Total Tasks</span>
        </div>
        <div className="bm-mini-stat">
          <span className="bm-mini-stat-num text-amber">{pendingCount}</span>
          <span className="bm-mini-stat-lbl">Pending Review</span>
        </div>
        <div className="bm-mini-stat">
          <span className="bm-mini-stat-num text-indigo">{inProgressCount}</span>
          <span className="bm-mini-stat-lbl">In Progress</span>
        </div>
        <div className="bm-mini-stat">
          <span className="bm-mini-stat-num text-emerald">{completedCount}</span>
          <span className="bm-mini-stat-lbl">Completed</span>
        </div>
      </div>
      <div className="bm-filter-bar">
        <div className="bm-search-box">
          <Search size={16} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by client, technician, description, phone..."
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bm-select-filter"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      <div className="bm-table-card">
        <div className="bm-table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Schedule Date</th>
                <th>Client Details</th>
                <th>Work Scope</th>
                <th>Assigned Technician</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="bm-date-cell">
                      <Calendar size={14} />
                      <span>{s.date || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="bm-cell-primary">{s.customerName}</div>
                    <div className="bm-contact-row">
                      {s.customerPhone && (
                        <span><Phone size={11} /> {s.customerPhone}</span>
                      )}
                      {s.customerEmail && (
                        <span><Mail size={11} /> {s.customerEmail}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="bm-work-desc">{s.workDescription}</div>
                    {s.notes && <div className="bm-work-notes">Note: {s.notes}</div>}
                  </td>
                  <td>
                    <div className="bm-tech-pill">
                      <User size={12} />
                      <span>{s.assignedTo || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`bm-priority-badge priority-${(s.priority || 'medium').toLowerCase()}`}>
                      {s.priority || 'Medium'}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`bm-inline-status-select status-${(s.status || 'pending').toLowerCase().replace(' ', '-')}`}
                      value={s.status || 'Pending'}
                      onChange={(e) => onUpdateStatus && onUpdateStatus(s, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <div className="bm-action-btn-group">
                      <button
                        className="bm-icon-btn edit"
                        title="Edit Schedule"
                        onClick={() => onEdit(s)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="bm-icon-btn delete"
                        title="Delete Schedule"
                        onClick={() => onDelete(s.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="bm-empty-cell py-12">
                    <CalendarCheck size={36} className="bm-empty-icon text-indigo" />
                    <h4>No Work Schedules Found</h4>
                    <p>Try adjusting your search criteria or click "New Work Schedule" to create one.</p>
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