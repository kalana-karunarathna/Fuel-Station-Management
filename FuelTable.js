import React, { useState, useEffect } from 'react';
import '../css/FuelTable.css';  
import '../css/EditFuel.css';
import AddFuel from './AddFuel';
import GeneratePDF from './GenarateFuelPdf';
import Sidebar from './Sidebar';

const FuelTable = () => {
  const [fuels, setFuels] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentFuel, setCurrentFuel] = useState(null);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false); 
  const [showGeneratePdf, setShowGeneratePdf] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFuelData();
  }, []);

  const fetchFuelData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/getfuel`);
      const data = await response.json();
      setFuels(data);
    } catch (error) {
      console.error('Error fetching fuel data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/searchfuel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setFuels(data);
    } catch (error) {
      console.error('Error searching fuel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await fetch(`${API_URL}/deletefuel/${id}`, { method: 'DELETE' });
        fetchFuelData();
      } catch (error) {
        console.error('Error deleting fuel:', error);
      }
    }
  };

  const handleEdit = (fuel) => {
    setEditMode(true);
    setCurrentFuel(fuel);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/updatefuel/${currentFuel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentFuel),
      });
      setEditMode(false);
      setShowEditModal(false);
      fetchFuelData();
    } catch (error) {
      console.error('Error updating fuel:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFuel((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFuel = () => {
    setShowAddFuelModal(true);
  };

  const handleCloseModal = () => {
    setShowAddFuelModal(false);
  };

  useEffect(() => {
    if (searchQuery) {
      const delaySearch = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      fetchFuelData();
    }
  }, [searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fuel-page-container">
      {/* Sidebar */}
      <Sidebar />
      <div className="fuel-table-container">
        <div className="fuel-header">
          <h2>Fuel Records</h2>
          <div className="actions">
            <button className="add-button" onClick={handleAddFuel}>
              <i className="fas fa-plus"></i> Add Fuel
            </button>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Type, Grade or Supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-button" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <GeneratePDF />
          </div>
        </div>
        
        <div className="table-responsive">
          {isLoading ? (
            <div className="loading-indicator">Loading fuel data...</div>
          ) : fuels.length === 0 ? (
            <div className="no-records">
              No fuel records found. {searchQuery ? 'Try a different search term.' : 'Add a new fuel record.'}
            </div>
          ) : (
            <table className="fuel-table">
              <thead>
                <tr>
                  <th>Stock ID</th>
                  <th>Fuel Type</th>
                  <th>Fuel Grade</th>
                  <th>Quantity</th>
                  <th>Tank ID</th>
                  <th>Supplier</th>
                  <th>Invoice #</th>
                  <th>Order ID</th>
                  <th>Unit Price</th>
                  <th>Delivery Date</th>
                  <th>Delivery Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fuels.map((fuel) => (
                  <tr key={fuel._id}>
                    <td>{fuel.StockId}</td>
                    <td>{fuel.FuelType}</td>
                    <td>{fuel.FuelGrade}</td>
                    <td>{fuel.QuantityReceived}</td>
                    <td>{fuel.TankId}</td>
                    <td>{fuel.SupplierName}</td>
                    <td>{fuel.InvoiceNumber}</td>
                    <td>{fuel.OrderId}</td>
                    <td>${Number(fuel.UnitPrice).toFixed(2)}</td>
                    <td>{formatDate(fuel.DeliveryDate)}</td>
                    <td>{fuel.DeliveryTime}</td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEdit(fuel)}
                        title="Edit record"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(fuel._id)}
                        title="Delete record"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showEditModal && editMode && currentFuel && (
          <div className="modal-overlay-edit">
            <div className="modal-content-edit">
              <h3>Update Fuel Record</h3>
              <div className="edit-form">
                <div className="form-group">
                  <label>Stock ID</label>
                  <input type="text" name="StockId" value={currentFuel.StockId || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fuel Type</label>
                  <input type="text" name="FuelType" value={currentFuel.FuelType || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fuel Grade</label>
                  <input type="text" name="FuelGrade" value={currentFuel.FuelGrade || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="QuantityReceived" value={currentFuel.QuantityReceived || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Tank ID</label>
                  <input type="text" name="TankId" value={currentFuel.TankId || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input type="text" name="SupplierName" value={currentFuel.SupplierName || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Invoice Number</label>
                  <input type="number" name="InvoiceNumber" value={currentFuel.InvoiceNumber || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Order ID</label>
                  <input type="text" name="OrderId" value={currentFuel.OrderId || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Unit Price</label>
                  <input type="number" name="UnitPrice" value={currentFuel.UnitPrice || ''} onChange={handleChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Delivery Date</label>
                  <input type="date" name="DeliveryDate" value={currentFuel.DeliveryDate ? currentFuel.DeliveryDate.split('T')[0] : ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Delivery Time</label>
                  <input type="time" name="DeliveryTime" value={currentFuel.DeliveryTime || ''} onChange={handleChange} />
                </div>
                <div className="form-actions">
                  <button className="update-button" onClick={handleUpdate}>Update Record</button>
                  <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showGeneratePdf && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={() => setShowGeneratePdf(false)}>Close</button>
              <GeneratePDF />
            </div>
          </div>
        )}

        {showAddFuelModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={handleCloseModal}>Close</button>
              <AddFuel onAddSupplier={fetchFuelData} handleCloseModal={handleCloseModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelTable;