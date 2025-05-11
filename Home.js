import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import '../css/Home.css';
import image1 from '../assests/1.jpg';
import image2 from '../assests/2.jpg';
import image3 from '../assests/3.jpg';
import image4 from '../assests/i1.png';
import image7 from '../assests/i7.png';
import image6 from '../assests/i3.png';
import image5 from '../assests/s.png';


function Home() {
  // State for image slider
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderImages = [image3, image1, image2];
  const sliderTexts = [
    {
      title: "Welcome to Lalith Solution Fuel Station",
      subtitle: "Quality fuel and excellent service for your journey"
    },
    {
      title: "Premium Quality Fuel",
      subtitle: "Keeping your vehicle running at peak performance"
    },
    {
      title: "24/7 Service",
      subtitle: "We're always open to serve your fuel needs"
    }
  ];
  
  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sliderImages.length]);
  
  // Function to handle manual slide change
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };
  
  // Updated fuel price data
  const fuelPrices = [
    { type: 'Regular Petrol', price: 'RS.315.90', lastUpdated: 'April 20, 2025' },
    { type: 'Premium Petrol', price: 'RS.328.50', lastUpdated: 'April 20, 2025' },
    { type: 'Diesel', price: 'RS.342.75', lastUpdated: 'April 20, 2025' },
    { type: 'CNG', price: 'RS.395.25', lastUpdated: 'April 20, 2025' }
  ];
  
  // New state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo"> 
          <img src={image5} alt="Lalith Solution Fuel Station" />
        </div>
        
        {/* Mobile menu button */}
        <div className="mobile-menu-button" onClick={toggleMobileMenu}>
          <div className={`menu-icon ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="/" className="active">Home</a>
          <a href="/services">Services</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
        
        <div className="auth-buttons">
      <button onClick={() => navigate("/dasboard")}>Login</button>
      <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Slider */}
        <div className="slider-container">
          <div className="slider">
            {sliderImages.map((img, index) => (
              <div 
                key={index} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
              >
                <img src={img} alt={`Slide ${index + 1}`} />
                <div className="slide-content">
                  <h2>{sliderTexts[index].title}</h2>
                  <p>{sliderTexts[index].subtitle}</p>
                  <button className="cta-button">Explore Services</button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="slider-arrow prev" onClick={prevSlide}>&#10094;</button>
          <button className="slider-arrow next" onClick={nextSlide}>&#10095;</button>
          
          <div className="slider-dots">
            {sliderImages.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Fuel Prices Section */}
        <section className="fuel-prices">
          <h2>Today's Fuel Prices</h2>
          <div className="price-container">
            {fuelPrices.map((fuel, index) => (
              <div className="price-card" key={index}>
                <div className="fuel-type">{fuel.type}</div>
                <div className="price-amount">{fuel.price}</div>
                <div className="update-info">Last updated: {fuel.lastUpdated}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="services">
          <h2>Our Services</h2>
          <div className="service-cards">
            <div className="service-card">
              <div className="service-icon">
                <img src={image4} alt="Quality Fuel" />
              </div>
              <h3>Quality Fuel</h3>
              <p>Premium grade fuels that enhance engine performance and efficiency.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <img src={image7} alt="Fuel Delivery" />
              </div>
              <h3>Fuel Delivery</h3>
              <p>Convenient delivery service brings fuel directly to your location.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <img src={image6} alt="Convenience Store" />
              </div>
              <h3>Convenience Store</h3>
              <p>24/7 store with snacks, beverages, and automotive essentials.</p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-us">
          <div className="about-content">
            <div className="about-text">
              <h2>About Lalith Solution</h2>
              <p>With over 15 years of service excellence, Lalith Solution Fuel Station has been a trusted name in providing quality fuel and exceptional customer service.</p>
              <p>Our station is equipped with modern facilities and staffed by friendly professionals committed to making your experience smooth and convenient.</p>
              <button className="cta-button">Learn More</button>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years of Service</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Availability</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Quality Assured</span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Need Fuel Delivered?</h2>
            <p>We bring quality fuel directly to your doorstep.</p>
            <button className="cta-button light">Schedule Delivery</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Lalith Solution</h3>
            <p>Quality fuel and convenience for all your needs</p>
            <div className="social-icons">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">IN</a>
              <a href="#" className="social-icon">TW</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>123 Fuel Station Road, City</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@lalithsolution.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Lalith Solution. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;