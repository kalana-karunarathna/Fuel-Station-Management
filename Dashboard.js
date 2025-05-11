import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Cloud, CloudRain, Droplet } from 'lucide-react';
import { FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import '../css/Dashboard.css';
import image8 from '../assests/i8.png';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  
  
  const [fuelPrices, setFuelPrices] = useState({
    petrol: {
      regular: { current: 3.89, previous: 3.82, change: 0.07 },
      premium: { current: 4.29, previous: 4.19, change: 0.10 },
      super: { current: 4.59, previous: 4.49, change: 0.10 }
    },
    diesel: {
      regular: { current: 3.65, previous: 3.72, change: -0.07 },
      premium: { current: 3.95, previous: 4.05, change: -0.10 }
    }
  });
  
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 8
  });
  
  const salesData = [
    { name: 'Mon', petrol: 4200, diesel: 3800 },
    { name: 'Tue', petrol: 4500, diesel: 4100 },
    { name: 'Wed', petrol: 5100, diesel: 4300 },
    { name: 'Thu', petrol: 4800, diesel: 4200 },
    { name: 'Fri', petrol: 5400, diesel: 4600 },
    { name: 'Sat', petrol: 6200, diesel: 5100 },
    { name: 'Sun', petrol: 5800, diesel: 4800 }
  ];
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  
  const renderWeatherIcon = (condition) => {
    switch(condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={24} />;
      case 'cloudy':
        return <Cloud className="text-gray-400" size={24} />;
      case 'rainy':
        return <CloudRain className="text-blue-400" size={24} />;
      default:
        return <Sun className="text-yellow-500" size={24} />;
    }
  };
  
  return (
    <div className="dash-dashboard-container"> 
      <Sidebar/>
      {/* Main Content */}
      <div className="dash-main-content">
        {/* Navbar */}
        <nav className="dash-navbar">
          {/* Left side - Brand/Logo */}
          <div className="dash-navbar-brand">
            <div className="dash-logo">
              <FaChartLine />
            </div>
         
          </div>
          
          {/* Middle - Search Bar */}
          <div className="dash-search-container">
            <div className="dash-search-box">
              <FaSearch className="dash-search-icon" />
              <input type="text" className="dash-search-input" placeholder="Search..." />
            </div>
          </div>
          
          
          <div className="dash-navbar-right">
            
            <div className="dash-notification-icon">
              <FaBell />
              <span className="dash-notification-badge">3</span>
            </div>
            
            
            <div className="dash-profile-dropdown" ref={dropdownRef}>
              <div className="dash-profile-icon" onClick={toggleDropdown}>
              <img src={image8} alt="Convenience Store" />
              </div>
              
              
              <div className={`dash-dropdown-menu ${dropdownOpen ? 'dash-active' : ''}`}>
                <div className="dash-dropdown-header">
                  <img src="/api/placeholder/60/60" alt="Profile" />
                  <div className="dash-user-info">
                    <h4>kalana</h4>
                    <p>kalana@gmail.com.com</p>
                  </div>
                </div>
                <ul className="dash-dropdown-list">
                  <li>
                    <a href="#profile">
                      <FaUser className="dash-dropdown-icon" />
                      <span>My Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#settings">
                      <FaCog className="dash-dropdown-icon" />
                      <span>Settings</span>
                    </a>
                  </li>
                  <li className="dash-divider"></li>
                  <li>
                    <a href="#logout" className="dash-logout">
                      <FaSignOutAlt className="dash-dropdown-icon" />
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        
        
        <div className="dash-dashboard-content">
          <div className="dash-welcome-section">
            <h1>Welcome to FuelTrack Dashboard</h1>
            <div className="dash-date-time">
              <span className="dash-date">{formatDate(currentTime)}</span>
              <span className="dash-time">{formatTime(currentTime)}</span>
            </div>
          </div>
          
          <div className="dash-dashboard-cards">
            <div className="dash-card dash-weather-card">
              <h2>Weather Conditions</h2>
              <div className="dash-weather-info">
                <div className="dash-weather-icon">
                  {renderWeatherIcon(weather.condition)}
                </div>
                <div className="dash-weather-details">
                  <p className="dash-temperature">{weather.temp}°F</p>
                  <p className="dash-condition">{weather.condition}</p>
                  <div className="dash-weather-meta">
                    <span><Droplet size={16} /> {weather.humidity}%</span>
                    <span>Wind: {weather.windSpeed} mph</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dash-card dash-price-card">
              <h2>Fuel Price Changes</h2>
              <div className="dash-price-container">
                <div className="dash-fuel-section">
                  <h3>Petrol</h3>
                  {Object.entries(fuelPrices.petrol).map(([type, data]) => (
                    <div key={`petrol-${type}`} className="dash-price-item">
                      <span className="dash-fuel-type">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      <span className="dash-current-price">${data.current.toFixed(2)}</span>
                      <span className={`dash-price-change ${data.change > 0 ? 'dash-price-up' : 'dash-price-down'}`}>
                        {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="dash-fuel-section">
                  <h3>Diesel</h3>
                  {Object.entries(fuelPrices.diesel).map(([type, data]) => (
                    <div key={`diesel-${type}`} className="dash-price-item">
                      <span className="dash-fuel-type">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      <span className="dash-current-price">${data.current.toFixed(2)}</span>
                      <span className={`dash-price-change ${data.change > 0 ? 'dash-price-up' : 'dash-price-down'}`}>
                        {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dash-card dash-sales-chart-card">
            <h2>Weekly Sales Volume</h2>
            <div className="dash-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="petrol" stroke="#ff7300" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="diesel" stroke="#387908" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;