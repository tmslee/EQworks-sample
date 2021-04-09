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
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [queryRes, setQueryRes] = useState([]);

  const resetQuery = function(){
    setSearchQuery(defaultQuery);
  }

  const setDateRange = function(dateRange){

  }

  const setHourRange = function(hourRange){

  }

  const setIncludedData = function(dataName, include){
    switch(dataName){
      case 'events':
        setSearchQuery({...searchQuery, events:include});
        break;
      case 'clicks':
        setSearchQuery({...searchQuery, clicks:include});
        break;
      case 'revenue':
        setSearchQuery({...searchQuery, revenue:include});
        break;
      case 'impressions':        
        setSearchQuery({...searchQuery, impressions:include});
        break;
      default:
        return;
    }
    return;
  }

  const setSearchTerm = function(term){
    setSearchQuery({...searchQuery, searchTerm: term});
  }
  
  useEffect(()=> {
    resetQuery();
  }, [])

  useEffect(() => {
    axios.get(`/tableData/${searchQuery.interval}`, {params:searchQuery})
    .then(res => {
      setQueryRes(res.data);
    }).catch(e => {
      setQueryRes([]);
      console.log(e);
    });
  }, [searchQuery]);

  return {
    searchQuery,
    setDateRange,
    setHourRange,
    setIncludedData,
    setSearchTerm,
    queryRes
  };
}

export default useTableQuery;