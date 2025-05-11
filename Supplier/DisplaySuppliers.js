// import React, { useState, useEffect } from 'react';
// import '../css/supplierDisplay.css';
// import '../css/editSupplier.css'
// import AddSupplier from './AddSupplier';
// import GeneratePDF from './GenaratePdf';
// import Sidebar from './Sidebar';

// const DisplaySupplier = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [currentSupplier, setCurrentSupplier] = useState(null);
//   const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
//   const [showGeneratePdf, setShowGeneratePdf] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const API_URL = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     fetchSupplierData();
//   }, []);

//   const fetchSupplierData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getsupplier`);
//       const data = await response.json();
//       setSuppliers(data);
//     } catch (error) {
//       console.error('Error fetching supplier data:', error);
//     }
//   };
//   const handleSearch = async () => {
//     try {
//       const response = await fetch(`${API_URL}/searchsupplier`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query: searchQuery }),
//       });
//       const data = await response.json();
//       setSuppliers(data);
//     } catch (error) {
//       console.error('Error searching supplier:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`${API_URL}/deletesupplier/${id}`, { method: 'DELETE' });
//       fetchSupplierData();
//     } catch (error) {
//       console.error('Error deleting supplier:', error);
//     }
//   };

//   const handleEdit = (supplier) => {
//     setEditMode(true);
//     setCurrentSupplier(supplier);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       await fetch(`${API_URL}/updatesupplier/${currentSupplier._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(currentSupplier),
//       });
//       setEditMode(false);
//       fetchSupplierData();
//     } catch (error) {
//       console.error('Error updating supplier:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddSupplier = () => {
//     setShowAddSupplierModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddSupplierModal(false);
//   };

//   useEffect(() => {
//     if (searchQuery) {
//       handleSearch();
//     }
//   }, [searchQuery]);

//   return (
//     <div className="supplier-page-container">
//         <Sidebar />
//     <div className="supplier-table-container">
//       <div className="actions">
//         <button className="add-button" onClick={handleAddSupplier}>Add Supplier</button>
//         <div className="search-container">
//         <input
//             type="text"
//             className="search-input"
//             placeholder="Search Supplier..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <GeneratePDF />
//       </div>
//       <h2>Supplier Details</h2>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Supplier Id</th>
//             <th>Supplier Name</th>
//             <th>Company Address</th>
//             <th>Email</th>
//             <th>Primary Contact Person</th>
//             <th>Business Registration Number</th>
//             <th>Contract Start Date</th>
//             <th>Tax Identification Number</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {suppliers.map((supplier) => (
//             <tr key={supplier._id}>
//               <td>{supplier.SupplierId}</td>
//               <td>{supplier.SupplierName}</td>
//               <td>{supplier.CompanyAddress}</td>
//               <td>{supplier.Email}</td>
//               <td>{supplier.PrimaryContactPerson}</td>
//               <td>{supplier.BusinessRegistrationNumber}</td>
//               <td>{new Date(supplier.ContractStartDate).toLocaleDateString()}</td>
//               <td>{supplier.TaxIdentificationNumber}</td>
//               <td>
//                 <button onClick={() => handleEdit(supplier)}>Edit</button>
//                 <button onClick={() => handleDelete(supplier._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showEditModal && editMode && currentSupplier && (
//         <div className="modal-overlay-edit">
//           <div className="modal-content-edit">
//             <h3>Update Supplier</h3>
//             <input type="text" name="SupplierId" value={currentSupplier.SupplierId} onChange={handleChange} />
//             <input type="text" name="SupplierName" value={currentSupplier.SupplierName} onChange={handleChange} />
//             <input type="text" name="CompanyAddress" value={currentSupplier.CompanyAddress} onChange={handleChange} />
//             <input type="text" name="Email" value={currentSupplier.Email} onChange={handleChange} />
//             <input type="text" name="PrimaryContactPerson" value={currentSupplier.PrimaryContactPerson} onChange={handleChange} />
//             <input type="text" name="BusinessRegistrationNumber" value={currentSupplier.BusinessRegistrationNumber} onChange={handleChange} />
//             <input type="date" name="ContractStartDate" value={currentSupplier.ContractStartDate} onChange={handleChange} />
//             <input type="number" name="TaxIdentificationNumber" value={currentSupplier.TaxIdentificationNumber} onChange={handleChange} />
//             <button onClick={handleUpdate}>Update</button>
//             <button className="close-button-edit" onClick={() => setShowEditModal(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {showGeneratePdf && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-button" onClick={() => setShowGeneratePdf(false)}>Close</button>
//             <GeneratePDF />
//           </div>
//         </div>
//       )}

