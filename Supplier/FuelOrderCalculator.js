import React, { useState, useEffect } from "react";
import "../../css/fuelOrderCalculator.css"; // Import your CSS file for styling

const FuelOrderCalculator = ({ suppliers, handleCloseModal }) => {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { fuelType: "", quantity: "", unitPrice: 0, total: 0 },
  ]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Set up supplier options when component mounts
  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      setSupplierOptions(suppliers);
    }
  }, [suppliers]);

  // Handle supplier selection
  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);

    // Reset order items when supplier changes
    setOrderItems([{ fuelType: "", quantity: "", unitPrice: 0, total: 0 }]);
    calculateGrandTotal([
      { fuelType: "", quantity: "", unitPrice: 0, total: 0 },
    ]);
  };

  // Update order item details
  const handleOrderItemChange = (index, field, value) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index][field] = value;

    // If fuel type changed, update unit price
    if (field === "fuelType") {
      const supplier = supplierOptions.find((s) => s._id === selectedSupplier);
      if (supplier && supplier.Rates) {
        const rateInfo = supplier.Rates.find((r) => r.FuelType === value);
        updatedOrderItems[index].unitPrice = rateInfo
          ? parseFloat(rateInfo.UnitPrice)
          : 0;
      }
    }

    // Calculate item total
    if (field === "quantity" || field === "fuelType") {
      const quantity = parseFloat(updatedOrderItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedOrderItems[index].unitPrice) || 0;
      updatedOrderItems[index].total = (quantity * unitPrice).toFixed(2);
    }

    setOrderItems(updatedOrderItems);
    calculateGrandTotal(updatedOrderItems);
  };

  // Calculate the grand total of all order items
  const calculateGrandTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (parseFloat(item.total) || 0),
      0
    );
    setGrandTotal(total.toFixed(2));
  };

  // Add a new order item
  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { fuelType: "", quantity: "", unitPrice: 0, total: 0 },
    ]);
  };

  // Remove an order item
  const removeOrderItem = (index) => {
    if (orderItems.length === 1) {
      alert("You must have at least one order item.");
      return;
    }

    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
    calculateGrandTotal(updatedItems);
  };

  // Get available fuel types for the selected supplier
  const getAvailableFuelTypes = () => {
    if (!selectedSupplier) return [];

    const supplier = supplierOptions.find((s) => s._id === selectedSupplier);
    if (!supplier || !supplier.Rates) return [];

    return supplier.Rates.map((rate) => rate.FuelType);
  };

  return (
    <div className="fuel-calculator-container">
      <h2>Fuel Order Calculator</h2>

      <div className="form-group">
        <label>Select Supplier:</label>
        <select
          value={selectedSupplier}
          onChange={handleSupplierChange}
          className="supplier-select"
        >
          <option value="">-- Select a Supplier --</option>
          {supplierOptions.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.SupplierName}
            </option>
          ))}
        </select>
      </div>

      {selectedSupplier && (
        <>
          <div className="order-items-container">
            <h3>Order Details</h3>

            {orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-header">
                  <h4>Item {index + 1}</h4>
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeOrderItem(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="item-details">
                  <div className="form-group">
                    <label>Fuel Type:</label>
                    <select
                      value={item.fuelType}
                      onChange={(e) =>
                        handleOrderItemChange(index, "fuelType", e.target.value)
                      }
                    >
                      <option value="">-- Select Fuel Type --</option>
                      {getAvailableFuelTypes().map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quantity (Liters):</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleOrderItemChange(index, "quantity", e.target.value)
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group unit-price">
                    <label>Unit Price:</label>
                    <span>{item.unitPrice} per liter</span>
                  </div>

                  <div className="form-group total-price">
                    <label>Total:</label>
                    <span>{item.total}</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="add-item-btn"
              onClick={addOrderItem}
            >
              Add Another Item
            </button>
          </div>

          <div className="grand-total">
            <h3>Grand Total: {grandTotal}</h3>
          </div>
        </>
      )}

      <div className="calculator-buttons">
        <button
          type="button"
          className="close-button"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FuelOrderCalculator;
