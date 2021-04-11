import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
import './Map.scss'

export default function Map (props) {
  const {displayData, data} = props;

  const getCenter = function(){

  }

  const parseMarkers = function () {
    let markerData;
    if (displayData === "events"){
      markerData = data.events;
    } else {
      markerData = data.stats;
    }
    return markerData.map((data, idx) => {
      return(
        <Marker
          position={[data.lat, data.lon]}
        >
          <Popup>
            {`${data.name}`}<br/>
            {`${displayData}: ${data[displayData]}`} 
          </Popup>
        </Marker>
      );
    })
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parseMarkers()}
    </MapContainer>
  );
};