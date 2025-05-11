import React, { useState, useEffect } from 'react';
import { Filter, RefreshCcw, AlertCircle, Droplet } from 'lucide-react';
import '../css/tank.css';

const FuelTankInfographic = () => {
  const [fuels, setFuels] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('fuelType'); // fuelType, supplier, monthly, grade
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFuelData();
  }, []);

  useEffect(() => {
    if (fuels.length > 0) {
      generateDisplayData();
    }
  }, [fuels, viewType]);

  const fetchFuelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/getfuel`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setFuels(data);
    } catch (error) {
      console.error('Error fetching fuel data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDisplayData = () => {
    let data = [];

    if (viewType === 'fuelType') {
      // Group by fuel type and sum quantities
      const fuelTypeMap = new Map();
      
      fuels.forEach(fuel => {
        const currentQuantity = fuelTypeMap.get(fuel.FuelType) || 0;
        fuelTypeMap.set(fuel.FuelType, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      data = Array.from(fuelTypeMap.entries()).map(([type, quantity]) => ({
        name: type,
        quantity: quantity
      }));
    } 
    else if (viewType === 'supplier') {
      const supplierMap = new Map();
      
      fuels.forEach(fuel => {
        const currentQuantity = supplierMap.get(fuel.SupplierName) || 0;
        supplierMap.set(fuel.SupplierName, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      data = Array.from(supplierMap.entries()).map(([supplier, quantity]) => ({
        name: supplier,
        quantity: quantity
      }));
    }
    else if (viewType === 'monthly') {
      const monthlyMap = new Map();
      
      fuels.forEach(fuel => {
        if (!fuel.DeliveryDate) return;
        
        const date = new Date(fuel.DeliveryDate);
        if (isNaN(date.getTime())) return;
        
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        const currentQuantity = monthlyMap.get(monthYear) || 0;
        monthlyMap.set(monthYear, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      data = Array.from(monthlyMap.entries())
        .sort((a, b) => {
          const [monthA, yearA] = a[0].split(' ');
          const [monthB, yearB] = b[0].split(' ');
          
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          if (yearA !== yearB) {
            return parseInt(yearA) - parseInt(yearB);
          }
          
          return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
        })
        .map(([month, quantity]) => ({
          name: month,
          quantity: quantity
        }));
    }
    else if (viewType === 'grade') {
      const gradeMap = new Map();
      
      fuels.forEach(fuel => {
        if (!fuel.FuelGrade) return;
        
        const currentQuantity = gradeMap.get(fuel.FuelGrade) || 0;
        gradeMap.set(fuel.FuelGrade, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      data = Array.from(gradeMap.entries()).map(([grade, quantity]) => ({
        name: grade || 'Unknown',
        quantity: quantity
      }));
    }

    // Sort data by quantity in descending order (except for monthly view)
    if (viewType !== 'monthly') {
      data.sort((a, b) => b.quantity - a.quantity);
    }
    
    // Limit to top 9 for visual clarity
    if (data.length > 9 && viewType !== 'monthly') {
      const topItems = data.slice(0, 8);
      const othersSum = data.slice(8).reduce((sum, item) => sum + item.quantity, 0);
      
      if (othersSum > 0) {
        topItems.push({
          name: 'Others',
          quantity: othersSum
        });
      }
      
      data = topItems;
    }
    
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add percentage to each item
    data = data.map(item => ({
      ...item,
      percentage: (item.quantity / total) * 100
    }));
    
    setDisplayData(data);
  };

  const formatQuantity = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const getColorByIndex = (index) => {
    const colors = {
      fuelType: ['#3182CE', '#2c5282', '#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4', '#bee3f8', '#ebf8ff'],
      supplier: ['#38A169', '#2f855a', '#48bb78', '#68d391', '#9ae6b4', '#c6f6d5', '#f0fff4', '#e6fffa'],
      monthly: ['#DD6B20', '#c05621', '#ed8936', '#f6ad55', '#fbd38d', '#feebc8', '#FFFAF0', '#FFF5EB'],
      grade: ['#805AD5', '#6b46c1', '#9f7aea', '#b794f4', '#d6bcfa', '#e9d8fd', '#FAF5FF', '#F3E8FF']
    };
    
    // Use "Others" color if it's the Others category
    if (viewType !== 'monthly' && index === displayData.length - 1 && displayData[index].name === 'Others') {
      return '#A0AEC0';
    }
    
    // Otherwise use color from corresponding palette
    return colors[viewType][index % colors[viewType].length];
  };

  // Fuel Tank Component
  const FuelTank = ({ name, quantity, percentage, index }) => {
    const fillHeight = `${Math.max(5, percentage)}%`;
    const color = getColorByIndex(index);
    
    return (
      <div className="fuel-tank-container">
        <div className="fuel-tank-name" title={name}>
          {name}
        </div>
        
        <div className="fuel-tank">
          {/* Tank Details */}
          <div className="tank-details">
            <div className="tank-metrics">
              <div className="tank-metric">
                {formatQuantity(quantity)} L
              </div>
              <div className="tank-metric">
                {percentage.toFixed(1)}%
              </div>
            </div>
            
            <Droplet className="tank-droplet-icon" size={24} />
          </div>
          
          {/* Tank Markings */}
          <div className="tank-markings">
            <div className="tank-marking"></div>
            <div className="tank-marking"></div>
            <div className="tank-marking"></div>
          </div>
          
          {/* Fuel Fill */}
          <div 
            className="fuel-fill"
            style={{ 
              height: fillHeight, 
              backgroundColor: color,
            }}
          >
            {/* Fuel Surface Effect */}
            <div className="fuel-surface"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fuel-infographic-container">
      <div className="fuel-infographic-header">
        <div className="fuel-title">
          <Droplet className="fuel-icon" size={22} />
          <h2 className="fuel-heading">Fuel Quantity Analysis</h2>
        </div>
        
        <div className="fuel-actions">
          <div className="view-selector">
            <Filter className="filter-icon" size={18} />
            <select 
              value={viewType} 
              onChange={(e) => setViewType(e.target.value)}
              className="view-select"
            >
              <option value="fuelType">By Fuel Type</option>
              <option value="supplier">By Supplier</option>
              <option value="monthly">Monthly Trend</option>
              <option value="grade">By Fuel Grade</option>
            </select>
          </div>
          
          <button 
            className="refresh-button"
            onClick={fetchFuelData}
            disabled={loading}
          >
            <RefreshCcw size={16} className={loading ? "spinning" : ""} />
            <span>{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={36} />
          <p>Failed to load data: {error}</p>
          <button 
            onClick={fetchFuelData} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading fuel data...</p>
        </div>
      ) : displayData.length === 0 ? (
        <div className="empty-state">
          <p>No data available for this view</p>
          <button 
            onClick={fetchFuelData} 
            className="retry-button"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <>
          <div className="fuel-tanks-grid">
            {displayData.map((item, index) => (
              <FuelTank 
                key={item.name}
                name={item.name}
                quantity={item.quantity}
                percentage={item.percentage}
                index={index}
              />
            ))}
          </div>
          
          <div className="fuel-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <div className="stat-value">
                  {formatQuantity(displayData.reduce((sum, item) => sum + item.quantity, 0))}
                </div>
                <div className="stat-label">Total Quantity (L)</div>
              </div>
              
              <div className="summary-stat">
                <div className="stat-value">
                  {displayData.length}
                </div>
                <div className="stat-label">
                  {viewType === 'fuelType' ? 'Fuel Types' : 
                   viewType === 'supplier' ? 'Suppliers' : 
                   viewType === 'monthly' ? 'Months' : 'Grades'}
                </div>
              </div>
              
              <div className="summary-stat">
                <div className="stat-value">
                  {formatQuantity(Math.max(...displayData.map(item => item.quantity)))}
                </div>
                <div className="stat-label">Highest Volume</div>
              </div>
            </div>
            
            {viewType !== 'monthly' && displayData.length === 9 && displayData[8].name === 'Others' && (
              <div className="others-note">
                * "Others" category represents combined data from smaller entries
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FuelTankInfographic;