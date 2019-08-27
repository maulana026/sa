import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Jemputsaya from './Jemputsaya/Jemputsaya';
import Infoangkot from './Infoangkot/Infoangkot';
import Seputarangkot from './Seputarangkot/Seputarangkot';

function App() {
  return (
    <div className="App">
      <Router>
      <nav id="navatas">
        <div id="navatascontent" className="ui button teal">
          <Link to="/">
            <h1>Smart Angkot</h1>
          </Link>
        </div>
      </nav>
      
      <div>
        
          <div id="navbottom" className="ui bottom fixed menu">
            <div id="navbottomcontent" className="ui bottom teal three item inverted menu">
              <Link to="/" className="item">
                Home
              </Link>
              <Link to="/infoangkot/" className="item">
                Info Angkot
              </Link>
              <Link to="/seputarangkot/" className="item">
                Seputar Angkot
              </Link>
            </div>
          </div>
          <Route exact path="/" component={Home} />
          <Route path="/jemputsaya/:idAngkot/:toknn" component={Jemputsaya} />
          <Route path="/infoangkot/" component={Infoangkot} />
          <Route path="/seputarangkot/" component={Seputarangkot} />
        
      </div>
      </Router>
    </div>
  );
}

export default App;
