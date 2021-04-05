import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart, 
  Legend,
  ScatterSeries, 
  BarSeries, 
  LineSeries,
  ArgumentAxis,
  ValueAxis,
  ZoomAndPan
} from '@devexpress/dx-react-chart-material-ui';
import { scaleBand } from '@devexpress/dx-chart-core';
import { ArgumentScale, Stack } from '@devexpress/dx-react-chart';
import {Plugin} from '@devexpress/dx-react-core';
import './MainGraph.scss'

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
      cleanedEvents[timeStamp] = Number(elem.events);

      maxEvents = Math.max(maxEvents, elem.events);
    });
    rawStats.forEach(elem => {
      const timeStamp = getDate_ms(elem);
      cleanedClicks[timeStamp] = Number(elem.clicks);
      cleanedImpressions[timeStamp] = Number(elem.impressions);
      cleanedRevenue[timeStamp] = Number(elem.revenue);

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

  const labelHalfWidth = interval === 'daily' ? 75 : 100;
  let lastLabelCoordinate;

  const ArgumentLabel = props => {
    const {x, text} = props;

    let options = {month: 'long', day: 'numeric', hour: 'numeric'};
    if (interval === 'daily') options = {month: 'long', day: 'numeric'};

    const newText = new Date(Number(text)).toLocaleDateString([], options);
    if (
      lastLabelCoordinate &&
      lastLabelCoordinate < x &&
      x - lastLabelCoordinate <= labelHalfWidth
    ) {
      return null;
    }
    lastLabelCoordinate = x;
    return <ArgumentAxis.Label {...props} text={newText}/>;
  }
  

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if(data){
      setGraphData(generateGraphData(cleanData()));
      // console.log(graphData);
    } else {
      setGraphData([]);
    } 
  }, [params])

  return (
    <Paper className="graph">
      <Chart
        data={graphData}
      >
        <ArgumentScale factory={scaleBand} />
        <ArgumentAxis 
          labelComponent={ArgumentLabel}
        />
        <ValueAxis />
          <Plugin name="events-chart">
            {type === 'line' && includedData.events && <LineSeries name={'events'} valueField={'events'} argumentField={'xVal'}/>}
            {type === 'bar' && includedData.events && <BarSeries name={'events'} valueField={'events'} argumentField={'xVal'}/>}
            {type === 'scatter' && includedData.events && <ScatterSeries name={'events'} valueField={'events'} argumentField={'xVal'}/>}
          </Plugin>

          <Plugin name="clicks-chart">
            {type === 'line' && includedData.clicks && <LineSeries name={'clicks'} valueField={'clicks'} argumentField={'xVal'}/>}
            {type === 'bar' && includedData.clicks && <BarSeries name={'clicks'} valueField={'clicks'} argumentField={'xVal'}/>}
            {type === 'scatter' && includedData.clicks && <ScatterSeries name={'clicks'} valueField={'clicks'} argumentField={'xVal'}/>}
          </Plugin>
          
          <Plugin name="impressions-chart">
            {type === 'line' && includedData.impressions && <LineSeries name={'impressions'} valueField={'impressions'} argumentField={'xVal'}/>}
            {type === 'bar' && includedData.impressions && <BarSeries name={'impressions'} valueField={'impressions'} argumentField={'xVal'}/>}
            {type === 'scatter' && includedData.impressions && <ScatterSeries name={'impressions'} valueField={'impressions'} argumentField={'xVal'}/>}
          </Plugin>

          <Plugin name="revenue-chart">
            {type === 'line' && includedData.revenue && <LineSeries name={'revenue'} valueField={'revenue'} argumentField={'xVal'}/>}
            {type === 'scatter' && includedData.revenue && <ScatterSeries name={'revenue'} valueField={'revenue'} argumentField={'xVal'}/>}
            {type === 'bar' && includedData.revenue && <BarSeries name={'revenue'} valueField={'revenue'} argumentField={'xVal'}/>}
          </Plugin>
          
          {/* <Plugin name="chart-elem"> */}
            {type === 'bar' && <Stack/>}
            <Legend/>
            <ZoomAndPan/>
          {/* </Plugin> */}
      </Chart>
    </Paper>
  );
} ;