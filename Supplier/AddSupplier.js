// import React, { useState } from 'react';
// import '../css/addSupplier.css';

// const AddSupplier = ({ onAddSupplier, handleCloseModal }) => {
//   const [supplierData, setSupplierData] = useState({
//     SupplierId: '',
//     SupplierName: '',
//     CompanyAddress: '',
//     Email: '',
//     PrimaryContactPerson: '',
//     BusinessRegistrationNumber: '',
//     ContractStartDate: '',
//     TaxIdentificationNumber: '',

//   });

//   const [errors, setErrors] = useState({});
//   const [supplierExists, setSupplierExists] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSupplierData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateFields = () => {
//     const errors = {};
//     const today = new Date().toISOString().split('T')[0];
//     if (!supplierData.SupplierId) errors.SupplierId = 'Supplier ID is required';
//     if (!supplierData.SupplierName) errors.SupplierName = 'Supplier Name is required';
//     if (!supplierData.CompanyAddress) errors.CompanyAddress = 'Company Address is required';
//     if (!supplierData.Email) {
//         errors.Email = 'Email Address is required';
//       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.Email)) {
//         errors.Email = 'Invalid Email Address';
//       }
//     if (!supplierData.PrimaryContactPerson) errors.PrimaryContactPerson = 'Primary Contact Person is required';
//     if (!supplierData.BusinessRegistrationNumber) errors.BusinessRegistrationNumber = 'Business Registration Number is required';
//     if (!supplierData.ContractStartDate) {
//       errors.ContractStartDate = 'Contract Start Date is required';
//     } else if (supplierData.ContractStartDate < today) {
//       errors.ContractStartDate = 'Contract Start Date cannot be in the past';
//     }
//     if (!supplierData.TaxIdentificationNumber) errors.TaxIdentificationNumber = 'Tax Identification Number is required';

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateFields()) {
//       return;
//     }
//     const API_URL = process.env.REACT_APP_API_URL;

//     try {
//       const response = await fetch(`${API_URL}/searchsupplier`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query: supplierData.SupplierName }),
//       });
//       const data = await response.json();
//       if (data.length > 0) {
//         setSupplierExists(true);
//         return; // Stop execution if the supplier exists
//       } else {
//         setSupplierExists(false); // Reset if no duplicate found
//       }
//     } catch (error) {
//       console.error('Error checking supplier:', error);
//     }

//     try {
//       await fetch(`${API_URL}/addsupplier`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(supplierData),
//       });
//       alert('Supplier added successfully!');
//       onAddSupplier();
//       handleCloseModal();
//       setSupplierData({
//         SupplierId: '',
//         SupplierName: '',
//         CompanyAddress: '',
//         Email: '',
//         PrimaryContactPerson: '',
//         BusinessRegistrationNumber: '',
//         ContractStartDate: '',
//         TaxIdentificationNumber: '',

//       });
//     } catch (error) {
//       console.error('Error adding supplier:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Supplier</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Supplier Id:</label>
//           <input
//             type="text"
//             name="SupplierId"
//             value={supplierData.SupplierId}
//             onChange={handleChange}
//             placeholder="Enter Supplier Id"
//           />
//           {errors.SupplierId && <p className="error">{errors.SupplierId}</p>}
//         </div>
//         <div>
//           <label>Supplier Name:</label>
//           <input
//             type="text"
//             name="SupplierName"
//             value={supplierData.SupplierName}
//             onChange={handleChange}
//             placeholder="Enter Supplier Name"
//           />
//           {errors.SupplierName && <p className="error">{errors.SupplierName}</p>}
//         </div>
//         <div>
//           <label>Company Address:</label>
//           <input
//             type="text"
//             name="CompanyAddress"
//             value={supplierData.CompanyAddress}
//             onChange={handleChange}
//             placeholder="Enter Company Address"
//           />
//           {errors.CompanyAddress && <p className="error">{errors.CompanyAddress}</p>}
//         </div>
//         <div>
//           <label>Email:</label>
//           <input
//             type="text"
//             name="Email"
//             value={supplierData.Email}
//             onChange={handleChange}
//             placeholder="Enter Email Address."
//           />
//           {errors.Email && <p className="error">{errors.Email}</p>}
//         </div>
//         <div>
//           <label>Primary Contact Person:</label>
//           <input
//             type="text"
//             name="PrimaryContactPerson"
//             value={supplierData.PrimaryContactPerson}
//             onChange={handleChange}
//             placeholder="Enter Primary Contact Person"
//           />
//           {errors.PrimaryContactPerson && <p className="error">{errors.PrimaryContactPerson}</p>}
//         </div>
//         <div>
//           <label>Business Registration Number:</label>
//           <input
//             type="text"
//             name="BusinessRegistrationNumber"
//             value={supplierData.BusinessRegistrationNumber}
//             onChange={handleChange}
//             placeholder="Enter Business Registration Number"
//           />
//           {errors.BusinessRegistrationNumber && <p className="error">{errors.BusinessRegistrationNumber}</p>}
//         </div>
//         <div>
//           <label>Contract Start Date:</label>
//           <input
//             type="date"
//             name="ContractStartDate"
//             value={supplierData.ContractStartDate}
//             onChange={handleChange}
//             placeholder="Enter Contract Start Date"
//           />
//             {errors.ContractStartDate && <p className="error">{errors.ContractStartDate}</p>}
//         </div>
//         <div>
//           <label>Tax Identification Number:</label>
//           <input
//             type="number"
//             name="TaxIdentificationNumber"
//             value={supplierData.TaxIdentificationNumber}
//             onChange={handleChange}
//             placeholder="Enter Tax Identification Number"
//           />
//           {errors.TaxIdentificationNumber && <p className="error">{errors.TaxIdentificationNumber}</p>}
//         </div>
//         {supplierExists && <p className="error">This supplier is already registered.</p>}
//         <button type="submit">Add Supplier</button>
//       </form>
//     </div>
//   );
// };

// export default AddSupplier;
import React, { useState } from "react";
import "../../css/addSupplier.css";
import "../../css/supplierRates.css";

const AddSupplier = ({ onAddSupplier, handleCloseModal }) => {
  const [supplierData, setSupplierData] = useState({
    SupplierId: "",
    SupplierName: "",
    CompanyAddress: "",
    Email: "",
    PrimaryContactPerson: "",
    BusinessRegistrationNumber: "",
    ContractStartDate: "",
    TaxIdentificationNumber: "",
    Rates: [
      {
        FuelType: "",
        UnitPrice: "",
        Currency: "USD",
        EffectiveDate: new Date().toISOString().split("T")[0],
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [supplierExists, setSupplierExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRateChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRates = [...supplierData.Rates];
    updatedRates[index] = { ...updatedRates[index], [name]: value };
    setSupplierData((prev) => ({ ...prev, Rates: updatedRates }));
  };

  const addRate = () => {
    setSupplierData((prev) => ({
      ...prev,
      Rates: [
        ...prev.Rates,
        {
          FuelType: "",
          UnitPrice: "",
          Currency: "USD",
          EffectiveDate: new Date().toISOString().split("T")[0],
        },
      ],
    }));
  };

  const removeRate = (index) => {
    if (supplierData.Rates.length > 1) {
      const updatedRates = [...supplierData.Rates];
      updatedRates.splice(index, 1);
      setSupplierData((prev) => ({ ...prev, Rates: updatedRates }));
    }
  };

  const validateFields = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];
    if (!supplierData.SupplierId) errors.SupplierId = "Supplier ID is required";
    if (!supplierData.SupplierName)
      errors.SupplierName = "Supplier Name is required";
    if (!supplierData.CompanyAddress)
      errors.CompanyAddress = "Company Address is required";
    if (!supplierData.Email) {
      errors.Email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.Email)) {
      errors.Email = "Invalid Email Address";
    }
    if (!supplierData.PrimaryContactPerson)
      errors.PrimaryContactPerson = "Primary Contact Person is required";
    if (!supplierData.BusinessRegistrationNumber)
      errors.BusinessRegistrationNumber =
        "Business Registration Number is required";
    if (!supplierData.ContractStartDate) {
      errors.ContractStartDate = "Contract Start Date is required";
    } else if (supplierData.ContractStartDate < today) {
      errors.ContractStartDate = "Contract Start Date cannot be in the past";
    }
    if (!supplierData.TaxIdentificationNumber)
      errors.TaxIdentificationNumber = "Tax Identification Number is required";

    // Validate rates
    const rateErrors = [];
    supplierData.Rates.forEach((rate, index) => {
      const rateError = {};
      if (!rate.FuelType) rateError.FuelType = "Fuel Type is required";
      if (!rate.UnitPrice) rateError.UnitPrice = "Unit Price is required";
      if (Object.keys(rateError).length > 0) {
        rateErrors[index] = rateError;
      }
    });

    if (rateErrors.length > 0) {
      errors.Rates = rateErrors;
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    const API_URL = process.env.REACT_APP_API_URL_SUP;

    try {
      const response = await fetch(`${API_URL}/searchsupplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: supplierData.SupplierName }),
      });
      const data = await response.json();
      if (data.length > 0) {
        setSupplierExists(true);
        return; // Stop execution if the supplier exists
      } else {
        setSupplierExists(false); // Reset if no duplicate found
      }
    } catch (error) {
      console.error("Error checking supplier:", error);
    }

    try {
      await fetch(`${API_URL}/addsupplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });
      alert("Supplier added successfully!");
      onAddSupplier();
      handleCloseModal();
      setSupplierData({
        SupplierId: "",
        SupplierName: "",
        CompanyAddress: "",
        Email: "",
        PrimaryContactPerson: "",
        BusinessRegistrationNumber: "",
        ContractStartDate: "",
        TaxIdentificationNumber: "",
        Rates: [
          {
            FuelType: "",
            UnitPrice: "",
            Currency: "USD",
            EffectiveDate: new Date().toISOString().split("T")[0],
          },
        ],
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  return (
    <div>
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Supplier Id:</label>
          <input
            type="text"
            name="SupplierId"
            value={supplierData.SupplierId}
            onChange={handleChange}
            placeholder="Enter Supplier Id"
          />
          {errors.SupplierId && <p className="error">{errors.SupplierId}</p>}
        </div>
        <div>
          <label>Supplier Name:</label>
          <input
            type="text"
            name="SupplierName"
            value={supplierData.SupplierName}
            onChange={handleChange}
            placeholder="Enter Supplier Name"
          />
          {errors.SupplierName && (
            <p className="error">{errors.SupplierName}</p>
          )}
        </div>
        <div>
          <label>Company Address:</label>
          <input
            type="text"
            name="CompanyAddress"
            value={supplierData.CompanyAddress}
            onChange={handleChange}
            placeholder="Enter Company Address"
          />
          {errors.CompanyAddress && (
            <p className="error">{errors.CompanyAddress}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="Email"
            value={supplierData.Email}
            onChange={handleChange}
            placeholder="Enter Email Address."
          />
          {errors.Email && <p className="error">{errors.Email}</p>}
        </div>
        <div>
          <label>Primary Contact Person:</label>
          <input
            type="text"
            name="PrimaryContactPerson"
            value={supplierData.PrimaryContactPerson}
            onChange={handleChange}
            placeholder="Enter Primary Contact Person"
          />
          {errors.PrimaryContactPerson && (
            <p className="error">{errors.PrimaryContactPerson}</p>
          )}
        </div>
        <div>
          <label>Business Registration Number:</label>
          <input
            type="text"
            name="BusinessRegistrationNumber"
            value={supplierData.BusinessRegistrationNumber}
            onChange={handleChange}
            placeholder="Enter Business Registration Number"
          />
          {errors.BusinessRegistrationNumber && (
            <p className="error">{errors.BusinessRegistrationNumber}</p>
          )}
        </div>
        <div>
          <label>Contract Start Date:</label>
          <input
            type="date"
            name="ContractStartDate"
            value={supplierData.ContractStartDate}
            onChange={handleChange}
            placeholder="Enter Contract Start Date"
          />
          {errors.ContractStartDate && (
            <p className="error">{errors.ContractStartDate}</p>
          )}
        </div>
        <div>
          <label>Tax Identification Number:</label>
          <input
            type="number"
            name="TaxIdentificationNumber"
            value={supplierData.TaxIdentificationNumber}
            onChange={handleChange}
            placeholder="Enter Tax Identification Number"
          />
          {errors.TaxIdentificationNumber && (
            <p className="error">{errors.TaxIdentificationNumber}</p>
          )}
        </div>

        {/* Supplier Rates Section */}
        <div className="rates-section">
          <h3>Supplier Rates</h3>
          {supplierData.Rates.map((rate, index) => (
            <div key={index} className="rate-item">
              <div className="rate-header">
                <h4>Rate {index + 1}</h4>
                {supplierData.Rates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRate(index)}
                    className="remove-rate-btn"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="rate-inputs">
                <div>
                  <label>Fuel Type:</label>
                  <select
                    name="FuelType"
                    value={rate.FuelType}
                    onChange={(e) => handleRateChange(index, e)}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Premium Petrol">Premium Petrol</option>
                    <option value="Premium Diesel">Premium Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="LPG">LPG</option>
                    <option value="Electric">Electric Charging</option>
                    <option value="Biodiesel">Biodiesel</option>
                    <option value="Ethanol">Ethanol</option>
                  </select>
                  {errors.Rates &&
                    errors.Rates[index] &&
                    errors.Rates[index].FuelType && (
                      <p className="error">{errors.Rates[index].FuelType}</p>
                    )}
                </div>

                <div>
                  <label>Unit Price:</label>
                  <input
                    type="number"
                    name="UnitPrice"
                    value={rate.UnitPrice}
                    onChange={(e) => handleRateChange(index, e)}
                    placeholder="Enter Unit Price"
                    step="0.01"
                  />
                  {errors.Rates &&
                    errors.Rates[index] &&
                    errors.Rates[index].UnitPrice && (
                      <p className="error">{errors.Rates[index].UnitPrice}</p>
                    )}
                </div>

                <div>
                  <label>Currency:</label>
                  <select
                    name="Currency"
                    value={rate.Currency}
                    onChange={(e) => handleRateChange(index, e)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label>Effective Date:</label>
                  <input
                    type="date"
                    name="EffectiveDate"
                    value={rate.EffectiveDate}
                    onChange={(e) => handleRateChange(index, e)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addRate} className="add-rate-btn">
            Add Another Rate
          </button>
        </div>

        {supplierExists && (
          <p className="error">This supplier is already registered.</p>
        )}
        <button type="submit">Add Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;
