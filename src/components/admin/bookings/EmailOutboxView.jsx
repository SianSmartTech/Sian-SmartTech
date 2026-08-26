import { Mail, Send } from 'lucide-react';
export const EmailOutboxView = ({ emailLogs = [], setSelectedEmail, fmtDate }) => {
  return (
    <>
      <p className="outbox-desc">
        Below are automated email receipts sent to clients when a booking is confirmed or its status changes. Click any row to preview the HTML email template.
      </p>
      <div className="outbox-list">
        {emailLogs.length > 0 ? (
          emailLogs.map((log) => (
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
          ))
        ) : (
          <div className="empty-state admin-empty-state">
            <Mail size={40} className="empty-state-icon admin-empty-state-icon" />
            <h3 className="empty-state-title">No emails yet</h3>
            <p>Confirm pending bookings to generate email receipts.</p>
          </div>
        )}
      </div>
    </>
  );
};
