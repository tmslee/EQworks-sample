import {useState, useEffect} from 'react';
import axios from 'axios';

const defaultQuery = {
  interval: 'hourly',
  minDate: null,
  minHour: 0,
  maxDate: null,
  maxHour: 0,
  events: true,
  clicks: true,
  impressions: true,
  revenue: true,
  searchTerm: "",
  sortBy: "date",
  descending: false
};

const useTableQuery = function (){
  const [filterQuery, setFilterQuery] = useState(defaultQuery);
  const [queryRes, setQueryRes] = useState([]);

  const msToDateTime = function (timeStamp_ms){
    const options = {
      year:"numeric",
      month:"2-digit",
      day:"2-digit",
      hour:"2-digit",
      timeZone: "UTC"
    };
    const dateString = new Date(timeStamp_ms).toLocaleDateString([], options);
    const [day, month, year] = dateString.substring(0,10).split("/");
    const dateTime = {
      date: `${year}-${month}-${day}T00:00:00.000Z`,
      time: Number(dateString.substring(dateString.length-2, dateString.length))
    }
    return dateTime;
  }

  const setInterval = function(interval){
    setFilterQuery({...filterQuery, interval});
  }

  const setDateTimeRange = function(range, interval){
    // console.log("range: ", range);

    let [minRange, maxRange] = range;
    const multiplier = interval === 'daily' ? 86400000 : 3600000;
    minRange *= multiplier;
    maxRange *= multiplier;

    // console.log(minRange);
    // console.log(maxRange);

    const minDateTime = msToDateTime(minRange);
    const maxDateTime = msToDateTime(maxRange);

    // console.log("minDateTime: ", minDateTime);
    // console.log("maxDateTime: ", maxDateTime);

    setFilterQuery({
      ...filterQuery, 
      minDate: minDateTime.date,
      minHour: minDateTime.time,
      maxDate: maxDateTime.date,
      maxHour: maxDateTime.time
    })
  }

  const setIncludedData = function(dataName, include){
    switch(dataName){
      case 'events':
        setFilterQuery({...filterQuery, events:include});
        break;
      case 'clicks':
        setFilterQuery({...filterQuery, clicks:include});
        break;
      case 'revenue':
        setFilterQuery({...filterQuery, revenue:include});
        break;
      case 'impressions':        
      setFilterQuery({...filterQuery, impressions:include});
        break;
      default:
        return;
    }
    return;
  }

  const setSearchTerm = function(term){
    setFilterQuery({...filterQuery, searchTerm: term});
  }

  const setSortBy = function (sortBy) {
    setFilterQuery({...filterQuery, sortBy});
  }
  
  const setDescending = function (descending) {
    setFilterQuery({...filterQuery, descending});
  }

  const setSortOptions = function (sortBy, descending){
    setFilterQuery({...filterQuery, sortBy, descending});
  }

  useEffect(() => {
    axios.get(`/tableData/${filterQuery.interval}`, {params:filterQuery})
    .then(res => {
      setQueryRes(res.data);
    }).catch(e => {
      setQueryRes([]);
      console.log(e);
    });
  }, [filterQuery]);



  return {
    filterQuery,
    setInterval,
    setDateTimeRange,
    setIncludedData,
    setSearchTerm,
    setSortBy,
    setDescending,
    setSortOptions,
    queryRes,
    setQueryRes
  };
}

export default useTableQuery;