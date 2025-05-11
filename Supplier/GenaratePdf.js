import React from 'react';
// import ('../css/FuelTable.css');

const GeneratePDF = () => {
  const handleGeneratePdf = async () => {
    const API_URL = process.env.REACT_APP_API_URL_SUP;
    try {
      const response = await fetch(`${API_URL}/getsupplierpdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Supplier_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <button className='generate-pdf-button' onClick={handleGeneratePdf}>Download PDF</button>
  );
};

export default GeneratePDF;