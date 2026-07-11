import { useState, useEffect } from 'react';
import { CheckCircle2, Ticket, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { services, itServicesData } from '../mockData';
import { toast, Toaster } from 'sonner';
import { bookingStore } from '../utils/bookingStore';
import "../css/App.css";
import "../css/BookServicePage.css";
const allServices = [...services, ...itServicesData];
const BookServicePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', service: '', issue: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    const stateService = location.state?.selectedService;
    const preselectedService = stateService || serviceParam;
    if (preselectedService) {
      const matched = allServices.find(
        s => s.title.toLowerCase() === preselectedService.toLowerCase()
      );
      if (matched) {
        setFormData(prev => ({ ...prev, service: matched.title }));
      }
    }
  }, [location]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!formData.phone || !formData.phone.trim()) {
      toast.error('Please enter your mobile number.');
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9.');
      return;
    }
    if (!formData.address || !formData.address.trim()) {
      toast.error('Please enter your full address.');
      return;
    }
    if (!formData.service) {
      toast.error('Please select a service type.');
      return;
    }
    if (!formData.issue || !formData.issue.trim()) {
      toast.error('Please describe your issue.');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newBooking = await bookingStore.addBooking(formData);
      if (newBooking) {
        setSuccessBooking(newBooking);
        toast.success('Service booked successfully!');
        setFormData({ name: '', email: '', phone: '', address: '', service: '', issue: '' });
      } else {
        throw new Error('Store rejected booking');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to book service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="v2-page-layout book-service-page">
      <div className="contact-bg-text">BOOKING</div>
      <Toaster position="top-right" richColors />
      <section className="page-hero hero-booking">
        <div className="container">
          <span className="section-subtitle">Reserve Your Slot</span>
          <h1 className="section-title">Book a Service</h1>
          <p className="page-description">Get expert hardware and software support at your convenience. Fill out the form below to schedule your appointment.</p>
        </div>
      </section>
      <div className="container book-service-form-section">
        <div className="contact-v2-wrapper book-service-wrapper">
          {successBooking ? (
            <div className="booking-success-card reveal active">
              <div className="booking-success-icon-wrap">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="booking-success-title">Booking Confirmed!</h2>
              <p className="booking-success-message">Thank you, <strong>{successBooking.name}</strong>. Your service request has been registered in our ledger.</p>
              <div className="booking-ticket-box">
                <div className="booking-ticket-label">
                  <Ticket size={16} />Service Ticket ID
                </div>
                <div className="booking-ticket-id">{successBooking.ticketId}</div>
                <div className="booking-ticket-help">Save this ID or use the live tracking link below.
                </div>
              </div>
              <div className="booking-success-actions">
                <Link to={`/track/${successBooking.ticketId}`} className="contact-v2-submit booking-track-link">Track Ticket Status<ArrowRight size={18} /></Link>
                <button onClick={() => setSuccessBooking(null)} className="btn-book-again">
                  <ArrowLeft size={16} />Book Another Service
                </button>
              </div>
            </div>
          ) : (
            <form className="contact-v2-form book-service-form" onSubmit={handleSubmit} noValidate>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="contact-v2-input book-service-input-field" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="contact-v2-input book-service-input-field" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength={10} placeholder="Mobile Number (10 digits)" className="contact-v2-input book-service-input-field" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Full Address" className="contact-v2-input book-service-address" />
              <select name="service" value={formData.service} onChange={handleChange} required className="contact-v2-input book-service-select">
                <option value="" disabled>-- Select Service Type --</option>
                {allServices.map((service) => (
                  <option key={`${service.id}-${service.title}`} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
              <textarea name="issue" value={formData.issue} onChange={handleChange} required rows="6" placeholder="Briefly describe your issue..." className="contact-v2-input contact-v2-textarea book-service-textarea"></textarea>
              <button type="submit" className="contact-v2-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookServicePage;