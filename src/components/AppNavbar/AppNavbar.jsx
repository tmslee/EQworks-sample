import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {useHistory} from "react-router-dom";

export default function AppNavBar (props) {
  const history = useHistory();

  const handleNavClick = function (url) {
    history.push(url);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand 
        onClick={() => handleNavClick("/")}
      >EQ Works Sample Work</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link 
            onClick={() => handleNavClick("/chart_vis")}
            >
            chart visualizations
          </Nav.Link>
          <Nav.Link 
            onClick={() => handleNavClick("/data_table")}
            >
            data table
          </Nav.Link>
          <Nav.Link 
            onClick={() => handleNavClick("/geo_vis")}
            >
            geo visualization
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};