import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';


const Routing = () => (
  <Router>
    <div>
    <Route exact path ="/" component = {App} />
    </div>
  </Router>
)

ReactDOM.render(<Routing />, document.getElementById('root'));
registerServiceWorker();
