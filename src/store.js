import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import 'firebase/database';
import rootReducer from './reducers/index.js';
import { createBrowserHistory } from 'history';
import {addData} from './actions/index.js'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools} from 'redux-devtools-extension'

export const history = createBrowserHistory();

const store = createStore(
  rootReducer(history),
  undefined,
  composeWithDevTools(applyMiddleware(routerMiddleware(history),thunk))
)
store.dispatch(addData(firebase.database()))


export default store;
