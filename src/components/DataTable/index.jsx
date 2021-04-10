import React, { useEffect } from 'react';
import {Form } from 'react-bootstrap';
import Slider from '@material-ui/core/Slider';

import axios from 'axios';
import useTableQuery from '../../hooks/useTableQuery'
import useDateTimeRange from '../../hooks/useDateTimeRange';

import DataTableComponent from './Table';

export default function DataTable (props) {
  const {data} = props;

  const{
    filterQuery,
    setInterval,
    setDateTimeRange,
    setIncludedData,
    setSearchTerm,
    queryRes
  } = useTableQuery();

  const {
    sliderVal,
    setSliderVal,
    minMaxRange,
    formatLabel
  } = useDateTimeRange(filterQuery.interval, data);

  // axios.get('/all/daily', {params:{butt:123}}).then(res =>{
  //   console.log("hi");
  // });

  useEffect(()=> {
    setDateTimeRange(sliderVal, filterQuery.interval);
  }, [sliderVal]);

  // useEffect(()=> {
  //   console.log(filterQuery);
  //   console.log(queryRes);
  // }, [queryRes]);

  return (
    <div>
      {!data && <p>loading data...</p>}
      {data &&
      <>
        <div className="filter-container">
          <h4>Data Table Filter</h4>
          <div className="form-container">
            <Form>
            <Form.Group className="form-group">
                <Form.Label>Time Resolution</Form.Label>
                <Form.Check
                  type="radio"
                  label="daily"
                  name="timeResSetting"
                  id="timeResSetting1"
                  defaultChecked
                  onClick={() => {
                    setSearchTerm("");
                    setInterval('daily');
                  }}
                />
                <Form.Check
                  type="radio"
                  label="hourly"
                  name="timeResSetting"
                  id="timeResSetting2"
                  onClick={() => {
                    setInterval('hourly');
                  }}
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Data Displayed</Form.Label>
                <Form.Check
                    type="checkbox"
                    label="events"
                    id="inclusionSetting1"
                    defaultChecked
                    onClick={(e) => {setIncludedData('events', e.target.checked);}}
                />
                <Form.Check
                  type="checkbox"
                  label="impressions"
                  id="inclusionSetting2"
                  defaultChecked
                  onClick={(e) => {setIncludedData('impressions', e.target.checked);}}

                />
                <Form.Check
                  type="checkbox"
                  label="clicks"
                  id="inclusionSetting3"
                  defaultChecked
                  onClick={(e) => {setIncludedData('clicks', e.target.checked);}}

                />
                <Form.Check
                  type="checkbox"
                  label="revenue"
                  id="inclusionSetting4"
                  defaultChecked
                  onClick={(e) => {setIncludedData('revenue', e.target.checked);}}

                />
              </Form.Group>
              <Form.Group className="form-group range-group">
                <Form.Label>Graph Time Range</Form.Label>
                
                <Slider className="slider"
                  value={sliderVal}
                  min={filterQuery.interval === 'daily' ? minMaxRange.minDate_day : minMaxRange.minTime_hour}
                  max={filterQuery.interval === 'daily' ? minMaxRange.maxDate_day : minMaxRange.maxTime_hour}
                  onChange={(e, newVal) => {setSliderVal(newVal);}}
                  valueLabelDisplay={"auto"}
                  valueLabelFormat={value => formatLabel(value, filterQuery.interval)}
                  style={{width: 300}}
                />
              </Form.Group>
              {filterQuery.interval === 'hourly' && 
                <Form.Group>
                  <Form.Label>Search by POI Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="enter search term"
                    onChange = {(e) => {setSearchTerm(e.target.value);}}
                  />
                </Form.Group>
              }
            </Form>
          </div>
        </div>
              
        <div className="table-contrainer">
          <h4>Data Table</h4>
          <DataTableComponent
            queryRes={queryRes}
          />
        </div>
      </>
      }
    </div>
  );
}