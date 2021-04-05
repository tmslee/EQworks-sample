import {useEffect, useState} from "react";
import axios from 'axios';

const useAPIData = () => {
  const [data, setData] = useState(null);

  const getAPIData = function () {
    const hourlyEventsPromise = axios.get('/api/events/hourly');
    const dailyEventsPromise = axios.get('/api/events/daily');
    const hourlyStatsPromise = axios.get('/api/stats/hourly');
    const dailyStatsPromise = axios.get('/api/stats/daily');
    const poiPromise = axios.get('/api/poi');

    Promise.all([
      hourlyEventsPromise,
      dailyEventsPromise,
      hourlyStatsPromise,
      dailyStatsPromise,
      poiPromise
    ]).then(res => {
      setData({
        hourlyEvents: res[0].data,
        dailyEvents: res[1].data,
        hourlyStats: res[2].data,
        dailyStats: res[3].data,
        poi: res[4].data
      })
    });
  }

  useEffect(() => {
    getAPIData();
  }, [])

  return {
    data,
    getAPIData
  };
};

export default useAPIData;