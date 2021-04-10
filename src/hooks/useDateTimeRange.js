import {useState, useEffect} from "react";

const initMinMaxRange = {
  minDate_ms: 0,
  maxDate_ms: 0,
  minTime_ms: 0,
  maxTime_ms: 0,
  
  minDate_day: 0,
  maxDate_day: 0,

  minTime_hour: 0,
  maxTime_hour: 0
}

const useDateTimeRange = function (interval, data) {
  const [sliderVal, setSliderVal] = useState([0,0]);
  const [minMaxRange, setMinMaxRange] = useState(initMinMaxRange);

  const formatLabel = function(value, interval){
    let options = null;
    if (interval === 'daily'){
      options = {year: 'numeric', month: 'long', day: 'numeric', timeZone:"UTC"};
      value *= 86400000;
    } else {
      options = {year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', timeZone:"UTC"};
      value *= 3600000
    }
    return new Date(value).toLocaleDateString([], options);
  }

  useEffect(() => {
    if(data) {
      const {
        hourlyEvents,
        dailyEvents,
        hourlyStats,
        dailyStats,
        poi
      } = data;

      const minDate_ms = Math.min(new Date(dailyStats[0].date), new Date(dailyEvents[0].date));
      const maxDate_ms = Math.max(new Date(dailyStats[dailyStats.length-1].date), new Date(dailyEvents[dailyEvents.length-1].date));
      
      const minHour = Math.min(hourlyStats[0].hour, hourlyEvents[0].hour);
      const maxHour = Math.max(hourlyStats[hourlyStats.length-1].hour, hourlyEvents[hourlyEvents.length-1].hour);
      const minTime_ms = minDate_ms + minHour*3600000;
      const maxTime_ms = maxDate_ms + maxHour*3600000;
  
      const minDate_day = minDate_ms/86400000;
      const maxDate_day = maxDate_ms/86400000;
      const minTime_hour = minTime_ms/3600000;
      const maxTime_hour = maxTime_ms/3600000;

      setMinMaxRange({
        minDate_ms, maxDate_ms, minTime_ms, maxTime_ms, 
        minDate_day, maxDate_day, 
        minTime_hour, maxTime_hour
      });
    }
  }, [data]);

  useEffect(()=> {
    if(data) {
      let range = [minMaxRange.minDate_day, minMaxRange.maxDate_day];
      // let start = minMaxRange.minDate_ms;
      // let end = minMaxRange.maxDate_ms;
      if (interval !== 'daily') {
        range = [minMaxRange.minTime_hour, minMaxRange.maxTime_hour];
        // start = minMaxRange.minTime_ms;
        // end = minMaxRange.maxTime_ms;
      }
      setSliderVal(range);
      // setParams({...params, start, end});
    }
  }, [interval, minMaxRange]);

  return{
    sliderVal,
    setSliderVal,
    minMaxRange,
    formatLabel
  };
}

export default useDateTimeRange;