//       {showAddSupplierModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-button" onClick={handleCloseModal}>Close</button>
//             <AddSupplier onAddSupplier={fetchSupplierData} handleCloseModal={handleCloseModal} />

//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default DisplaySupplier;
// import React, { useState, useEffect } from "react";
// import "../css/supplierDisplay.css";
// import "../css/editSupplier.css";
// import AddSupplier from "./AddSupplier";
// import GeneratePDF from "./GenaratePdf";
// import Sidebar from "./Sidebar";

// const DisplaySupplier = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [currentSupplier, setCurrentSupplier] = useState(null);
//   const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
//   const [showGeneratePdf, setShowGeneratePdf] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showRatesModal, setShowRatesModal] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const API_URL = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     fetchSupplierData();
//   }, []);

//   const fetchSupplierData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getsupplier`);
//       const data = await response.json();
//       setSuppliers(data);
//     } catch (error) {
//       console.error("Error fetching supplier data:", error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await fetch(`${API_URL}/searchsupplier`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ query: searchQuery }),
//       });
//       const data = await response.json();
//       setSuppliers(data);
//     } catch (error) {
//       console.error("Error searching supplier:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`${API_URL}/deletesupplier/${id}`, { method: "DELETE" });
//       fetchSupplierData();
//     } catch (error) {
//       console.error("Error deleting supplier:", error);
//     }
//   };

//   const handleEdit = (supplier) => {
//     setEditMode(true);
//     setCurrentSupplier(supplier);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       await fetch(`${API_URL}/updatesupplier/${currentSupplier._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(currentSupplier),
//       });
//       setEditMode(false);
//       setShowEditModal(false);
//       fetchSupplierData();
//     } catch (error) {
//       console.error("Error updating supplier:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRateChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedRates = [...currentSupplier.Rates];
//     updatedRates[index] = { ...updatedRates[index], [name]: value };
//     setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
//   };

//   const addRate = () => {
//     const updatedRates = currentSupplier.Rates
//       ? [...currentSupplier.Rates]
//       : [];
//     updatedRates.push({
//       FuelType: "",
//       UnitPrice: "",
//       Currency: "USD",
//       EffectiveDate: new Date().toISOString().split("T")[0],
//     });
//     setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
//   };

//   const removeRate = (index) => {
//     if (currentSupplier.Rates && currentSupplier.Rates.length > 1) {
//       const updatedRates = [...currentSupplier.Rates];
//       updatedRates.splice(index, 1);
//       setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
//     }
//   };

//   const handleAddSupplier = () => {
//     setShowAddSupplierModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddSupplierModal(false);
//   };

//   const viewRates = (supplier) => {
//     setSelectedSupplier(supplier);
//     setShowRatesModal(true);
//   };

//   useEffect(() => {
//     if (searchQuery) {
//       handleSearch();
//     }
//   }, [searchQuery]);

