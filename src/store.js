import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk';
import { lineupData } from './reducers/gameData.js';
import { individualGames } from './reducers/individualGames.js'
import { addData } from './actions/index.js';
import { dataType } from './reducers/dataType.js'
import { finder } from './reducers/finder.js'
import * as firebase from 'firebase'

const store = createStore(
  combineReducers({lineupData, individualGames, dataType, finder}),
  undefined,
  compose(applyMiddleware(thunk),  window.devToolsExtension ? window.devToolsExtension() : f => f)
)
store.dispatch(addData(firebase.database()))


export default store;
