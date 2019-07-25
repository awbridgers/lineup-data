import React from 'react';
import App from './App';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './containers/header.js'

//Routing is not needed for this App in its current iteration, however,
//I didn't want to just delete it in the event that I would use it in the
//future


const Routing = () => (
  <Router>
    <div>
      <Route path = "/" component = {Header} />
      <Route path ="/" component = {App} />
    </div>
  </Router>
)

export default Routing
