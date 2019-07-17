import * as actions from '../index.js';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('actions',()=>{
  it('changes dataType',()=>{
    expect(actions.changeDataType('lineup')).toEqual({
      type:'CHANGE_DATA_TYPE',
      dataType: 'lineup'
    })
  })
  it('adds lineups to finder',()=>{
    expect(actions.lineupFinder(['foundLineups'])).toEqual({
      type: 'ADD_LINEUP_FINDER_INFO',
      payload: ['foundLineups']
    })
  })
  it('chooses game',()=>{
    const mockStore = configureMockStore([thunk]);
    let store = mockStore();
    store.dispatch(actions.chooseGame('Wake_Forest'));
    const expectedActions = [{
        type: 'SELECT_GAME',
        game: 'Wake_Forest'
      },
      {
        type: '@@router/CALL_HISTORY_METHOD',
        payload: {
          method: 'push',
          args: ['/Wake_Forest']
        }
      }]
    expect(store.getActions()).toEqual(expectedActions)
  })
  it('changes dataLoaded when data loads',()=>{
    expect(actions.dataLoaded()).toEqual({
      type: 'LOAD_SUCCESSFUL'
    })
  })
  it('changes sortType',()=>{
    expect(actions.changeSortType('net', 'ortg','lineup')).toEqual({
      type: 'CHANGE_SORT_TYPE',
      prevSort: 'net',
      newSort: 'ortg',
      array: 'lineup'
    })
  })
  it('changes finderActive',()=>{
    expect(actions.changeFinderActive(true)).toEqual({
      type: 'CHANGE_FINDER_ACTIVE',
      payload: true
    })
  })
  it('changes infoType',()=>{
    expect(actions.changeInfoType('advanced')).toEqual({
      type: 'CHANGE_INFO_TYPE',
      infoType: 'advanced'
    })
  })
})
