import React from 'react';
import ('../css/FuelTable.css');

const GeneratePDF = () => {
  const handleGeneratePdf = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${API_URL}/getfuelpdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Fuel_Report.pdf');
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