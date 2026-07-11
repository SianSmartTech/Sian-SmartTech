import "../css/App.css";
import { Check } from 'lucide-react';
import { pricing } from '../mockData';
const Pricing = () => {
  const scrollToContact = (e) => {
    e.preventDefault();
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section id="pricing" className="pricing-section-v2 reveal">
      <div className="pricing-bg-text">PRICING</div>
      <div className="pricing-v2-wrapper">
        <div className="pricing-v2-header">
          <h2 className="pricing-v2-title">Transparent Pricing</h2>
          <p className="pricing-v2-desc">Choose the plan that fits your needs. No hidden fees, no surprises.</p>
        </div>
        <div className="pricing-notice-banner reveal">
          <p>📢 <strong>Please Note:</strong>Price depends on the problem and it depends on the work case scenario.</p>
        </div>
        <div className="pricing-v2-grid">
          {pricing.map((plan) => (
            <div key={plan.id} className={` accent-card ${plan.popular ? 'pricing-v2-popular' : ''}`}>
              {plan.popular && <div className="pricing-v2-badge">Most Popular</div>}
              <div className="pricing-v2-card-header">
                <h3 className="pricing-v2-plan-name">{plan.name}</h3>
                <div className="pricing-v2-price">{plan.price}
                  <span className="pricing-v2-period">/{plan.period}</span>
                </div>
              </div>
              <ul className="pricing-v2-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="pricing-v2-feature">
                    <Check size={18} className="pricing-v2-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button onClick={scrollToContact} className={`pricing-v2-btn ${plan.popular ? 'pricing-v2-btn-primary' : ''}`}>Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Pricing;