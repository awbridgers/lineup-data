import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import store from './store.js'
import registerServiceWorker from './registerServiceWorker.js'
import Routing from './routing.jsx';


ReactDOM.render(
  <Provider store = {store}>
    <Routing/>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
