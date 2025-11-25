import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '1rem'
};

export default function TripMap({ destination, markers = [] }) {
  const [center, setCenter] = React.useState({ lat: 20.5937, lng: 78.9629 }); // India default

  React.useEffect(() => {
    // Geocode destination to get coordinates
    if (destination) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.results[0]) {
            const loc = data.results[0].geometry.location;
            setCenter({ lat: loc.lat, lng: loc.lng });
          }
        });
    }
  }, [destination]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} title={marker.title} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}