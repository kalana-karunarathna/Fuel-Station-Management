import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Fuelprice() {
  const [city] = useState('delhi'); // Fixed city
  const [fuelData, setFuelData] = useState(null);

  useEffect(() => {
    const fetchFuelPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/fuel/${city}`);
        setFuelData(response.data);
      } catch (err) {
        console.error('Failed to fetch fuel prices:', err);
      }
    };

    fetchFuelPrice();
  }, [city]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Fuel Price in {city.charAt(0).toUpperCase() + city.slice(1)}</h2>

      {fuelData ? (
        <div>
          <p><strong>Petrol:</strong> ₹{fuelData.petrol}</p>
          <p><strong>Diesel:</strong> ₹{fuelData.diesel}</p>
        </div>
      ) : (
        <p>Loading fuel prices...</p>
      )}
    </div>
  );
}

export default Fuelprice;
