import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {} from 'react-bootstrap';
import useAPIData from '../../hooks/useAPIData';
import useGraphParams from '../../hooks/useGraphParams';
import MainGraph from './MainGraph';

export default function ChartVis (props) {
  const {data} = props;

  if(data) {
    const {
      hourlyEvents,
      dailyEvents,
      hourlyStats,
      dailyStats,
      poi
    } = data;
  }

  const initialParams = {
    //fill in graph params here
  };

  const {
    params,
    setParams
  } = useGraphParams(initialParams)

  return (
    <div>
      <div>
        {/* graph param config
              which data are we displaying
              daily or hourly
              normalize or not
        */}
      </div>
      
      {data && 
      <MainGraph
        params={params}
      />}

      {!data && <p>loading data...</p>}
      
    </div>
  );
};