//   return (
//     <div className="supplier-page-container">
//       <Sidebar />
//       <div className="supplier-table-container">
//         <div className="actions">
//           <button className="add-button" onClick={handleAddSupplier}>
//             Add Supplier
//           </button>
//           <div className="search-container">
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search Supplier..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <GeneratePDF />
//         </div>
//         <h2>Supplier Details</h2>
//         <table border="1">
//           <thead>
//             <tr>
//               <th>Supplier Id</th>
//               <th>Supplier Name</th>
//               <th>Company Address</th>
//               <th>Email</th>
//               <th>Primary Contact Person</th>
//               <th>Business Registration Number</th>
//               <th>Contract Start Date</th>
//               <th>Tax Identification Number</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {suppliers.map((supplier) => (
//               <tr key={supplier._id}>
//                 <td>{supplier.SupplierId}</td>
//                 <td>{supplier.SupplierName}</td>
//                 <td>{supplier.CompanyAddress}</td>
//                 <td>{supplier.Email}</td>
//                 <td>{supplier.PrimaryContactPerson}</td>
//                 <td>{supplier.BusinessRegistrationNumber}</td>
//                 <td>
//                   {new Date(supplier.ContractStartDate).toLocaleDateString()}
//                 </td>
//                 <td>{supplier.TaxIdentificationNumber}</td>
//                 <td>
//                   <button onClick={() => handleEdit(supplier)}>Edit</button>
//                   <button onClick={() => viewRates(supplier)}>
//                     View Rates
//                   </button>
//                   <button onClick={() => handleDelete(supplier._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {showEditModal && editMode && currentSupplier && (
//           <div className="modal-overlay-edit">
//             <div className="modal-content-edit">
//               <h3>Update Supplier</h3>
//               <input
//                 type="text"
//                 name="SupplierId"
//                 value={currentSupplier.SupplierId}
//                 onChange={handleChange}
//                 placeholder="Supplier ID"
//               />
//               <input
//                 type="text"
//                 name="SupplierName"
//                 value={currentSupplier.SupplierName}
//                 onChange={handleChange}
//                 placeholder="Supplier Name"
//               />
//               <input
//                 type="text"
//                 name="CompanyAddress"
//                 value={currentSupplier.CompanyAddress}
//                 onChange={handleChange}
//                 placeholder="Company Address"
//               />
//               <input
//                 type="text"
//                 name="Email"
//                 value={currentSupplier.Email}
//                 onChange={handleChange}
//                 placeholder="Email"
//               />
//               <input
//                 type="text"
//                 name="PrimaryContactPerson"
//                 value={currentSupplier.PrimaryContactPerson}
//                 onChange={handleChange}
//                 placeholder="Primary Contact Person"
//               />
//               <input
//                 type="text"
//                 name="BusinessRegistrationNumber"
//                 value={currentSupplier.BusinessRegistrationNumber}
//                 onChange={handleChange}
//                 placeholder="Business Registration Number"
//               />
//               <input
//                 type="date"
//                 name="ContractStartDate"
//                 value={
//                   currentSupplier.ContractStartDate
//                     ? currentSupplier.ContractStartDate.substring(0, 10)
//                     : ""
//                 }
//                 onChange={handleChange}
//               />
//               <input
//                 type="number"
//                 name="TaxIdentificationNumber"
//                 value={currentSupplier.TaxIdentificationNumber}
//                 onChange={handleChange}
//                 placeholder="Tax Identification Number"
//               />

//               <div className="rates-section">
//                 <h4>Supplier Rates</h4>
//                 {currentSupplier.Rates &&
//                   currentSupplier.Rates.map((rate, index) => (
//                     <div key={index} className="rate-item">
//                       <div className="rate-header">
//                         <span>Rate {index + 1}</span>
//                         {currentSupplier.Rates.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeRate(index)}
//                             className="remove-rate-btn"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>

//                       <div className="rate-inputs">
//                         <select
//                           name="FuelType"
//                           value={rate.FuelType}
//                           onChange={(e) => handleRateChange(index, e)}
//                         >
//                           <option value="">Select Fuel Type</option>
//                           <option value="Petrol">Petrol</option>
//                           <option value="Diesel">Diesel</option>
//                           <option value="Premium Petrol">Premium Petrol</option>
//                           <option value="Premium Diesel">Premium Diesel</option>
//                           <option value="CNG">CNG</option>
//                           <option value="LPG">LPG</option>
//                           <option value="Electric">Electric Charging</option>
//                           <option value="Biodiesel">Biodiesel</option>
//                           <option value="Ethanol">Ethanol</option>
//                         </select>

//                         <input
//                           type="number"
//                           name="UnitPrice"
//                           value={rate.UnitPrice}
//                           onChange={(e) => handleRateChange(index, e)}
//                           placeholder="Unit Price"
//                           step="0.01"
//                         />

//                         <select
//                           name="Currency"
//                           value={rate.Currency}
//                           onChange={(e) => handleRateChange(index, e)}
//                         >
//                           <option value="USD">USD</option>
//                           <option value="EUR">EUR</option>
//                           <option value="GBP">GBP</option>
//                           <option value="JPY">JPY</option>
//                           <option value="AUD">AUD</option>
//                           <option value="CAD">CAD</option>
//                         </select>

//                         <input
//                           type="date"
//                           name="EffectiveDate"
//                           value={
//                             rate.EffectiveDate
//                               ? rate.EffectiveDate.substring(0, 10)
//                               : new Date().toISOString().substring(0, 10)
//                           }
//                           onChange={(e) => handleRateChange(index, e)}
//                         />
//                       </div>
//                     </div>
//                   ))}

//                 <button
//                   type="button"
//                   onClick={addRate}
//                   className="add-rate-btn"
//                 >
//                   Add Another Rate
//                 </button>
//               </div>

