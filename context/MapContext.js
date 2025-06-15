import React, { createContext, useContext } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  // Backend proxy endpoint example: /api/reverse-geocode?lat=...&lon=...
  const reverseGeocode = async (lat, lon) => {
    const response = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch address');
    return await response.json();
  };

  return (
    <MapContext.Provider value={{ reverseGeocode }}>
      {children}
    </MapContext.Provider>
  );
};

export const useReverseGeocode = () => useContext(MapContext);
