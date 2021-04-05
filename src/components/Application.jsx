import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from 'axios';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './Application.scss'
import AppNavBar from "./AppNavbar/AppNavbar";
import HomePage from "./HomePage/index";
import ChartVis from "./ChartVis/index";
import DataTable from "./DataTable/index";
import GeoVis from "./GeoVis/index";
import useAPIData from "../hooks/useAPIData";

export default function Application() {

  const {data, getAPIData} = useAPIData();

  console.log(data);
  
  return (
    <Router>
      <AppNavBar/>
      <Switch>
        <Route 
          path="/" exact render={props => (
            <HomePage {...props}
            />
          )}
        />
        <Route
          path="/chart_vis" exact render={props => (
            <ChartVis {...props}
              data={data}
            />
          )}
        />
        <Route
          path="/data_table" exact render={props => (
            <DataTable {...props}
              data={data}
            />
          )}
        />
        <Route
          path="/geo_vis" exact render={props => (
            <GeoVis {...props}
              data={data}
            />
          )}
        />
      </Switch>
    </Router>
  );
};