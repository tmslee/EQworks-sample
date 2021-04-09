import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import useAPIData from '../../hooks/useAPIData';
import useGraphParams from '../../hooks/useGraphParams';
import MainGraph from './MainGraph';
import Slider from '@material-ui/core/Slider';
import './index.scss';
import useDateTimeRange from '../../hooks/useDateTimeRange';

// type: 'line',
// data: {},
// includedData: [],
// interval: 'daily',
// start: null,
// end: null,
// normalize: false

const emptyData = {
  hourlyEvents: [],
  dailyEvents: [],
  hourlyStats: [],
  dailyStats: [],
  poi: []
}

export default function ChartVis (props) {
  const {data} = props;
  const {
    hourlyEvents,
    dailyEvents,
    hourlyStats,
    dailyStats,
    poi
  } = data ? data : emptyData;

  const {
    params,
    setParams
  } = useGraphParams();

  const {sliderVal, setSliderVal, minMaxRange} = useDateTimeRange(params.interval, data);

  const formatLabel = function(value){
    let options = null;
    if (params.interval === 'daily'){
      options = {year: 'numeric', month: 'long', day: 'numeric'};
      value *= 86400000;
    } else {
      options = {year: 'numeric', month: 'long', day: 'numeric', hour:'numeric'};
      value *= 3600000
    }
    return new Date(value).toLocaleDateString([], options);
  }

  useEffect(() => {
    if(data) {
      let start = minMaxRange.minDate_ms;
      let end = minMaxRange.maxDate_ms;
      if (params.interval !== 'daily') {
        start = minMaxRange.minTime_ms;
        end = minMaxRange.maxTime_ms;
      }
      setParams({...params, start, end});
    }
  }, [sliderVal])

  return (
    <div>
      <div>
        
      </div>
      
      {data && 
      <div className='vis-container'>
        <h2 className='setting-title'>Graph Settings</h2>
        <div className='form-container'>
          <Form className = "form-group-container">
            <div className = 'check-box-options-container'>
              <Form.Group className="form-group">
                <Form.Label>Graph Type</Form.Label>
                <Form.Check
                  type="radio"
                  label="line"
                  name="typeSetting"
                  id="typeSetting1"
                  defaultChecked
                  onClick={() => setParams({...params, type: 'line'})}
                />
                <Form.Check
                  type="radio"
                  label="bar"
                  name="typeSetting"
                  id="typeSetting2"
                  onClick={() => setParams({...params, type: 'bar'})}
                />
                <Form.Check
                  type="radio"
                  label="scatter"
                  name="typeSetting"
                  id="typeSetting3"
                  onClick={() => setParams({...params, type: 'scatter'})}
                />
              </Form.Group >
              <Form.Group className="form-group">
                <Form.Label>Data Displayed</Form.Label>
                <Form.Check
                    type="checkbox"
                    label="events"
                    id="inclusionSetting1"
                    onClick={(e) => {
                      const updatedInclusion = {...params.includedData};
                      updatedInclusion.events = e.target.checked;
                      setParams({...params, includedData: updatedInclusion});
                    }}
                />
                <Form.Check
                  type="checkbox"
                  label="impressions"
                  id="inclusionSetting2"
                  onClick={(e) => {
                    const updatedInclusion = {...params.includedData};
                    updatedInclusion.impressions = e.target.checked;
                    setParams({...params, includedData: updatedInclusion});
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="clicks"
                  id="inclusionSetting3"
                  onClick={(e) => {
                    const updatedInclusion = {...params.includedData};
                    updatedInclusion.clicks = e.target.checked;
                    setParams({...params, includedData: updatedInclusion});
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="revenue"
                  id="inclusionSetting4"
                  onClick={(e) => {
                    const updatedInclusion = {...params.includedData};
                    updatedInclusion.revenue = e.target.checked;
                    setParams({...params, includedData: updatedInclusion});
                  }}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Time Resolution</Form.Label>
                <Form.Check
                  type="radio"
                  label="daily"
                  name="timeResSetting"
                  id="timeResSetting1"
                  defaultChecked
                  onClick={() => setParams({...params, interval: 'daily'})}
                />
                <Form.Check
                  type="radio"
                  label="hourly"
                  name="timeResSetting"
                  id="timeResSetting2"
                  onClick={() => setParams({...params, interval: 'hourly'})}
                />
              </Form.Group>
            </div> 
            
            <div className="bot-setting-container">
              <Form.Group className="form-group range-group">
                <Form.Label>Graph Time Range</Form.Label>
                
                <Slider className="slider"
                  value={sliderVal}
                  min={params.interval === 'daily' ? minMaxRange.minDate_day : minMaxRange.minTime_hour}
                  max={params.interval === 'daily' ? minMaxRange.maxDate_day : minMaxRange.maxTime_hour}
                  onChange={(e, newVal) => {
                    setSliderVal(newVal);
                    let [val1, val2] = sliderVal;
                    val1 = params.interval === 'daily' ? val1*86400000 : val1*3600000;
                    val2 = params.interval === 'daily' ? val2*86400000 : val2*3600000;
                    setParams({...params, start: Math.min(val1, val2), end: Math.max(val1, val2)});
                  }}
                  valueLabelDisplay={"auto"}
                  valueLabelFormat={value => formatLabel(value)}
                  style={{width: 300}}
                />

              </Form.Group>
              <Form.Group className='form-group'>
                <Form.Check 
                  type="switch"
                  id="normalization"
                  label="Graph Normalization"
                  onClick={(e) => setParams({...params, normalize: e.target.checked})}
                />
              </Form.Group>
            </div>
          </Form>   

        </div>
        <div className="graph-container">
          <MainGraph 
            params={params}
            data={data}
          />
        </div>
      </div>
      }

      {!data && <p>loading data...</p>}
      
    </div>
  );
};