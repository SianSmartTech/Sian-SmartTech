import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../css/App.css";
const faqData = [
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
  }
];
const FaqPage = () => {
  const [openId, setOpenId] = useState(null);
  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };
  return (
    <div className="v2-page-layout">
      <div className="contact-bg-text">SUPPORT</div>
      <section className="page-hero hero-faq">
        <div className="container">
          <span className="section-subtitle">Support</span>
          <h1 className="section-title">FAQ</h1>
          <p className="page-description">Welcome to our FAQ section! Here, we've compiled answers to the most common questions about our products, services, and policies to help you find the information you need quickly. Whether you're curious about PC configurations, order tracking, or our return policy, you'll find all the details right here. Still have questions? Feel free to reach out to our support team—we're here to help!</p>
        </div>
      </section>
      <div className="curved-section">
        <section className="section bg-alt">
          <div className="container">
            <div className="faq-list-v2">
              {faqData.map((faq) => (
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
              <Link to="/all-faqs" className="btn-view-more">View More</Link>
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
export default FaqPage;