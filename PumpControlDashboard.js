import React, { useState } from 'react';
import '../css/PumpControlDashboard.css';
import Sidebar from './Sidebar';

const PumpControlDashboard = () => {
  const [pumps, setPumps] = useState([
    {
      id: 1,
      fuelType: "Petrol",
      status: "Active",
      quantityDispensed: 0,
      pricePerLiter: 3.75,
      totalAmount: 0,
      operatorId: "",
      openingStock: 1000,
      closingStock: 1000,
      capacity: 2000,
      transactions: []
    },
    {
      id: 2,
      fuelType: "Diesel",
      status: "Active",
      quantityDispensed: 0,
      pricePerLiter: 3.25,
      totalAmount: 0,
      operatorId: "",
      openingStock: 1500,
      closingStock: 1500,
      capacity: 3000,
      transactions: []
    },
    {
      id: 3,
      fuelType: "Premium Petrol",
      status: "Active",
      quantityDispensed: 0,
      pricePerLiter: 4.15,
      totalAmount: 0,
      operatorId: "",
      openingStock: 800,
      closingStock: 800,
      capacity: 1500,
      transactions: []
    }
  ]);

  const [currentTransaction, setCurrentTransaction] = useState({
    pumpId: null,
    quantity: 0,
    operatorId: ""
  });

  const [refillData, setRefillData] = useState({
    pumpId: null,
    quantity: 0,
    operatorId: "",
    invoiceNumber: ""
  });

  const [priceAdjustment, setPriceAdjustment] = useState({
    pumpId: null,
    newPrice: 0
  });

  const [reports, setReports] = useState([]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPumpForHistory, setSelectedPumpForHistory] = useState(null);

  const handleStatusChange = (pumpId, newStatus) => {
    setPumps(pumps.map(pump => 
      pump.id === pumpId ? { ...pump, status: newStatus } : pump
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction({
      ...currentTransaction,
      [name]: value
    });
  };

  const handleRefillInputChange = (e) => {
    const { name, value } = e.target;
    setRefillData({
      ...refillData,
      [name]: value
    });
  };

  const handlePriceAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setPriceAdjustment({
      ...priceAdjustment,
      [name]: value
    });
  };

  const dispenseFromPump = (pumpId) => {
    if (currentTransaction.quantity <= 0 || !currentTransaction.operatorId) {
      alert("Please enter valid quantity and operator ID");
      return;
    }

    setPumps(prevPumps => {
      return prevPumps.map(pump => {
        if (pump.id === pumpId) {
          const quantity = parseFloat(currentTransaction.quantity);
          const newClosingStock = pump.closingStock - quantity;
          
          // Check if we have enough stock
          if (newClosingStock < 0) {
            alert(`Not enough stock in Pump ${pumpId}. Available: ${pump.closingStock} liters`);
            return pump;
          }
          
          const totalAmount = quantity * pump.pricePerLiter;
          const newTransaction = {
            id: Date.now(),
            type: "Dispense",
            pumpId,
            quantity,
            operatorId: currentTransaction.operatorId,
            pricePerLiter: pump.pricePerLiter,
            totalAmount,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...pump,
            quantityDispensed: pump.quantityDispensed + quantity,
            totalAmount: pump.totalAmount + totalAmount,
            closingStock: newClosingStock,
            transactions: [...pump.transactions, newTransaction]
          };
        }
        return pump;
      });
    });

    // Reset transaction form
    setCurrentTransaction({
      pumpId: null,
      quantity: 0,
      operatorId: ""
    });
  };

  const refillPump = (pumpId) => {
    if (refillData.quantity <= 0 || !refillData.operatorId || !refillData.invoiceNumber) {
      alert("Please enter valid quantity, operator ID, and invoice number");
      return;
    }

    setPumps(prevPumps => {
      return prevPumps.map(pump => {
        if (pump.id === pumpId) {
          const quantity = parseFloat(refillData.quantity);
          const newClosingStock = pump.closingStock + quantity;
          
          // Check if we have enough capacity
          if (newClosingStock > pump.capacity) {
            alert(`Exceeds pump capacity. Maximum refill allowed: ${pump.capacity - pump.closingStock} liters`);
            return pump;
          }
          
          const newTransaction = {
            id: Date.now(),
            type: "Refill",
            pumpId,
            quantity,
            operatorId: refillData.operatorId,
            invoiceNumber: refillData.invoiceNumber,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...pump,
            closingStock: newClosingStock,
            transactions: [...pump.transactions, newTransaction]
          };
        }
        return pump;
      });
    });

    // Reset refill form
    setRefillData({
      pumpId: null,
      quantity: 0,
      operatorId: "",
      invoiceNumber: ""
    });
  };

  const adjustPrice = (pumpId) => {
    if (priceAdjustment.newPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setPumps(prevPumps => {
      return prevPumps.map(pump => {
        if (pump.id === pumpId) {
          const newPrice = parseFloat(priceAdjustment.newPrice);
          
          const priceChangeRecord = {
            id: Date.now(),
            type: "PriceChange",
            pumpId,
            oldPrice: pump.pricePerLiter,
            newPrice: newPrice,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...pump,
            pricePerLiter: newPrice,
            transactions: [...pump.transactions, priceChangeRecord]
          };
        }
        return pump;
      });
    });

    // Reset price adjustment form
    setPriceAdjustment({
      pumpId: null,
      newPrice: 0
    });
  };

  const generateDailyReport = () => {
    const dailyReport = pumps.map(pump => ({
      pumpId: pump.id,
      fuelType: pump.fuelType,
      openingStock: pump.openingStock,
      closingStock: pump.closingStock,
      totalDispensed: pump.quantityDispensed,
      totalAmount: pump.totalAmount,
      transactions: pump.transactions.length,
      date: reportDate
    }));
    
    setReports([...reports, ...dailyReport]);
    alert("Daily report generated successfully!");
  };

  const resetDailyStocks = () => {
    // Generate a report before resetting
    const dailyReport = pumps.map(pump => ({
      pumpId: pump.id,
      fuelType: pump.fuelType,
      openingStock: pump.openingStock,
      closingStock: pump.closingStock,
      totalDispensed: pump.quantityDispensed,
      totalAmount: pump.totalAmount,
      transactions: pump.transactions.length,
      date: reportDate
    }));
    
    // Add the final report for the day before resetting
    setReports(prevReports => [...prevReports, ...dailyReport]);
    
    // Reset pumps for the new day
    setPumps(prevPumps => prevPumps.map(pump => ({
      ...pump,
      openingStock: pump.closingStock,
      quantityDispensed: 0,
      totalAmount: 0,
      transactions: []
    })));
    
    alert("Stocks reset for new day. Opening stock set to previous closing stock. Daily report saved.");
    
    // Set the report date to today
    setReportDate(new Date().toISOString().slice(0, 10));
  };

  const renderPumpCards = () => {
    return (
      <div className="pump-grid">
        {pumps.map(pump => (
          <div key={pump.id} className="pump-card">
            <div className="pump-header">
              <h2 className="pump-title">Pump #{pump.id}</h2>
              <span 
                className={`status-badge ${
                  pump.status === "Active" 
                    ? "status-active" 
                    : pump.status === "Inactive" 
                    ? "status-inactive" 
                    : "status-maintenance"
                }`}
              >
                {pump.status}
              </span>
            </div>
            
            <div className="pump-details">
              <p className="detail-item"><span className="detail-label">Fuel Type:</span> {pump.fuelType}</p>
              <p className="detail-item"><span className="detail-label">Price:</span> Rs.{pump.pricePerLiter.toFixed(2)}/liter</p>
              <div className="stock-visual">
                <div className="stock-bar">
                  <div 
                    className="stock-level" 
                    style={{ width: `${(pump.closingStock / pump.capacity) * 100}%` }}
                  >
                    {Math.round((pump.closingStock / pump.capacity) * 100)}%
                  </div>
                </div>
                <div className="stock-details">
                  <span>{pump.closingStock.toFixed(2)}/{pump.capacity} liters</span>
                </div>
              </div>
              <p className="detail-item"><span className="detail-label">Dispensed Today:</span> {pump.quantityDispensed.toFixed(2)} liters</p>
              <p className="detail-item"><span className="detail-label">Total Sales:</span> Rs.{pump.totalAmount.toFixed(2)}</p>
              <button 
                onClick={() => setSelectedPumpForHistory(pump.id)} 
                className="btn-view-history"
              >
                View Transaction History
              </button>
            </div>
            
            <div className="controls-section">
              <label className="controls-label">Change Status:</label>
              <div className="button-group">
                <button 
                  onClick={() => handleStatusChange(pump.id, "Active")}
                  className="btn btn-active"
                >
                  Active
                </button>
                <button 
                  onClick={() => handleStatusChange(pump.id, "Inactive")}
                  className="btn btn-inactive"
                >
                  Inactive
                </button>
                <button 
                  onClick={() => handleStatusChange(pump.id, "Maintenance")}
                  className="btn btn-maintenance"
                >
                  Maintenance
                </button>
              </div>
            </div>
            
            {pump.status === "Active" && (
              <>
                <div className="dispense-section">
                  <h3 className="dispense-title">Dispense Fuel</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Quantity (Liters):</label>
                    <input 
                      type="number" 
                      name="quantity"
                      value={currentTransaction.pumpId === pump.id ? currentTransaction.quantity : ""}
                      onChange={(e) => {
                        setCurrentTransaction({
                          ...currentTransaction,
                          pumpId: pump.id,
                          quantity: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Operator ID:</label>
                    <input 
                      type="text" 
                      name="operatorId"
                      value={currentTransaction.pumpId === pump.id ? currentTransaction.operatorId : ""}
                      onChange={(e) => {
                        setCurrentTransaction({
                          ...currentTransaction,
                          pumpId: pump.id,
                          operatorId: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter operator ID"
                    />
                  </div>
                  
                  <button 
                    onClick={() => dispenseFromPump(pump.id)}
                    className="btn-dispense"
                    disabled={pump.status !== "Active"}
                  >
                    Dispense Fuel
                  </button>
                </div>
                
                <div className="refill-section">
                  <h3 className="refill-title">Refill Stock</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Quantity (Liters):</label>
                    <input 
                      type="number" 
                      name="quantity"
                      value={refillData.pumpId === pump.id ? refillData.quantity : ""}
                      onChange={(e) => {
                        setRefillData({
                          ...refillData,
                          pumpId: pump.id,
                          quantity: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Operator ID:</label>
                    <input 
                      type="text" 
                      name="operatorId"
                      value={refillData.pumpId === pump.id ? refillData.operatorId : ""}
                      onChange={(e) => {
                        setRefillData({
                          ...refillData,
                          pumpId: pump.id,
                          operatorId: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter operator ID"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Invoice Number:</label>
                    <input 
                      type="text" 
                      name="invoiceNumber"
                      value={refillData.pumpId === pump.id ? refillData.invoiceNumber : ""}
                      onChange={(e) => {
                        setRefillData({
                          ...refillData,
                          pumpId: pump.id,
                          invoiceNumber: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter invoice number"
                    />
                  </div>
                  
                  <button 
                    onClick={() => refillPump(pump.id)}
                    className="btn-refill"
                    disabled={pump.status !== "Active"}
                  >
                    Refill Stock
                  </button>
                </div>
                
                <div className="price-section">
                  <h3 className="price-title">Adjust Price</h3>
                  
                  <div className="form-group">
                    <label className="form-label">New Price (Rs./liter):</label>
                    <input 
                      type="number" 
                      name="newPrice"
                      value={priceAdjustment.pumpId === pump.id ? priceAdjustment.newPrice : ""}
                      onChange={(e) => {
                        setPriceAdjustment({
                          ...priceAdjustment,
                          pumpId: pump.id,
                          newPrice: e.target.value
                        });
                      }}
                      className="form-input"
                      placeholder="Enter new price"
                    />
                  </div>
                  
                  <button 
                    onClick={() => adjustPrice(pump.id)}
                    className="btn-price"
                    disabled={pump.status !== "Active"}
                  >
                    Update Price
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="reports-container">
        <h2 className="reports-title">Daily Reports</h2>
        
        <div className="reports-controls">
          <div>
            <label className="form-label">Report Date:</label>
            <input 
              type="date" 
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="form-input"
            />
          </div>
          
          <button 
            onClick={generateDailyReport}
            className="btn-generate"
          >
            Generate Daily Report
          </button>
          
          <button 
            onClick={resetDailyStocks}
            className="btn-reset"
          >
            Reset for New Day
          </button>
        </div>
        
        {reports.length > 0 && (
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">Date</th>
                  <th className="table-cell">Pump ID</th>
                  <th className="table-cell">Fuel Type</th>
                  <th className="table-cell">Opening Stock</th>
                  <th className="table-cell">Closing Stock</th>
                  <th className="table-cell">Total Dispensed</th>
                  <th className="table-cell">Total Amount</th>
                  <th className="table-cell">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{report.date}</td>
                    <td className="table-cell">{report.pumpId}</td>
                    <td className="table-cell">{report.fuelType}</td>
                    <td className="table-cell">{report.openingStock.toFixed(2)}</td>
                    <td className="table-cell">{report.closingStock.toFixed(2)}</td>
                    <td className="table-cell">{report.totalDispensed.toFixed(2)}</td>
                    <td className="table-cell">Rs.{report.totalAmount.toFixed(2)}</td>
                    <td className="table-cell">{report.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTransactionHistory = () => {
    if (!selectedPumpForHistory) {
      return (
        <div className="history-container">
          <h2 className="history-title">Transaction History</h2>
          <p>Select a pump to view its transaction history.</p>
        </div>
      );
    }

    const pump = pumps.find(p => p.id === selectedPumpForHistory);
    
    return (
      <div className="history-container">
        <div className="history-header">
          <h2 className="history-title">
            Transaction History - Pump #{selectedPumpForHistory} ({pump.fuelType})
          </h2>
          <button 
            onClick={() => setSelectedPumpForHistory(null)} 
            className="btn-close"
          >
            Back to All Pumps
          </button>
        </div>
        
        {pump.transactions.length === 0 ? (
          <p>No transactions recorded for this pump.</p>
        ) : (
          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">Date & Time</th>
                  <th className="table-cell">Type</th>
                  <th className="table-cell">Quantity (Liters)</th>
                  <th className="table-cell">Operator ID</th>
                  <th className="table-cell">Price</th>
                  <th className="table-cell">Amount</th>
                  <th className="table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {pump.transactions.map((transaction) => (
                  <tr key={transaction.id} className="table-row">
                    <td className="table-cell">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="table-cell">
                      <span className={`transaction-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="table-cell">
                      {transaction.type === "PriceChange" ? "-" : transaction.quantity?.toFixed(2)}
                    </td>
                    <td className="table-cell">{transaction.operatorId || "-"}</td>
                    <td className="table-cell">
                      {transaction.type === "PriceChange" 
                        ? `Rs.${transaction.oldPrice?.toFixed(2)} → Rs.${transaction.newPrice?.toFixed(2)}`
                        : transaction.type === "Dispense"
                        ? `Rs.${transaction.pricePerLiter?.toFixed(2)}`
                        : "-"
                      }
                    </td>
                    <td className="table-cell">
                      {transaction.totalAmount ? `Rs.${transaction.totalAmount.toFixed(2)}` : "-"}
                    </td>
                    <td className="table-cell">
                      {transaction.type === "Refill" && transaction.invoiceNumber 
                        ? `Invoice: ${transaction.invoiceNumber}` 
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (selectedPumpForHistory) {
      return renderTransactionHistory();
    }
    
    return (
      <>
        {renderPumpCards()}
        {renderReports()}
      </>
    );
  };

  return (
    <div className='pump-container'>
      <Sidebar/>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Fuel Pump Control System</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default PumpControlDashboard;