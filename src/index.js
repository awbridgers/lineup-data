import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routing from './routing.jsx'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store from './store.js'
import registerServiceWorker from './registerServiceWorker.js'
import {history} from './store.js'







ReactDOM.render(
  <Provider store = {store}>
    <ConnectedRouter history = {history}>
      <Routing />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
