import React, { useState } from 'react';
import '../css/AddFuel.css';

const AddFuel = ({ onAddSupplier, handleCloseModal }) => {
  const [fuelData, setFuelData] = useState({
    StockId: '',
    FuelType: '',
    FuelGrade: '',
    QuantityReceived: '',
    TankAllocation: '',
    TankId: '',
    CurrentTankLevel: '',
    SupplierId: '',
    SupplierName: '',
    InvoiceNumber: '',
    OrderId: '',
    UnitPrice: '',
    DeliveryDate: '',
    DeliveryTime: '',
    FuelDensityTestResult: '',
    VehicleNumber: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuelData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];
    if (!fuelData.StockId) errors.StockId = 'Stock ID is required';
    if (!fuelData.FuelType) errors.FuelType = 'Fuel Type is required';
    if (!fuelData.FuelGrade) errors.FuelGrade = 'Fuel Grade is required';
    if (!fuelData.QuantityReceived || fuelData.QuantityReceived <= 0)
      errors.QuantityReceived = 'Quantity Received must be a positive number';
    if (!fuelData.TankAllocation) errors.TankAllocation = 'Tank Allocation is required';
    if (!fuelData.TankId) errors.TankId = 'Tank ID is required';
    if (!fuelData.SupplierId) errors.SupplierId = 'Supplier ID is required';
    if (!fuelData.SupplierName) errors.SupplierName = 'Supplier Name is required';
    if (!fuelData.InvoiceNumber) errors.InvoiceNumber = 'Invoice Number is required';
    if (!fuelData.OrderId) errors.OrderId = 'Order ID is required';
    if (!fuelData.UnitPrice || fuelData.UnitPrice <= 0)
      errors.UnitPrice = 'Unit Price must be a positive number';
    if (!fuelData.DeliveryDate) {
      errors.DeliveryDate = 'Contract Start Date is required';
    } else if (fuelData.DeliveryDate < today) {
      errors.DeliveryDate = 'Contract Start Date cannot be in the past';
    }
    if (!fuelData.DeliveryTime) errors.DeliveryTime = 'Delivery Time is required';
    if (!fuelData.FuelDensityTestResult || fuelData.FuelDensityTestResult <= 0)
      errors.FuelDensityTestResult = 'Fuel Density Test Result must be a positive number';
    if (!fuelData.VehicleNumber) errors.VehicleNumber = 'Vehicle Number is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await fetch(`${API_URL}/addfuel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fuelData),
      });
      alert('Fuel added successfully!');
      onAddSupplier(); 
      handleCloseModal();
      // Clear the form after successful submission
      setFuelData({
        StockId: '',
        FuelType: '',
        FuelGrade: '',
        QuantityReceived: '',
        TankAllocation: '',
        TankId: '',
        CurrentTankLevel: '',
        SupplierId: '',
        SupplierName: '',
        InvoiceNumber: '',
        OrderId: '',
        UnitPrice: '',
        DeliveryDate: '',
        DeliveryTime: '',
        FuelDensityTestResult: '',
        VehicleNumber: '',
      });
    } catch (error) {
      console.error('Error adding fuel:', error);
    }
  };

  return (
    <div>
      <h2>Add Fuel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stock ID:</label>
          <input
            type="text"
            name="StockId"
            value={fuelData.StockId}
            onChange={handleChange}
            placeholder="Enter Stock ID"
          />
          {errors.StockId && <p className="error">{errors.StockId}</p>}
        </div>
        <div>
          <label>Fuel Type:</label>
          <input
            type="text"
            name="FuelType"
            value={fuelData.FuelType}
            onChange={handleChange}
            placeholder="Enter Fuel Type"
          />
          {errors.FuelType && <p className="error">{errors.FuelType}</p>}
        </div>
        <div>
          <label>Fuel Grade:</label>
          <input
            type="text"
            name="FuelGrade"
            value={fuelData.FuelGrade}
            onChange={handleChange}
            placeholder="Enter Fuel Grade"
          />
          {errors.FuelGrade && <p className="error">{errors.FuelGrade}</p>}
        </div>
        <div>
          <label>Quantity Received:</label>
          <input
            type="number"
            name="QuantityReceived"
            value={fuelData.QuantityReceived}
            onChange={handleChange}
            placeholder="Enter Quantity Received"
          />
          {errors.QuantityReceived && <p className="error">{errors.QuantityReceived}</p>}
        </div>
        <div>
          <label>Tank Allocation:</label>
          <input
            type="text"
            name="TankAllocation"
            value={fuelData.TankAllocation}
            onChange={handleChange}
            placeholder="Enter Tank Allocation"
          />
          {errors.TankAllocation && <p className="error">{errors.TankAllocation}</p>}
        </div>
        <div>
          <label>Tank ID:</label>
          <input
            type="text"
            name="TankId"
            value={fuelData.TankId}
            onChange={handleChange}
            placeholder="Enter Tank ID"
          />
          {errors.TankId && <p className="error">{errors.TankId}</p>}
        </div>
        <div>
          <label>Current Tank Level:</label>
          <input
            type="number"
            name="CurrentTankLevel"
            value={fuelData.CurrentTankLevel}
            onChange={handleChange}
            placeholder="Enter Current Tank Level"
          />
        </div>
        <div>
          <label>Supplier ID:</label>
          <input
            type="text"
            name="SupplierId"
            value={fuelData.SupplierId}
            onChange={handleChange}
            placeholder="Enter Supplier ID"
          />
          {errors.SupplierId && <p className="error">{errors.SupplierId}</p>}
        </div>
        <div>
          <label>Supplier Name:</label>
          <input
            type="text"
            name="SupplierName"
            value={fuelData.SupplierName}
            onChange={handleChange}
            placeholder="Enter Supplier Name"
          />
          {errors.SupplierName && <p className="error">{errors.SupplierName}</p>}
        </div>
        <div>
          <label>Invoice Number:</label>
          <input
            type="number"
            name="InvoiceNumber"
            value={fuelData.InvoiceNumber}
            onChange={handleChange}
            placeholder="Enter Invoice Number"
          />
          {errors.InvoiceNumber && <p className="error">{errors.InvoiceNumber}</p>}
        </div>
        <div>
          <label>Order ID:</label>
          <input
            type="text"
            name="OrderId"
            value={fuelData.OrderId}
            onChange={handleChange}
            placeholder="Enter Order ID"
          />
          {errors.OrderId && <p className="error">{errors.OrderId}</p>}
        </div>
        <div>
          <label>Unit Price:</label>
          <input
            type="number"
            name="UnitPrice"
            value={fuelData.UnitPrice}
            onChange={handleChange}
            placeholder="Enter Unit Price"
          />
          {errors.UnitPrice && <p className="error">{errors.UnitPrice}</p>}
        </div>
        <div>
          <label>Delivery Date:</label>
          <input
            type="date"
            name="DeliveryDate"
            value={fuelData.DeliveryDate}
            onChange={handleChange}
            placeholder="Select Delivery Date"
          />
          {errors.DeliveryDate && <p className="error">{errors.DeliveryDate}</p>}
        </div>
        <div>
          <label>Delivery Time:</label>
          <input
            type="time"
            name="DeliveryTime"
            value={fuelData.DeliveryTime}
            onChange={handleChange}
            placeholder="Select Delivery Time"
          />
          {errors.DeliveryTime && <p className="error">{errors.DeliveryTime}</p>}
        </div>
        <div>
          <label>Fuel Density Test Result:</label>
          <input
            type="number"
            name="FuelDensityTestResult"
            value={fuelData.FuelDensityTestResult}
            onChange={handleChange}
            placeholder="Enter Fuel Density Test Result"
          />
          {errors.FuelDensityTestResult && <p className="error">{errors.FuelDensityTestResult}</p>}
        </div>
        <div>
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="VehicleNumber"
            value={fuelData.VehicleNumber}
            onChange={handleChange}
            placeholder="Enter Vehicle Number"
          />
          {errors.VehicleNumber && <p className="error">{errors.VehicleNumber}</p>}
        </div>
        <button type="submit">Add Fuel</button>
      </form>
    </div>
  );
};

export default AddFuel;
