import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader2, CheckCircle2, AlertCircle, Clock, ShieldAlert, Cpu, Check, MapPin, Mail, User, Briefcase, Calendar } from 'lucide-react';
import { bookingStore } from '../utils/bookingStore';
import "../css/TrackTicket.css";
const TrackTicket = () => {
  const { ticketId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputTicket, setInputTicket] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const statusSteps = ticketDetails?.status === 'Cancelled'
    ? ['Pending', 'Confirmed', 'In Progress', 'Cancelled']
    : ['Pending', 'Confirmed', 'In Progress', 'Completed'];
  const getStatusIndex = (status) => {
    if (status === 'Cancelled') return 3;
    return statusSteps.indexOf(status);
  };
  const loadTicket = async (id) => {
    if (!id) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const details = await bookingStore.getBookingByTicket(id.trim());
      setTicketDetails(details);
    } catch (error) {
      console.error("Failed to load ticket details:", error);
      setTicketDetails(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const urlTicketId = ticketId || searchParams.get('ticket');
    if (urlTicketId) {
      setInputTicket(urlTicketId);
      loadTicket(urlTicketId);
    } else {
      setTicketDetails(null);
      setHasSearched(false);
    }
  }, [ticketId, searchParams]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = inputTicket.trim().toUpperCase();
    if (!trimmedInput) return;
    const currentTicketId = (ticketId || searchParams.get('ticket') || '').trim().toUpperCase();
    if (trimmedInput === currentTicketId) {
      loadTicket(trimmedInput);
    } else {
      navigate(`/track/${trimmedInput}`);
    }
  };
  const currentStatusIndex = ticketDetails ? getStatusIndex(ticketDetails.status) : -1;
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="track-ticket-page">
      <div className="contact-bg-text track-bg-overlay-text">TRACKER</div>
      <section className="page-hero hero-tracking">
        <div className="container">
          <span className="section-subtitle">Real-time Diagnostics</span>
          <h1 className="section-title">Track Your Ticket</h1>
          <p className="page-description">Enter your service Ticket ID to track the real-time repair and delivery status of your device.</p>
        </div>
      </section>
      <div className="search-section">
        <div className="search-glass-card">
          <h3 className="search-title-small">Enter Ticket ID</h3>
          <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
            <input type="text" placeholder="e.g., SIAN-2026-1002" value={inputTicket} onChange={(e) => setInputTicket(e.target.value)} className="search-input" required />
            <button type="submit" className="search-button">
              <Search size={18} />Track
            </button>
          </form>
        </div>
      </div>
      <div className="tracking-result-container">
        {loading ? (
          <div className="track-loading-container">
            <Loader2 size={48} className="animate-spin" color="#11678E" />
            <p className="track-loading-text">Retrieving diagnostic report...</p>
          </div>
        ) : ticketDetails ? (
          <div className="glass-tracking-card reveal active">
            <div className="track-header">
              <div className="track-id-group">
                <span className="track-lbl">Service Order</span>
                <span className="track-id">{ticketDetails.ticketId}</span>
              </div>
              <div className="track-meta">
                <span className="track-lbl">Received Date</span>
                <span className="track-date">{formatDate(ticketDetails.createdAt)}</span>
              </div>
            </div>
            <div className="stepper-container">
              <div className="stepper-progress-bar">
                <div className={`stepper-progress-fill step-progress-${currentStatusIndex} ${ticketDetails.status === 'Cancelled' ? 'cancelled' : ''}`}></div>
              </div>
              <div className="stepper-steps">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx < currentStatusIndex;
                  const isActive = idx === currentStatusIndex;
                  let StepIcon = Clock;
                  if (step === 'Confirmed') StepIcon = CheckCircle2;
                  if (step === 'In Progress') StepIcon = Cpu;
                  if (step === 'Completed') StepIcon = Check;
                  if (step === 'Cancelled') StepIcon = ShieldAlert;
                  return (
                    <div key={step} className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${step === 'Cancelled' ? 'cancelled' : ''}`}>
                      <div className="step-circle">
                        {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                      </div>
                      <span className="step-label">
                        {step === 'Pending' ? 'Request Received' : step === 'Confirmed' ? 'Confirmed' : step === 'In Progress' ? 'In Progress' : step === 'Cancelled' ? 'Cancelled' : 'Ready / Complete'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {ticketDetails.status === 'Cancelled' && (
              <div className="status-summary-box track-cancelled-box">
                <div className="track-cancelled-header">
                  <ShieldAlert size={28} />
                  <div>
                    <h4 className="track-cancelled-title">Service Order Cancelled</h4>
                    <p className="track-cancelled-msg">This service request has been cancelled by the admin or client.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="track-details-grid">
              <div className="details-card-left">
                <h3 className="track-detail-header-h3">Device & Booking Details</h3>
                <div className="detail-row">
                  <span className="detail-label">Service Type</span>
                  <div className="detail-val track-detail-val-icon-wrap">
                    <Briefcase size={16} color="#11678E" />
                    {ticketDetails.service}
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Issue Described</span>
                  <div className="detail-val track-detail-issue-box">"{ticketDetails.issue}"</div>
                </div>
                <div className="track-detail-grid-half">
                  <div className="detail-row">
                    <span className="detail-label">Customer Name</span>
                    <div className="detail-val track-detail-val-icon-wrap font-size-95">
                      <User size={14} color="#11678E" />
                      {ticketDetails.name}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <div className="detail-val track-detail-val-icon-wrap track-detail-val-ellipsis">
                      <Mail size={14} color="#11678E" />
                      {ticketDetails.email}
                    </div>
                  </div>
                </div>
                <div className="detail-row track-detail-row-mt15">
                  <span className="detail-label">Collection/Service Address</span>
                  <div className="detail-val track-detail-address-val">
                    <MapPin size={14} color="#11678E" className="track-detail-address-pin" />
                    {ticketDetails.address}
                  </div>
                </div>
              </div>
              <div className="details-card-right">
                <div className="status-summary-box">
                  <div className="detail-row">
                    <span className="detail-label">Live Status</span>
                    <div className={`detail-val live-status-title live-status-${ticketDetails.status.toLowerCase().replace(' ', '-')}`}>
                      {ticketDetails.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estimated Service Cost</span>
                    <div className="detail-val cost">
                      {ticketDetails.estimatedCost}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estimated Delivery / Turnaround</span>
                    <div className="detail-val track-detail-val-icon-wrap">
                      <Calendar size={16} color="#11678E" />
                      {ticketDetails.estimatedDelivery}
                    </div>
                  </div>
                </div>
                <div className="diagnostics-box">
                  <div className="diagnostics-title">Technician Log Note</div>
                  <div className="diagnostics-text">"{ticketDetails.notes}"</div>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="glass-tracking-card reveal active">
            <div className="no-ticket-state">
              <AlertCircle size={48} className="no-ticket-icon" />
              <h3 className="no-ticket-title">Ticket Not Found</h3>
              <p>We couldn't find a service booking with the ID <strong>"{inputTicket}"</strong>. Please verify the ID on your receipt/email and try again.</p>
            </div>
          </div>
        ) : (
          <div className="glass-tracking-card reveal active">
            <div className="no-ticket-state">
              <Search size={48} className="no-ticket-icon" />
              <h3 className="no-ticket-title">Awaiting Search Query</h3>
              <p>Please enter your Ticket ID in the search bar above to fetch your real-time status. E.g. <strong>SIAN-2026-1026</strong>.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrackTicket;