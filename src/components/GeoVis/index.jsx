import axios from 'axios';
import React from 'react';
import {useState, useEffect} from 'react';
import {Form} from 'react-bootstrap';
import useGeoData from '../../hooks/useGeoData';
import Map from './Map';
import './index.scss'

export default function GeoVis (props) {
  const {
    geoData,
    minMaxDays
  } = useGeoData();

  const [currDay, setCurrDay] = useState("total");
  const [currData, setCurrData] = useState(null); 
  const [displayData, setDisplayData] = useState("events");

  useEffect(() => {
    if(geoData){
      if(currDay === "total"){
        setCurrData({
          events: geoData.eventsTot,
          stats: geoData.statsTot
        });
      } else {
        const events = axios.get('geo/events/day', {params: {currDay}});
        const stats = axios.get('geo/stats/day', {params: {currDay}});
        Promise.all([events, stats])
        .then(res => {
          setCurrData({events: res[0].data, stats: res[1].data});
        }).catch(e => {
          console.log(e);
        })
      }
    }
  }, [geoData, currDay]);

  // useEffect(()=>{
  //   console.log(currData);
  // }, [currData]);
  
  const msToDayString = function (timeStamp_ms){
    const options = {
      year:"numeric",
      month:"2-digit",
      day:"2-digit",
      hour:"2-digit",
      timeZone: "UTC"
    };
    const dateString = new Date(timeStamp_ms).toLocaleDateString([], options);
    const [day, month, year] = dateString.substring(0,10).split("/");
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }  

  const parseDays = function(minMaxDays){
    const [min, max] = minMaxDays;
    const parsedResult = [];
    let keyVal = 0;
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    for(let i=min ; i<=max ; i+=86400000){
      parsedResult.push(<option key={keyVal} value={msToDayString(i)}>{new Date(i).toLocaleDateString([], options)}</option>);
      keyVal++;
    }
    return parsedResult
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <h4 className="form-title">View Options</h4>
        <Form className="form">
          <Form.Group className="form-group">
            <Form.Label>Location Data</Form.Label>
            <Form.Check
              type="radio"
              label="events"
              name="dataSetting"
              id="dataSetting1"
              defaultChecked
              onClick={() => {setDisplayData('events');}}
            />
            <Form.Check
              type="radio"
              label="clicks"
              name="dataSetting"
              id="dataSetting2"
              onClick={() => {setDisplayData('clicks');}}
            />
            <Form.Check
              type="radio"
              label="impressions"
              name="dataSetting"
              id="dataSetting3"
              onClick={() => {setDisplayData('impressions');}}
            />
            <Form.Check
              type="radio"
              label="revenue"
              name="dataSetting"
              id="dataSetting4"
              onClick={() => {setDisplayData('revenue');}}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Choose a Day</Form.Label>
            <Form.Control
              as="select"
              className="sort-option asc-desc"
              id="sort-asc-desc"
              value={currDay}
              onChange={(e) => {
                setCurrDay(e.target.value);
              }}
              custom
            >
              <option value={"total"}>total</option>
              {parseDays(minMaxDays)}
            </Form.Control>
          </Form.Group>
        </Form>
      </div>
      <div className="map-container" id="mapid">
        <Map
          displayData={displayData}
          data={currData}
        />
      </div>
    </div>
  );
}