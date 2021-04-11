import React, {useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';

import './DataTableComponent.scss';

export default function DataTableComponent (props) {
  const {queryRes} = props;

  const [tableData, setTableData] = useState(queryRes);


  // const sortQueryRes = function(sortBy, ascend) {
  //   setTableData(tableData.sort((data1, data2) => {
  //     if(sortBy === 'date'){

  //     }
  //   }))
  // }
  
  useEffect(()=> {
    setTableData(queryRes);
  }, [queryRes])

  const parsedTableHead = function (data) {
    const head = [];
    const keys = Object.keys(data);
    let counter = 0;
    head.push(<th key={counter}>date</th>)
    counter++;
    if(keys.includes("hour")) {
      head.push(<th key={counter}>hour</th>);
      counter++;
    }
    if(keys.includes("events_poi")) {
      head.push(<th key={counter}>event location</th>);
      counter++;
    }
    if(keys.includes("events")) {
      head.push(<th key={counter}>events</th>);
      counter++;
    }
    if(keys.includes("stats_poi")) {
      head.push(<th key={counter}>stats location</th>);
      counter++;
    }
    if(keys.includes("clicks")) {
      head.push(<th key={counter}>clicks</th>);
      counter++;
    }
    if(keys.includes("impressions")) {
      head.push(<th key={counter}>impressions</th>);
      counter++;
    }
    if(keys.includes("revenue")) {
      head.push(<th key={counter}>revenue</th>);
      counter++;
    }
    return head;
  }



  const parsedTableRow = function (data) {
    const row = [];
    const keys = Object.keys(data);
    let counter = 0;
    const options = {
      year:'numeric',
      month:'long',
      day: 'numeric',
      timeZone:'UTC'
    };
    row.push(<td key={counter}>{new Date(data.date).toLocaleDateString([], options)}</td>);
    counter++;
    if(keys.includes("hour")){
      row.push(<td key={counter}>{data.hour}</td>);
      counter++;
    }
    if(keys.includes("events_poi")){
      row.push(<td key={counter}>{data.events_poi}</td>);
      counter++;
    }
    if(keys.includes("events")){
      row.push(<td key={counter}>{data.events}</td>);
      counter++;
    }
    if(keys.includes("stats_poi")){
      row.push(<td key={counter}>{data.stats_poi}</td>);
      counter++;
    }
    if(keys.includes("clicks")){
      row.push(<td key={counter}>{data.clicks}</td>);
      counter++;
    }
    if(keys.includes("impressions")){
      row.push(<td key={counter}>{data.impressions}</td>);
      counter++;
    }
    if(keys.includes("revenue")){
      row.push(<td key={counter}>{data.revenue}</td>);
      counter++;
    }
    return row;
  }

  const parsedTableBody = function (tableData) {
    return tableData.map((data, idx) => {
      return (
        <tr key={idx}>
          {parsedTableRow(data)}
        </tr>
      );
    });
  }

  return (
    <>
      {tableData.length == 0 && <p>fetching data...</p>}
      {tableData.length > 0 &&
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {parsedTableHead(tableData[0])}
            </tr>
          </thead>
          
          <tbody>
            {parsedTableBody(tableData)}
          </tbody>
        </Table>
      }
    </>
    
    
  );
}