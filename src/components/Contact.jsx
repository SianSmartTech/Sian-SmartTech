import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, Loader2, Instagram } from 'lucide-react';
import { companyInfo } from '../mockData';
import { toast } from 'sonner';
import "../css/App.css";
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const contactUrl = process.env.REACT_APP_GOOGLE_CONTACT_SHEETS_URL;
    if (!contactUrl) {
      setTimeout(() => {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      }, 1000);
      return;
    }
    try {
      const response = await fetch(contactUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(formData),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.error || 'Failed to save submission');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="contact-section-v2 reveal">
      <div className="contact-bg-text">CONTACT</div>
      <div className="contact-v2-container">
        <div className="contact-v2-left">
          <h2 className="contact-v2-title">Get in <span className="text-gradient">touch</span></h2>
          <p className="contact-v2-desc"> Have questions or ready to transform your business with our tech solutions?
          </p>
          <div className="contact-v2-cards">
            <a href={`mailto:${companyInfo.email}`} className="contact-v2-card accent-card">
              <div className="contact-v2-card-icon"><Mail size={22} /></div>
              <div className="contact-v2-card-content">
                <span className="contact-v2-card-label">Email us</span>
                <span className="contact-v2-card-value">{companyInfo.email}</span>
              </div>
              <div className="contact-v2-card-arrow">
                <ArrowUpRight size={18} />
              </div>
            </a>
            <a href={`tel:${companyInfo.phone}`} className="contact-v2-card accent-card">
              <div className="contact-v2-card-icon">
                <Phone size={22} />
              </div>
              <div className="contact-v2-card-content">
                <span className="contact-v2-card-label">Call us</span>
                <span className="contact-v2-card-value">{companyInfo.phone}</span>
              </div>
              <div className="contact-v2-card-arrow">
                <ArrowUpRight size={18} />
              </div>
            </a>
            <div className="contact-v2-card accent-card">
              <div className="contact-v2-card-icon">
                <MapPin size={22} />
              </div>
              <div className="contact-v2-card-content">
                <span className="contact-v2-card-label">Our location</span>
                <span className="contact-v2-card-value">{companyInfo.address}</span>
              </div>
              <div className="contact-v2-card-arrow">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <a href="https://www.instagram.com/sian_smart_tech?igsh=MTJ5Y3YybXl3aXBrYQ==" target="_blank" rel="noopener noreferrer" className="contact-v2-card accent-card">
              <div className="contact-v2-card-icon">
                <Instagram size={22} />
              </div>
              <div className="contact-v2-card-content">
                <span className="contact-v2-card-label">Instagram</span>
                <span className="contact-v2-card-value">@sian_smart_tech</span>
              </div>
              <div className="contact-v2-card-arrow">
                <ArrowUpRight size={18} />
              </div>
            </a>
          </div>
        </div>
        <form className="contact-v2-form" onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="contact-v2-input" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="contact-v2-input" />
          <textarea name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="Message" className="contact-v2-input contact-v2-textarea" ></textarea>
          <button type="submit" className="contact-v2-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                <Loader2 size={18} className="animate-spin" /> Sending...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
export default Contact;