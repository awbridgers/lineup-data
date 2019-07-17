import { createStore } from 'redux';
import rootReducer from '../index.js';
import { lineupData } from '../gameData.js';
import { individualGames } from '../individualGames.js'
import { gameName } from '../gameName.js'

import { dataType } from '../dataType.js'
import { finder, finderActive } from '../finder.js'
import { dataLoaded} from '../dataLoaded.js'
import { sort } from '../sort.js'
import {infoType} from '../infoType.js'
import { accData } from '../accData.js'
import { createBrowserHistory } from 'history';

describe('root reducer',()=>{
  it('creates a store',()=>{
    let store = createStore(rootReducer(createBrowserHistory));
    expect(store.getState().lineupData).toEqual(lineupData(undefined,{}));
    expect(store.getState().individualGames).toEqual(individualGames(undefined,{}));
    expect(store.getState().gameName).toEqual(gameName(undefined,{}));
    expect(store.getState().dataType).toEqual(dataType(undefined,{}));
    expect(store.getState().finder).toEqual(finder(undefined,{}));
    expect(store.getState().finderActive).toEqual(finderActive(undefined,{}));
    expect(store.getState().dataLoaded).toEqual(dataLoaded(undefined,{}));
    expect(store.getState().sort).toEqual(sort(undefined,{}));
    expect(store.getState().infoType).toEqual(infoType(undefined,{}));
    expect(store.getState().accData).toEqual(accData(undefined,{}));
  })

})
