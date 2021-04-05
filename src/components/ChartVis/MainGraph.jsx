import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {Chart, ScatterSeries, BarSeries, LineSeries} from '@devexpress/dx-react-chart-material-ui';
import { isCompositeComponentWithType } from 'react-dom/test-utils';

export default function MainGraph (props) {
  const {params, data} = props;
  const {
    type,
    includedData,
    interval,
    start,
    end,
    normalize,
  } = params;

  const getDate_ms = function (dataElem) {
    if (interval === 'daily') {
      return Number(new Date(dataElem.date));
    } else {
      return Number(new Date(dataElem.date)) + dataElem.hour*3600000;
    }
  }

  const cleanData = function () {
    const cleanedData = {};
    const rawEvents = interval === 'daily' ? data.dailyEvents : data.hourlyEvents;
    const rawStats = interval === 'daily' ? data.dailyStats : data.hourlyStats;

    const cleanedEvents = {};
    const cleanedClicks = {};
    const cleanedImpressions = {};
    const cleanedRevenue = {};

    let maxEvents = 0;
    let maxClicks = 0;
    let maxImpressions = 0;
    let maxRevenue = 0;

    rawEvents.forEach(elem => {
      const timeStamp = getDate_ms(elem);
      cleanedEvents[timeStamp] = elem.events;

      maxEvents = Math.max(maxEvents, elem.events);
    });
    rawStats.forEach(elem => {
      const timeStamp = getDate_ms(elem);
      cleanedClicks[timeStamp] = elem.clicks;
      cleanedImpressions[timeStamp] = elem.impressions;
      cleanedRevenue[timeStamp] = elem.revenue;

      maxClicks = Math.max(maxClicks, elem.clicks);
      maxImpressions = Math.max(maxImpressions, elem.impressions);
      maxRevenue = Math.max(maxRevenue, elem.revenue);
    })

    if(normalize) {
      for(const timestamp in cleanedEvents) {cleanedEvents[timestamp]/=maxEvents}
      for(const timestamp in cleanedClicks) {cleanedClicks[timestamp]/=maxClicks}
      for(const timestamp in cleanedImpressions) {cleanedImpressions[timestamp]/=maxImpressions}
      for(const timestamp in cleanedRevenue) {cleanedRevenue[timestamp]/=maxRevenue}
    }

    cleanedData['events'] = cleanedEvents;
    cleanedData['clicks'] = cleanedClicks;
    cleanedData['impressions'] = cleanedImpressions;      
    cleanedData['revenue'] = cleanedRevenue;

    return cleanedData;
  }

  const generateGraphData = function (cleanedData) {
    const graphData = [];
    const xIncrement = interval === 'daily' ? 86400000 : 3600000;
    for(let xVal = start ; xVal <= end ; xVal += xIncrement) {
      const newDataPoint = {xVal};
      const eventsData = cleanedData.events[xVal];
      const clicksData = cleanedData.clicks[xVal];
      const impressionsData = cleanedData.impressions[xVal];
      const revenueData = cleanedData.revenue[xVal];

      if(includedData.events) {
        newDataPoint['events'] = eventsData ? eventsData : 0;
      }
      if(includedData.clicks) {
        newDataPoint['clicks'] = clicksData ? clicksData : 0;
      }
      if(includedData.impressions) {
        newDataPoint['impressions'] = impressionsData ? impressionsData : 0;
      }
      if(includedData.revenue) {
        newDataPoint['revenue'] = revenueData ? revenueData : 0;
      }
      graphData.push(newDataPoint);
    };
    return graphData;
  }

  let graphData = [];

  useEffect(() => {
    if(data){
      graphData = generateGraphData(cleanData());
      console.log(graphData);
    } else {
      graphData = [];
    } 
  }, [params])

  return (
    <Paper>
      <Chart
        data={graphData}
      >
        {

        }
      </Chart>
    </Paper>
  );
} ;