import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Leaflet from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

import './Map.scss'

export default function Map (props) {
  const {displayData, data} = props;

  let DefaultIcon = Leaflet.icon({
    ...Leaflet.Icon.Default.prototype.options,
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow
  });
  Leaflet.Marker.prototype.options.icon = DefaultIcon;

  const SetCenter = function (props) {
    const {center} = props;
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  }

  const SetBounds = function(props) {
    const {bounds} = props;
    console.log(bounds);
    const map = useMap();
    map.fitBounds(bounds);
    return null;
  }

  const getCenter = function(data){
    if(data){
      let markerData;
      if (displayData === "events"){
        markerData = data.events;
      } else {
        markerData = data.stats;
      }
      let sum = [0, 0];
      markerData.forEach(data => {
        sum[0] += data.lat;
        sum[1] += data.lon;
      });
      sum[0] /= markerData.length;
      sum[1] /= markerData.length;
      return sum;
    }
    return [0,0];
  }

  const getBounds = function (data) {
    const bounds = [[0, 0],[0, 0]]

    if(data){
      let markerData;
      if (displayData === "events"){
        markerData = data.events;
      } else {
        markerData = data.stats;
      }

      let counter = 0;
      markerData.forEach(data => {
        if (counter === 0){
          bounds[0] = [data.lat, data.lon];
          bounds[1] = [data.lat, data.lon];
        } else {
          bounds[0] = [Math.min(bounds[0][0], data.lat), Math.min(bounds[0][1], data.lon)];
          bounds[1] = [Math.max(bounds[1][0], data.lat), Math.max(bounds[1][1], data.lon)];
        } 
        counter++;
      });
    }

    return bounds;
  }

  const parseMarkers = function (data) {
    if(data){
      let markerData;
      if (displayData === "events"){
        markerData = data.events;
      } else {
        markerData = data.stats;
      }
      return markerData.map((data, idx) => {
        return(
          <Marker
            key={idx}
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
    return <></>;
  }
  const createClusterCustomIcon = function (cluster) {
    console.log(cluster.getChildCount());
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: 'marker-cluster-custom',
      iconSize: L.point(40, 40, true),
    });
  };
  

  return (
    <MapContainer 
      className="markercluster-map"
      center={getCenter(data)} 
      zoom={13} 
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        iconCreateFunction={createClusterCustomIcon}
      >
        {parseMarkers(data)}
      </MarkerClusterGroup>

      <SetBounds bounds={getBounds(data)}/>
      {/* <SetCenter center={getCenter(data)} /> */}
    </MapContainer>
  );
};