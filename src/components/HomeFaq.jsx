import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
const homeFaqData = [
  {
    id: 1,
    question: 'What services does Sian SmartTech offer?',
    answer: 'Sian SmartTech offers professional repair services for computers, laptops, and mobile phones, including hardware diagnostics, chip-level motherboard servicing, screen replacements, battery repairs, and custom IT software solutions.'
  },
  {
    id: 2,
    question: 'What brands of laptops do you service?',
    answer: 'We service all major brands including Apple (MacBook), Dell, HP, Lenovo, ASUS, Acer, MSI, Samsung, and others. We specialize in chip-level motherboard repair and upgrades for all major manufacturers.'
  },
  {
    id: 3,
    question: 'Do you provide a warranty for repairs?',
    answer: 'Yes, all our standard hardware repairs and installations come with a 30-day service warranty, ensuring peace of mind and quality assurance with genuine replacement parts.'
  },
  {
    id: 4,
    question: 'Can you upgrade my old laptop or PC?',
    answer: 'Absolutely! Upgrading RAM and moving to an SSD is the most cost-effective way to boost speed and performance for older systems. Contact us to find the compatible upgrades for your device.'
  },
  {
    id: 5,
    question: 'Can I track the status of my repair ticket online?',
    answer: 'Yes! You can track the real-time progress of your repair ticket directly on our Track Ticket page by entering your unique Ticket ID.'
  }
];
const HomeFaq = () => {
  const [openId, setOpenId] = useState(null);
  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };
  return (
    <section className="section bg-alt" id="home-faq">
      <div className="container">
        <div className="text-center home-faq-header">
          <span className="section-subtitle">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description home-faq-desc">
            Got questions about our computer, mobile repair, or IT services? Find the answers to the most common queries below.
          </p>
        </div>
        <div className="faq-list-v2">
          {homeFaqData.map((faq) => (
            <div key={faq.id} className={`faq-item-v2 glass-card ${openId === faq.id ? 'faq-open' : ''}`}>
              <button className="faq-question-v2" onClick={() => toggleFaq(faq.id)} aria-expanded={openId === faq.id}>
                <span>{faq.question}</span>
                {openId === faq.id ? (<Minus size={24} className="faq-icon-v2" />) : (<Plus size={24} className="faq-icon-v2" />)}
              </button>
              <div className={`faq-answer-v2 ${openId === faq.id ? 'faq-answer-open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="faq-action-v2 home-faq-action">
          <Link to="/faq" className="btn-view-more">View All FAQs</Link>
        </div>
      </div>
    </section>
  );
};
export default HomeFaq;