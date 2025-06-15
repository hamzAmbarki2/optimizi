import React, { useState, useContext } from 'react';
import { MapContext } from '../context/MapContext';

const MapComponent = () => {
  const { reverseGeocode } = useContext(MapContext);
  const [address, setAddress] = useState(null);

  const handleMapClick = async (lat, lon) => {
    // Instead of direct fetch to nominatim.openstreetmap.org, use the same function/context as profile map
    // const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
    // const data = await response.json();
    // setAddress(data);

    // With this:
    const data = await reverseGeocode(lat, lon);
    setAddress(data);
  };

  return (
    <div>
      {/* ...existing map code... */}
      {address && <div>{JSON.stringify(address)}</div>}
    </div>
  );
};

export default MapComponent;