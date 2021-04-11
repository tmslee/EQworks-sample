import {useState, useEffect} from 'react'
import axios from 'axios';

const useGeoData = function (){
  const [geoData, setGeoData] = useState(null);
  const [minMaxDays, setMinMaxDays] = useState([0,0]);

  useEffect(() => {
    const eventsDay = axios.get('geo/events/day');
    const eventsTot = axios.get('geo/events/total');
    const statsDay = axios.get('geo/stats/day');
    const statsTot = axios.get('geo/stats/total');
    Promise.all([eventsDay, eventsTot, statsDay, statsTot])
    .then(res => {
      setGeoData({
        eventsDay: res[0].data, 
        eventsTot: res[1].data,
        statsDay: res[2].data,
        statsTot: res[3].data
      });
    }).catch(e => {
      console.log(e);
    })
  }, []);

  useEffect(() => {
    console.log(geoData);
    if(geoData){
      const{
        eventsDay,
        statsDay
      } = geoData;
      const min = Math.min(new Date(eventsDay[0].date), new Date(statsDay[0].date));
      const max = Math.max(new Date(eventsDay[eventsDay.length-1].date), new Date(statsDay[statsDay.length-1].date));
      setMinMaxDays([min, max]);
    }
  }, [geoData]);

  return {
    geoData,
    minMaxDays
  };
}
export default useGeoData;