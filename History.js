import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Filter, RefreshCcw, AlertCircle, BarChart3, Droplet, LayoutGrid } from 'lucide-react';
import '../css/History.css';
import Sidebar from './Sidebar';

const FuelVisualization = () => {
  const [fuels, setFuels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('fuelType'); // fuelType, supplier, monthly, grade
  const [viewMode, setViewMode] = useState('chart'); // chart, tanks
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFuelData();
  }, []);

  useEffect(() => {
    if (fuels.length > 0) {
      generateChartData();
    }
  }, [fuels, chartType]);

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

  const generateChartData = () => {
    let data = [];

    if (chartType === 'fuelType') {
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
    else if (chartType === 'supplier') {
      // Group by supplier and sum quantities
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
    else if (chartType === 'monthly') {
      // Group by month and sum quantities
      const monthlyMap = new Map();
      
      fuels.forEach(fuel => {
        if (!fuel.DeliveryDate) return;
        
        const date = new Date(fuel.DeliveryDate);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        const currentQuantity = monthlyMap.get(monthYear) || 0;
        monthlyMap.set(monthYear, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      // Sort by date chronologically
      data = Array.from(monthlyMap.entries())
        .sort((a, b) => {
          const [monthA, yearA] = a[0].split(' ');
          const [monthB, yearB] = b[0].split(' ');
          
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // Compare years first
          if (yearA !== yearB) {
            return parseInt(yearA) - parseInt(yearB);
          }
          
          // Then compare months
          return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
        })
        .map(([month, quantity]) => ({
          name: month,
          quantity: quantity
        }));
    }
    else if (chartType === 'grade') {
      // Group by fuel grade and sum quantities
      const gradeMap = new Map();
      
      fuels.forEach(fuel => {
        if (!fuel.FuelGrade) return; // Skip entries with no grade
        
        const currentQuantity = gradeMap.get(fuel.FuelGrade) || 0;
        gradeMap.set(fuel.FuelGrade, currentQuantity + Number(fuel.QuantityReceived));
      });
      
      data = Array.from(gradeMap.entries()).map(([grade, quantity]) => ({
        name: grade || 'Unknown',
        quantity: quantity
      }));
    }

    // Sort data by quantity in descending order (except for monthly view)
    if (chartType !== 'monthly') {
      data.sort((a, b) => b.quantity - a.quantity);
    }
    
    // Limit to top entries for readability
    const limit = viewMode === 'chart' ? 10 : 9;
    if (data.length > limit && chartType !== 'monthly') {
      const topItems = data.slice(0, limit - 1);
      const othersSum = data.slice(limit - 1).reduce((sum, item) => sum + item.quantity, 0);
      
      if (othersSum > 0) {
        topItems.push({
          name: 'Others',
          quantity: othersSum
        });
      }
      
      data = topItems;
    }
    
    // Calculate percentages for tank view
    const total = data.reduce((sum, item) => sum + item.quantity, 0);
    data = data.map(item => ({
      ...item,
      percentage: (item.quantity / total) * 100
    }));
    
    setChartData(data);
  };

  const getChartColors = () => {
    switch(chartType) {
      case 'fuelType': return ['#3182CE', '#2c5282', '#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4'];
      case 'supplier': return ['#38A169', '#2f855a', '#48bb78', '#68d391', '#9ae6b4', '#c6f6d5'];
      case 'monthly': return ['#DD6B20', '#c05621', '#ed8936', '#f6ad55', '#fbd38d', '#feebc8'];
      case 'grade': return ['#805AD5', '#6b46c1', '#9f7aea', '#b794f4', '#d6bcfa', '#e9d8fd'];
      default: return ['#3182CE', '#2c5282', '#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4'];
    }
  };

  const formatValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const chartColors = getChartColors();
      const colorIndex = chartData.findIndex(item => item.name === label) % chartColors.length;
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label" style={{ color: chartColors[colorIndex] }}>{label}</p>
          <p className="tooltip-value">{`${payload[0].value.toLocaleString()} L`}</p>
          <p className="tooltip-percentage">
            {`${(payload[0].value / chartData.reduce((sum, item) => sum + item.quantity, 0) * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getCustomBarLabel = (props) => {
    const { x, y, width, value, height } = props;
    // Only show labels for bars that are large enough
    if (height < 20) return null;
    
    return (
      <text 
        x={x + width / 2} 
        y={y + 16} 
        fill="#ffffff" 
        textAnchor="middle" 
        fontSize={12}
        fontWeight={500}
      >
        {formatValue(value)}
      </text>
    );
  };

  const getColorByIndex = (index) => {
    const baseColors = getChartColors();
    
    // Use gray for "Others" category
    if (chartType !== 'monthly' && 
        index === chartData.length - 1 && 
        chartData[index].name === 'Others') {
      return '#A0AEC0';
    }
    
    return baseColors[index % baseColors.length];
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
                {formatValue(quantity)} L
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
    <div className="main-container">
      {/* Add Sidebar component */}
      <Sidebar />
      
      <div className="fuel-visualization-container">
        <div className="visualization-header">
          <div className="visualization-title">
            {viewMode === 'chart' ? (
              <BarChart3 className="chart-icon" size={22} />
            ) : (
              <Droplet className="chart-icon" size={22} />
            )}
            <h2 className="visualization-heading">Fuel Quantity Analysis</h2>
          </div>
          
          <div className="visualization-actions">
            <div className="view-mode-toggle">
              <button
                className={`view-mode-button ${viewMode === 'chart' ? 'active' : ''}`}
                onClick={() => setViewMode('chart')}
                title="Chart View"
              >
                <BarChart3 size={18} />
              </button>
              <button
                className={`view-mode-button ${viewMode === 'tanks' ? 'active' : ''}`}
                onClick={() => setViewMode('tanks')}
                title="Tank View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            
            <div className="chart-selector">
              <Filter className="filter-icon" size={18} />
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className="chart-type-select"
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
              <RefreshCcw size={18} className={loading ? "loading-spinner" : ""} />
              <span>{loading ? "Loading..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="error-state">
            <AlertCircle size={30} />
            <p>Failed to load data: {error}</p>
            <button onClick={fetchFuelData} className="retry-button">Retry</button>
          </div>
        ) : loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading visualization data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="empty-state">
            <p>No data available for this view</p>
            <button onClick={fetchFuelData} className="retry-button">Refresh Data</button>
          </div>
        ) : viewMode === 'chart' ? (
          // Bar Chart View
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                barGap={4}
                barSize={chartData.length > 8 ? 24 : 32}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#4A5568', fontSize: 12 }} 
                  angle={chartData.length > 5 ? -45 : 0}
                  textAnchor={chartData.length > 5 ? "end" : "middle"}
                  height={chartData.length > 5 ? 70 : 50}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  tickFormatter={formatValue}
                  tick={{ fill: '#4A5568', fontSize: 12 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => `Quantity (Liters)`}
                  wrapperStyle={{ paddingTop: 20 }}
                />
                <Bar 
                  dataKey="quantity" 
                  name="Quantity (L)" 
                  label={getCustomBarLabel}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={getColorByIndex(index)}
                      fillOpacity={0.9}
                      stroke={getColorByIndex(index)}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          // Tank View
          <div className="fuel-tanks-grid">
            {chartData.map((item, index) => (
              <FuelTank 
                key={item.name}
                name={item.name}
                quantity={item.quantity}
                percentage={item.percentage}
                index={index}
              />
            ))}
          </div>
        )}
        
        {/* Summary Statistics - Shared between both views */}
        <div className="visualization-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">
                {formatValue(chartData.reduce((sum, item) => sum + item.quantity, 0))}
              </span>
              <span className="stat-label">Total Quantity</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">
                {chartData.length}
              </span>
              <span className="stat-label">{chartType === 'fuelType' ? 'Fuel Types' : 
                      chartType === 'supplier' ? 'Suppliers' : 
                      chartType === 'monthly' ? 'Months' : 'Grades'}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">
                {formatValue(Math.max(...chartData.map(item => item.quantity)))}
              </span>
              <span className="stat-label">Highest Amount</span>
            </div>
          </div>
          
          {/* Note about "Others" category */}
          {chartType !== 'monthly' && 
           chartData.length === (viewMode === 'chart' ? 10 : 9) && 
           chartData[chartData.length - 1].name === 'Others' && (
            <div className="chart-note">
              <p>* "Others" category represents combined data from smaller entries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelVisualization;