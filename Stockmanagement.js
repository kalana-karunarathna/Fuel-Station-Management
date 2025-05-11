import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Stockmanagement.css';
import Sidebar from './Sidebar'; 

const Stockmanagement = () => {
  const navigate = useNavigate();
  
  const [currentFuelLevel, setCurrentFuelLevel] = useState({
    petrol: 75,
    diesel: 60,
    premium: 45
  });
  
  const handleNavigateToManageStock = () => {
    navigate('/fuelstock');
  };
  
  const handleNavigateToPumpControllers = () => {
    navigate('/pumpcontrol');
  };
  
  const handleNavigateToStockUpdates = () => {
    navigate('/stock-updates');
  };

  const handleNavigateToDemandAnalysis = () => {
    navigate('/History');
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="fuel-stock-container">
          <h1 className="page-title">Fuel Stock Management</h1>
          
          <div className="dashboard-section">
            <div className="card current-fuel-card">
              <h2>Current Fuel Levels</h2>
              <div className="fuel-meters">
                <div className="fuel-meter">
                  <label>Petrol</label>
                  <div className="meter-container">
                    <div 
                      className="meter-fill" 
                      style={{ width: `${currentFuelLevel.petrol}%`, backgroundColor: '#4CAF50' }}
                    ></div>
                  </div>
                  <span>{currentFuelLevel.petrol}%</span>
                </div>
                
                <div className="fuel-meter">
                  <label>Diesel</label>
                  <div className="meter-container">
                    <div 
                      className="meter-fill" 
                      style={{ width: `${currentFuelLevel.diesel}%`, backgroundColor: '#2196F3' }}
                    ></div>
                  </div>
                  <span>{currentFuelLevel.diesel}%</span>
                </div>
                
                <div className="fuel-meter">
                  <label>Premium</label>
                  <div className="meter-container">
                    <div 
                      className="meter-fill" 
                      style={{ width: `${currentFuelLevel.premium}%`, backgroundColor: '#FFC107' }}
                    ></div>
                  </div>
                  <span>{currentFuelLevel.premium}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button 
              className="nav-button manage-stock"
              onClick={handleNavigateToManageStock}
            >
              <div className="button-icon">
                <i className="fas fa-boxes"></i>
              </div>
              <h3>Manage Stock</h3>
              <p>Add, remove, and track fuel inventory</p>
            </button>
            
            <button 
              className="nav-button pump-controllers"
              onClick={handleNavigateToPumpControllers}
            >
              <div className="button-icon">
                <i className="fas fa-gas-pump"></i>
              </div>
              <h3>Pump Controllers</h3>
              <p>Monitor and manage fuel dispensers</p>
            </button>
            
            <button 
              className="nav-button stock-updates"
              onClick={handleNavigateToStockUpdates}
            >
              <div className="button-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3>Recent Stock Updates</h3>
              <p>View history of all fuel transactions</p>
            </button>

            <button 
              className="nav-button demand-analysis"
              onClick={handleNavigateToDemandAnalysis}
            >
              <div className="button-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Demand Analysis</h3>
              <p>Analyze fuel consumption patterns and forecast demand</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stockmanagement;