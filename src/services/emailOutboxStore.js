let emailLogsCache = [];
export const emailOutboxStore = {
  getOutboxSheetsUrl() {
    return process.env.REACT_APP_GOOGLE_SHEETS_OUTBOX_URL;
  },
  getEmailLogs() {
    return emailLogsCache;
  },
  getEmailHtml(booking, status) {
    if (!booking) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://siansmarttech.in';
    const statusBadges = {
      Pending: '<span style="background-color: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Pending Review</span>',
      Confirmed: '<span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Confirmed</span>',
      'In Progress': '<span style="background-color: #f3e8ff; color: #6b21a8; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">In Progress</span>',
      Completed: '<span style="background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Completed & Ready</span>',
      Cancelled: '<span style="background-color: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Cancelled</span>'
    };
    const statusTexts = {
      Pending: 'Your service booking request has been <strong>RECEIVED</strong>. Our team will review and contact you shortly with diagnostics.',
      Confirmed: 'Your service booking request has been <strong>CONFIRMED</strong>. We have assigned a technician to look at your device.',
      'In Progress': 'Our technicians are now actively working to resolve your hardware/software issue.',
      Completed: 'Great news! Your service order has been <strong>COMPLETED</strong> successfully. Your device is ready for collection/delivery.',
      Cancelled: 'Please note that your service request has been <strong>CANCELLED</strong>. Contact us if this was an error.'
    };
    const emailParam = booking.email ? `&email=${encodeURIComponent(booking.email)}` : '';
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #11678E; border-radius: 8px; background-color: #ffffff; color: #333;">
        <div style="text-align: center; border-bottom: 2px solid #11678E; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="color: #11678E; margin: 0;">Sian SmartTech</h2>
          <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">Computer Hardware Repair & Services</p>
        </div>
        <p>Dear <strong>${booking.name || 'Customer'}</strong>,</p>
        <p>${statusTexts[status] || `Your service booking status is now: <strong>${status}</strong>.`}</p>

        <div style="background-color: #f5f9fc; border-left: 4px solid #11678E; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #11678E;">Booking & Service Details:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 140px;">Ticket ID:</td>
              <td style="padding: 4px 0; color: #11678E; font-weight: bold;">${booking.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Service Type:</td>
              <td style="padding: 4px 0;">${booking.service || 'Diagnostic Service'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Current Status:</td>
              <td style="padding: 4px 0;">${statusBadges[status] || status}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Estimated Cost:</td>
              <td style="padding: 4px 0; font-weight: bold;">${booking.estimatedCost || '₹350+'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Technician Note:</td>
              <td style="padding: 4px 0; font-style: italic; color: #555;">"${booking.notes || 'Awaiting diagnostics.'}"</td>
            </tr>
          </table>
        </div>
        <p style="margin-bottom: 25px;">You can track the real-time status of your repair at any time by clicking the link below:</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${origin}/track?ticket=${booking.ticketId}${emailParam}" style="background-color: #11678E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; box-shadow: 0 4px 6px rgba(17, 103, 142, 0.2);">Track Live Status</a>
        </p>

        <p style="font-size: 0.85rem; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
          If you have any questions, please contact our support team at +91 93446 78135 or reply directly to this email.<br/>
          <strong>Sian SmartTech</strong>, 5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.
        </p>
      </div>
    `;
  },
  async fetchEmailLogs(allBookings = []) {
    const url = this.getOutboxSheetsUrl();
    if (!url) return this.getEmailLogs();
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const hydrated = data.map(log => {
          let status = 'Pending';
          const subj = log.subject || '';
          if (subj.includes('Confirmed')) status = 'Confirmed';
          else if (subj.includes('In Progress')) status = 'In Progress';
          else if (subj.includes('Completed')) status = 'Completed';
          else if (subj.includes('Cancelled')) status = 'Cancelled';
          const booking = allBookings.find(b => (b.ticketId || '').trim().toUpperCase() === (log.ticketId || '').trim().toUpperCase());
          return {
            ...log,
            html: log.html || this.getEmailHtml(booking || { ticketId: log.ticketId }, status)
          };
        });
        emailLogsCache = hydrated;
        return hydrated;
      }
    } catch (e) {
      console.error('Google Sheets outbox fetch failed:', e);
    }
    return this.getEmailLogs();
  },
  sendSimulatedEmail(booking, newStatus) {
    const logs = this.getEmailLogs();
    const subjectText = newStatus === 'Pending' ? `Booking Request Received - Ticket #${booking.ticketId} | Sian SmartTech` : newStatus === 'Confirmed' ? `Booking Confirmed - Ticket #${booking.ticketId} | Sian SmartTech` : `Service Status Updated (#${booking.ticketId}) - ${newStatus} | Sian SmartTech`;
    const htmlContent = this.getEmailHtml(booking, newStatus);
    const newEmailLog = {
      id: `em-${Date.now()}`,
      ticketId: booking.ticketId,
      recipient: booking.email,
      subject: subjectText,
      sentAt: new Date().toISOString(),
      html: htmlContent
    };
    logs.unshift(newEmailLog);
    const outboxUrl = this.getOutboxSheetsUrl();
    if (outboxUrl) {
      const { html, ...logDataWithoutHtml } = newEmailLog;
      fetch(outboxUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'add',
          data: logDataWithoutHtml,
          html: htmlContent
        }),
        redirect: 'follow'
      }).catch(err => console.error('Failed to sync email to Google Sheets:', err));
    }
  }
};