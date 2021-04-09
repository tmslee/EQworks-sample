import React from 'react';
import {} from 'react-bootstrap';
import axios from 'axios';

export default function DataTable (props) {

  

  axios.get('/all/daily', {params:{butt:123}}).then(res =>{
    console.log("hi");
  });

  return (
    <p>Data Table</p>
  );
}