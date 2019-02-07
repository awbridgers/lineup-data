import { lineupData } from './gameData.js';
import { individualGames } from './individualGames.js'
import { gameName } from './gameName.js'
import { addData } from '../actions/index.js';
import { dataType } from './dataType.js'
import { finder, finderActive } from './finder.js'
import { dataLoaded} from './dataLoaded.js'
import { sort } from './sort.js'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  lineupData,
  individualGames,
  gameName,
  addData,
  dataType,
  finder,
  finderActive,
  dataLoaded,
  sort,
})

export default rootReducer
