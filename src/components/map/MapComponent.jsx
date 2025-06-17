import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
} );

const API_BASE = 'http://localhost:5000/api'; // or use environment variable

function MapComponent({ onAddressSelected, initialAddress = null }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris, France
  const [zoom, setZoom] = useState(13);
  const [markerPosition, setMarkerPosition] = useState(null); // Marker position state
  const mapRef = useRef();

  // Effect to handle initial address geocoding and set map center/marker
  useEffect(() => {
    const geocodeAndSetInitial = async () => {
      if (initialAddress) {
        try {
          setLoading(true);
          // Use backend proxy endpoint
          const url = `${API_BASE}/geocode?q=${encodeURIComponent(initialAddress)}&limit=1`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to geocode initial address');
          const data = await response.json();

          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const newPos = [parseFloat(lat), parseFloat(lon)];
            setMapCenter(newPos);
            setMarkerPosition(newPos); // Set marker to initial address
            setZoom(13); // Keep a reasonable zoom for initial address
            setAddress(initialAddress); // Display the initial address
          } else {
            console.warn('Initial address not found on map:', initialAddress);
            setMarkerPosition(mapCenter);
            setAddress('');
          }
        } catch (err) {
          console.error('Error geocoding initial address:', err);
          setError('Failed to load initial address.');
          setMarkerPosition(mapCenter);
          setAddress('');
        } finally {
          setLoading(false);
        }
      } else {
        setMarkerPosition(null);
        setAddress('');
      }
    };

    geocodeAndSetInitial();
  }, [initialAddress]); // Depend on initialAddress to re-run if it changes

  // Pan/zoom the map when mapCenter or zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, zoom, { animate: true });
    }
  }, [mapCenter, zoom]);

  const handlePositionSelected = async (position) => {
    setMarkerPosition(position);
    try {
      setLoading(true);
      setError(null);

      // Use backend proxy endpoint
      const url = `${API_BASE}/reverse-geocode?lat=${position.lat}&lon=${position.lng}&addressdetails=1`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        setAddress(formattedAddress);
        if (onAddressSelected) {
          onAddressSelected(formattedAddress);
        }
      } else {
        setAddress('No address found for this location');
      }
    } catch (err) {
      console.error('Error getting address:', err);
      setError('Failed to get address. Please try again.');
      setAddress('');
    } finally {
      setLoading(false);
    }
  };

  // Search for a country and pan the map
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Use backend proxy endpoint
      const url = `${API_BASE}/geocode?q=${encodeURIComponent(search.trim())}&limit=1`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search location');
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setZoom(8); // Zoom out for country search
        setMarkerPosition(newCenter); // Set marker to searched location
        setError(null);
      } else {
        setError('Location not found');
        setMarkerPosition(null); // Clear marker if location not found
      }
    } catch (err) {
      setError('Failed to find location');
      setMarkerPosition(null); // Clear marker on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Sélectionnez votre adresse sur la carte
      </Typography>

      {/* Search Input */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Type a country name (e.g. France)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSearch}
        >
          Go
        </Button>
      </Box>

      {/* Map Container */}
      <Box sx={{ height: '300px', width: '100%', mb: 2, borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Render marker at markerPosition if set, use key to force re-render */}
          {markerPosition && (
            <Marker position={markerPosition} key={JSON.stringify(markerPosition )}>
              <Popup>You selected this location</Popup>
            </Marker>
          )}
          {/* Pass handlePositionSelected to map clicks */}
          <MapClickHandler onPositionSelected={handlePositionSelected} />
        </MapContainer>
      </Box>

      {/* Address Display */}
      <Box sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>

Adresse sélectionnée :        </Typography>
        {loading ? (
          <Typography variant="body2">Loading address...</Typography>
        ) : error ? (
          <Typography variant="body2" color="error">{error}</Typography>
        ) : address ? (
          <Typography variant="body2">{address}</Typography>
        ) : (
          <Typography variant="body2">Click on the map to select a location</Typography>
        )}
      </Box>
    </Box>
  );
}

// Helper component to handle map clicks and call the callback
function MapClickHandler({ onPositionSelected }) {
  useMapEvents({
    click: (e) => {
      if (onPositionSelected) {
        onPositionSelected(e.latlng);
      }
    },
  });
  return null;
}

export default MapComponent;