//               <div className="edit-buttons">
//                 <button onClick={handleUpdate}>Update</button>
//                 <button
//                   className="close-button-edit"
//                   onClick={() => setShowEditModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showRatesModal && selectedSupplier && (
//           <div className="modal-overlay-rates">
//             <div className="modal-content-rates">
//               <h3>{selectedSupplier.SupplierName} - Fuel Rates</h3>
//               {selectedSupplier.Rates && selectedSupplier.Rates.length > 0 ? (
//                 <table className="rates-table">
//                   <thead>
//                     <tr>
//                       <th>Fuel Type</th>
//                       <th>Unit Price</th>
//                       <th>Currency</th>
//                       <th>Effective Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedSupplier.Rates.map((rate, index) => (
//                       <tr key={index}>
//                         <td>{rate.FuelType}</td>
//                         <td>{rate.UnitPrice}</td>
//                         <td>{rate.Currency}</td>
//                         <td>
//                           {new Date(rate.EffectiveDate).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No rates available for this supplier.</p>
//               )}
//               <button
//                 className="close-button-rates"
//                 onClick={() => setShowRatesModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {showGeneratePdf && (
//           <div className="modal">
//             <div className="modal-content">
//               <button
//                 className="close-button"
//                 onClick={() => setShowGeneratePdf(false)}
//               >
//                 Close
//               </button>
//               <GeneratePDF />
//             </div>
//           </div>
//         )}

//         {showAddSupplierModal && (
//           <div className="modal">
//             <div className="modal-content">
//               <button className="close-button" onClick={handleCloseModal}>
//                 Close
//               </button>
//               <AddSupplier
//                 onAddSupplier={fetchSupplierData}
//                 handleCloseModal={handleCloseModal}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisplaySupplier;
import React, { useState, useEffect } from "react";
import "../../css/supplierDisplay.css";
import "../../css/editSupplier.css";
import "../../css/supplierRates.css";
import "../../css/fuelOrderCalculator.css";
import AddSupplier from "./AddSupplier";
import GeneratePDF from "./GenaratePdf";
// import Sidebar from "./Sidebar
import Sidebar from "../Sidebar";
import FuelOrderCalculator from "./FuelOrderCalculator";

const DisplaySupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showGeneratePdf, setShowGeneratePdf] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL_SUP;

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      const response = await fetch(`${API_URL}/getsupplier`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/searchsupplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error searching supplier:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/deletesupplier/${id}`, { method: "DELETE" });
      fetchSupplierData();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleEdit = (supplier) => {
    setEditMode(true);
    setCurrentSupplier(supplier);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/updatesupplier/${currentSupplier._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentSupplier),
      });
      setEditMode(false);
      setShowEditModal(false);
      fetchSupplierData();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleRateChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRates = [...currentSupplier.Rates];
    updatedRates[index] = { ...updatedRates[index], [name]: value };
    setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
  };

  const addRate = () => {
    const updatedRates = currentSupplier.Rates
      ? [...currentSupplier.Rates]
      : [];
    updatedRates.push({
      FuelType: "",
      UnitPrice: "",
      Currency: "USD",
      EffectiveDate: new Date().toISOString().split("T")[0],
    });
    setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
  };

  const removeRate = (index) => {
    if (currentSupplier.Rates && currentSupplier.Rates.length > 1) {
      const updatedRates = [...currentSupplier.Rates];
      updatedRates.splice(index, 1);
      setCurrentSupplier((prev) => ({ ...prev, Rates: updatedRates }));
    }
  };

  const handleAddSupplier = () => {
    setShowAddSupplierModal(true);
  };

  const handleCloseModal = () => {
    setShowAddSupplierModal(false);
  };

  const handleOpenCalculator = () => {
    setShowCalculatorModal(true);
  };

  const handleCloseCalculator = () => {
    setShowCalculatorModal(false);
  };

  const viewRates = (supplier) => {
    setSelectedSupplier(supplier);
    setShowRatesModal(true);
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <div className="supplier-page-container">
      <Sidebar />
      <div className="supplier-table-container">
        <div className="actions">
          <button className="calculate-button" onClick={handleOpenCalculator}>
            Fuel Order Calculator
          </button>
          <button className="add-button" onClick={handleAddSupplier}>
            Add Supplier
          </button>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <GeneratePDF />
        </div>
        <h2>Supplier Details</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Supplier Id</th>
              <th>Supplier Name</th>
              <th>Company Address</th>
              <th>Email</th>
              <th>Primary Contact Person</th>
              <th>Business Registration Number</th>
              <th>Contract Start Date</th>
              <th>Tax Identification Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier.SupplierId}</td>
                <td>{supplier.SupplierName}</td>
                <td>{supplier.CompanyAddress}</td>
                <td>{supplier.Email}</td>
                <td>{supplier.PrimaryContactPerson}</td>
                <td>{supplier.BusinessRegistrationNumber}</td>
                <td>
                  {new Date(supplier.ContractStartDate).toLocaleDateString()}
                </td>
                <td>{supplier.TaxIdentificationNumber}</td>
                <td>
                  <button onClick={() => handleEdit(supplier)}>Edit</button>
                  <button onClick={() => viewRates(supplier)}>
                    View Rates
                  </button>
                  <button onClick={() => handleDelete(supplier._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showEditModal && editMode && currentSupplier && (
          <div className="modal-overlay-edit">
            <div className="modal-content-edit">
              <h3>Update Supplier</h3>
              <input
                type="text"
                name="SupplierId"
                value={currentSupplier.SupplierId}
                onChange={handleChange}
                placeholder="Supplier ID"
              />
              <input
                type="text"
                name="SupplierName"
                value={currentSupplier.SupplierName}
                onChange={handleChange}
                placeholder="Supplier Name"
              />
              <input
                type="text"
                name="CompanyAddress"
                value={currentSupplier.CompanyAddress}
                onChange={handleChange}
                placeholder="Company Address"
              />
              <input
                type="text"
                name="Email"
                value={currentSupplier.Email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="PrimaryContactPerson"
                value={currentSupplier.PrimaryContactPerson}
                onChange={handleChange}
                placeholder="Primary Contact Person"
              />
              <input
                type="text"
                name="BusinessRegistrationNumber"
                value={currentSupplier.BusinessRegistrationNumber}
                onChange={handleChange}
                placeholder="Business Registration Number"
              />
              <input
                type="date"
                name="ContractStartDate"
                value={
                  currentSupplier.ContractStartDate
                    ? currentSupplier.ContractStartDate.substring(0, 10)
                    : ""
                }
                onChange={handleChange}
              />
              <input
                type="number"
                name="TaxIdentificationNumber"
                value={currentSupplier.TaxIdentificationNumber}
                onChange={handleChange}
                placeholder="Tax Identification Number"
              />

              <div className="rates-section">
                <h4>Supplier Rates</h4>
                {currentSupplier.Rates &&
                  currentSupplier.Rates.map((rate, index) => (
                    <div key={index} className="rate-item">
                      <div className="rate-header">
                        <span>Rate {index + 1}</span>
                        {currentSupplier.Rates.length > 1 && (
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

                        <input
                          type="number"
                          name="UnitPrice"
                          value={rate.UnitPrice}
                          onChange={(e) => handleRateChange(index, e)}
                          placeholder="Unit Price"
                          step="0.01"
                        />

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

                        <input
                          type="date"
                          name="EffectiveDate"
                          value={
                            rate.EffectiveDate
                              ? rate.EffectiveDate.substring(0, 10)
                              : new Date().toISOString().substring(0, 10)
                          }
                          onChange={(e) => handleRateChange(index, e)}
                        />
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={addRate}
                  className="add-rate-btn"
                >
                  Add Another Rate
                </button>
              </div>

              <div className="edit-buttons">
                <button onClick={handleUpdate}>Update</button>
                <button
                  className="close-button-edit"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showRatesModal && selectedSupplier && (
          <div className="modal-overlay-rates">
            <div className="modal-content-rates">
              <h3>{selectedSupplier.SupplierName} - Fuel Rates</h3>
              {selectedSupplier.Rates && selectedSupplier.Rates.length > 0 ? (
                <table className="rates-table">
                  <thead>
                    <tr>
                      <th>Fuel Type</th>
                      <th>Unit Price</th>
                      <th>Currency</th>
                      <th>Effective Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSupplier.Rates.map((rate, index) => (
                      <tr key={index}>
                        <td>{rate.FuelType}</td>
                        <td>{rate.UnitPrice}</td>
                        <td>{rate.Currency}</td>
                        <td>
                          {new Date(rate.EffectiveDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No rates available for this supplier.</p>
              )}
              <button
                className="close-button-rates"
                onClick={() => setShowRatesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showGeneratePdf && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setShowGeneratePdf(false)}
              >
                Close
              </button>
              <GeneratePDF />
            </div>
          </div>
        )}

        {showAddSupplierModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={handleCloseModal}>
                Close
              </button>
              <AddSupplier
                onAddSupplier={fetchSupplierData}
                handleCloseModal={handleCloseModal}
              />
            </div>
          </div>
        )}

        {showCalculatorModal && (
          <div className="calculator-modal-overlay">
            <div className="calculator-modal-content">
              <FuelOrderCalculator
                suppliers={suppliers}
                handleCloseModal={handleCloseCalculator}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplaySupplier;
