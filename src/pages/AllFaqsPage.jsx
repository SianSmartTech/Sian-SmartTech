import { useState } from 'react';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../css/App.css";
const allFaqsData = [
  {
    id: 1,
    question: 'Can I change a component after confirming the configuration?',
    answer: 'Yes, you can change components as long as the build process hasn\'t started. Please contact our support team immediately if you need to make adjustments to your order.'
  },
  {
    id: 2,
    question: 'Can I get my PC within 7 working days?',
    answer: 'Standard builds typically take 5-7 business days. Express shipping options may be available depending on component availability and your location.'
  },
  {
    id: 3,
    question: 'Do you preinstall games or software on custom PCs?',
    answer: 'We preinstall the operating system and all necessary drivers. We can also preinstall specific software or games upon request during the configuration process.'
  },
  {
    id: 4,
    question: 'Laptop vs. PC: Which is better?',
    answer: 'It depends on your needs. Laptops offer portability, while PCs generally provide better performance, cooling, and upgradability for the same price point.'
  },
  {
    id: 5,
    question: 'Why should I choose a custom PC over a prebuilt PC?',
    answer: 'Custom PCs allow you to choose high-quality components tailored to your specific needs, often resulting in better performance, easier upgrades, and better value for money.'
  },
  {
    id: 6,
    question: 'Do you provide a warranty for service and repairs?',
    answer: 'Yes, all our repairs come with a standard 30-day warranty. Extended warranties are available for premium subscribers and certain hardware installations.'
  },
  {
    id: 7,
    question: 'What brands of laptops do you service?',
    answer: 'We service all major brands including Apple (MacBook), Dell, HP, Lenovo, ASUS, Acer, MSI, and others. We specialize in chip-level repairs for all these brands.'
  },
  {
    id: 8,
    question: 'How long does a typical chip-level repair take?',
    answer: 'Chip-level repairs usually take between 3 to 5 business days depending on the complexity of the issue and the availability of specific components.'
  },
  {
    id: 9,
    question: 'Do you offer home pickup and delivery?',
    answer: 'Yes, we provide home pickup and delivery services for a small additional fee within a certain radius of our service centers.'
  },
  {
    id: 10,
    question: 'Can I track the status of my repair online?',
    answer: 'Currently, you can track your repair status by contacting us with your ticket number. We are working on an online tracking system that will be available soon.'
  },
  {
    id: 11,
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit/debit cards, UPI, and bank transfers.'
  },
  {
    id: 12,
    question: 'Do you sell refurbished laptops or PCs?',
    answer: 'Yes, we occasionally have certified refurbished laptops and PCs for sale. All refurbished units undergo rigorous testing and come with a 3-month warranty.'
  },
  {
    id: 13,
    question: 'Can you upgrade my old laptop\'s RAM and SSD?',
    answer: 'Absolutely! Upgrading RAM and moving to an SSD is the best way to breathe new life into an old laptop. We can help you choose and install the right components.'
  },
  {
    id: 14,
    question: 'Do you provide data recovery from dead hard drives?',
    answer: 'Yes, our data recovery team specializes in recovering files from failing, corrupted, or physically damaged hard drives and SSDs.'
  },
  {
    id: 15,
    question: 'What are your opening hours?',
    answer: 'Our service centers are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays and public holidays.'
  }
];
const AllFaqsPage = () => {
  const [openId, setOpenId] = useState(null);
  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">FAQS</div>
      <section className="page-hero hero-faq">
        <div className="container">
          <div className="faq-back-container">
            <Link to="/faq" className="nav-link faq-back-link">
              <ArrowLeft size={20} /> Back to FAQ
            </Link>
          </div>
          <span className="section-subtitle">Complete Guide</span>
          <h1 className="section-title">All FAQs</h1>
          <p className="page-description">Explore our comprehensive list of frequently asked questions to find answers about our PC building services, hardware repairs, warranties, and more.</p>
        </div>
      </section>
      <div className="curved-section">
        <section className="section bg-alt">
          <div className="container">
            <div className="faq-list-v2">
              {allFaqsData.map((faq) => (
                <div key={faq.id} className={`faq-item-v2 glass-card ${openId === faq.id ? 'faq-open' : ''}`}>
                  <button className="faq-question-v2" onClick={() => toggleFaq(faq.id)}>
                    <span>{faq.question}</span>
                    {openId === faq.id ? (
                      <Minus size={24} className="faq-icon-v2" />
                    ) : (
                      <Plus size={24} className="faq-icon-v2" />
                    )}
                  </button>
                  <div className={`faq-answer-v2 ${openId === faq.id ? 'faq-answer-open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="faq-action-v2">
              <div className="faq-contact-card">
                <h3>Still Have Questions?</h3>
                <p>Can't find the answer you're looking for? Please chat with our friendly team.</p>
                <Link to="/" state={{ scrollTo: 'contact' }} className="btn-primary">Contact Us</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default AllFaqsPage;