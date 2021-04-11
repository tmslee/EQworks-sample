import React, { useState, useEffect } from 'react';
import {Form } from 'react-bootstrap';
import Slider from '@material-ui/core/Slider';

import useTableQuery from '../../hooks/useTableQuery'
import useDateTimeRange from '../../hooks/useDateTimeRange';

import DataTableComponent from './DataTableComponent';

import './index.scss';

export default function DataTable (props) {
  const {data} = props;
  
  const {
    filterQuery,
    setInterval,
    setDateTimeRange,
    setIncludedData,
    setSearchTerm,
    setSortOptions,
    queryRes,
    setQueryRes
  } = useTableQuery();

  const {
    sliderVal,
    setSliderVal,
    minMaxRange,
    formatLabel
  } = useDateTimeRange(filterQuery.interval, data);

  useEffect(()=> {
    if(sliderVal[0] !== 0 && sliderVal[1] !== 0){
      setDateTimeRange(sliderVal, filterQuery.interval);
    }
  }, [sliderVal]);

  useEffect(() => {
    if(!getPossibleSortBy(filterQuery).includes(filterQuery.sortBy)) {
      setSortOptions("date", false);
    }

  }, [filterQuery]);

  const getPossibleSortBy = function (filterQuery) {
    const sortByList = [];
    sortByList.push("date");

    if (filterQuery.interval === "hourly"){
      sortByList.push("hour");
      if(filterQuery.events) sortByList.push("events_poi");
      if(filterQuery.clicks || filterQuery.impressions || filterQuery.revenue) sortByList.push("stats_poi");
    }

    if (filterQuery.events) sortByList.push("events");
    if (filterQuery.clicks) sortByList.push("clicks");
    if (filterQuery.impressions) sortByList.push("impressions");
    if (filterQuery.revenue) sortByList.push("revenue");

    return sortByList;
  }

  const parsedSortOptions = function (filterQuery){
    const sortByList = getPossibleSortBy(filterQuery);
    const options = sortByList.map((option, idx) => {
      let displayText = option;
      if(option === "events_poi") displayText = "events location";
      else if(option === "stats_poi") displayText = "stats location";
      return <option key={idx} value={option}>{displayText}</option>;
    });
    return options;
  };

  return (
    <div>
      {!data && <p>loading data...</p>}
      {data &&
      <>
        <div className="filter-container">
          <h4 className="filter-title">Data Table Filter</h4>
          <div >
            <Form className="form-container">
              <Form.Group className="form-group">
                <Form.Label>Time Resolution</Form.Label>
                <Form.Check
                  type="radio"
                  label="daily"
                  name="timeResSetting"
                  id="timeResSetting1"
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
                  defaultChecked
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
                <Form.Label className="slider-title">Graph Time Range</Form.Label>
                
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
                  <Form.Label>Search by Location Name</Form.Label>
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
              
        <div className="table-container">
          <div className="table-header">
              <h4 className = "table-title">Data Table</h4>
                <Form className="sort-options-container">
                  <Form.Control
                    as="select"
                    className="sort-option sort-by"
                    id="sort-sort-by"
                    value={filterQuery.sortBy}
                    onChange ={(e) => {
                      setSortOptions(e.target.value, filterQuery.descending);
                    }}
                    custom
                  >
                    {parsedSortOptions(filterQuery)}
                  </Form.Control>
                  <Form.Control
                    as="select"
                    className="sort-option asc-desc"
                    id="sort-asc-desc"
                    value={filterQuery.descending}
                    onChange ={(e) => {
                      setSortOptions(filterQuery.sortBy, e.target.value);
                    }}
                    custom
                  >
                    <option value={false}>ascending</option>
                    <option value={true}>descending</option>
                  </Form.Control>
                </Form>
          </div>
          <DataTableComponent
            className="table"
            queryRes={queryRes}
          />
        </div>
      </>
      }
    </div>
  );
}