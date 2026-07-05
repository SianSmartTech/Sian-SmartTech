import Hero from "../components/Hero";
import Services from "../components/Services";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import GoogleReviews from "../components/GoogleReviews";
import Contact from "../components/Contact";
import Map from "../components/Map";
const Home = () => {
  return (
    <div className="home-sections-wrapper">
      <Hero />
      <div className="curved-section services-curved-wrapper"><Services /></div>
      <div className="curved-section process-curved-wrapper"><Process /></div>
      <div className="curved-section testimonials-curved-wrapper"><Testimonials /></div>
      <div className="curved-section google-reviews-curved-wrapper"><GoogleReviews /></div>
      <div className="curved-section contact-curved-wrapper"><Contact /></div>
      <div className="curved-section map-curved-wrapper"><Map /></div>
    </div>
  );
};
export default Home;