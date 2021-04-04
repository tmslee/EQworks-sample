import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from 'axios';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './Application.scss'
import AppNavBar from "./AppNavbar/AppNavbar";
import HomePage from "./HomePage/HomePage";
import ChartVis from "./ChartVis/ChartVis";
import DataTable from "./DataTable/DataTable";
import GeoVis from "./GeoVis/GeoVis";

export default function Application() {


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
            />
          )}
        />
        <Route
          path="/data_table" exact render={props => (
            <DataTable {...props}
            />
          )}
        />
        <Route
          path="/geo_vis" exact render={props => (
            <GeoVis {...props}
            />
          )}
        />
      </Switch>
    </Router>
  );
};