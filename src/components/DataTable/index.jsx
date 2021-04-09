import React from 'react';
import {Form } from 'react-bootstrap';
import axios from 'axios';
import useTableQuery from '../../hooks/useTableQuery'
import useDateTimeRange from '../../hooks/useDateTimeRange';

export default function DataTable (props) {
  const {data} = props;

  const{
    filterQuery,
    setDateRange,
    setHourRange,
    setIncludedData,
    setSearchTerm,
    queryRes
  } = useTableQuery();

  const {
    sliderVal,
    setSliderVal,
    minMaxRange
  } = useDateTimeRange(filterQuery.interval, data);

  axios.get('/all/daily', {params:{butt:123}}).then(res =>{
    console.log("hi");
  });

  return (
    <div>
      {!data && <p>loading data...</p>}
      {data &&
      <>
        <div className="filter-container">
          <h2>Data Table Filter</h2>
          <div className="form-container">
            <Form>
              

            </Form>

          </div>
        </div>
        <div>

        </div>
      </>
      }
    </div>
  );
}