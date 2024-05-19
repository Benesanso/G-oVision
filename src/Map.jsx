import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import markerImages from '../src/markerImages';

const markerOptions = [
  { name: 'Singe', url: markerImages.faceMonkeyMarker },
  { name: 'Cool', url: markerImages.faceCoolMarker },
  { name: 'face-embarrassé', url: markerImages.faceEmbarrassedMarker },
  { name: 'Drapeau Vert', url: markerImages.flagGreenMarker },
  { name: 'Drapeau Rouge', url: markerImages.flagRedMarker },
  { name: 'Drapeau Jaune', url: markerImages.flagYellowMarker },
  { name: 'Cœur', url: markerImages.heartMarker },
  { name: 'Marqueur', url: markerImages.markersMarker },
  { name: 'Avion', url: markerImages.xPlaneMarker },
  { name: 'Fusée', url: markerImages.yastBootloaderMarker }
];

const Map = () => {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const geocoderRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedMarker, setSelectedMarker] = useState(markerOptions[0]);
  const [satelliteView, setSatelliteView] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null); // Stocker la dernière position recherchée

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([0, 0], 1);
      mapRef.current = map;

      const tileLayerUrl = satelliteView
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileLayerUrl, {
        attribution: satelliteView ? '&copy; Esri' : '&copy; OpenStreetMap contributors'
      }).addTo(map);

      requestGeolocation();

      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
      }).on('markgeocode', function (e) {
        const { center } = e.geocode;
        const { lat, lng } = center;
        setSearchedLocation({ lat, lng }); // Mettre à jour la position recherchée
        placeUserMarker({coords: { latitude: lat, longitude: lng }});
      }).addTo(map);
      geocoderRef.current = geocoder;

      // Add user marker
      const userMarkerIcon = selectedMarker.url;
      const userMarker = L.marker([0, 0], {
        icon: L.icon({
          iconUrl: userMarkerIcon,
          iconSize: [45, 56],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      }).addTo(mapRef.current);
      userMarkerRef.current = userMarker;
      userMarker.bindPopup("<b>Your location</b>").openPopup();
      markersRef.current.push(userMarker);

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [satelliteView]);

  useEffect(() => {
    if (userMarkerRef.current && searchedLocation) {
      const userMarkerIcon = selectedMarker.url;
      userMarkerRef.current.setIcon(L.icon({
        iconUrl: userMarkerIcon,
        iconSize: [45, 56],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }));
      userMarkerRef.current.setLatLng([searchedLocation.lat, searchedLocation.lng]);
      mapRef.current.setView([searchedLocation.lat, searchedLocation.lng], 13);
    }
  }, [searchedLocation, selectedMarker]);

  function requestGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(placeUserMarker);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  function placeUserMarker(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    setSearchedLocation({ lat: userLat, lng: userLng });
  }

  function toggleSatelliteView() {
    setSatelliteView(prevState => !prevState);
  }

  return (
    <div>
      <div className="container">
        <div className="marker-selector">
          <label htmlFor="markerSelect">Choose your icon:</label>
          <select
            id="markerSelect"
            value={selectedMarker.url}
            onChange={(e) => {
              const selectedOption = markerOptions.find(option => option.url === e.target.value);
              setSelectedMarker(selectedOption);
            }}
          >
            {markerOptions.map((option) => (
              <option key={option.name} value={option.url}>
                {option.name}
              </option>
            ))}
          </select>
          <button onClick={requestGeolocation}>Demander la géolocalisation</button>
          <button onClick={toggleSatelliteView}>
            {satelliteView ? 'Vue Standard' : 'Vue Satellite'}
          </button>
        </div>
        <div id="map" className="map-container"></div>
      </div>
    </div>
  );
};

export default Map;
