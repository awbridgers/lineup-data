import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import * as firebase from 'firebase';
import rootReducer from './reducers/index.js';
import { createBrowserHistory } from 'history';
import {addData} from './actions/index.js'
import { routerMiddleware } from 'connected-react-router'

export const history = createBrowserHistory();

const store = createStore(
  rootReducer(history),
  undefined,
  compose(applyMiddleware(routerMiddleware(history),thunk),  window.devToolsExtension ? window.devToolsExtension() : f => f)
)
store.dispatch(addData(firebase.database()))


export default store;
