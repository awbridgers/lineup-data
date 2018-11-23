import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routing from './routing.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import registerServiceWorker from './registerServiceWorker.js'









ReactDOM.render(<Provider store = {store}><Routing /></Provider>, document.getElementById('root'));
registerServiceWorker();
