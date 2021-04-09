import {useState, useEffect} from 'react';
import axios from 'axios';

const defaultQuery = {
  interval: 'daily',
  minDate: null,
  minHour: null,
  maxDate: null,
  maxHour: null,
  events: true,
  clicks: true,
  impressions: true,
  revenue: true,
  searchTerm: ""
};

const useTableQuery = function (){
  const [filterQuery, setFilterQuery] = useState(defaultQuery);
  const [queryRes, setQueryRes] = useState([]);

  const resetQuery = function(){
    setFilterQuery(defaultQuery);
  }

  const setDateRange = function(dateRange){

  }

  const setHourRange = function(hourRange){

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
  
  useEffect(()=> {
    resetQuery();
  }, [])

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
    setDateRange,
    setHourRange,
    setIncludedData,
    setSearchTerm,
    queryRes
  };
}

export default useTableQuery;