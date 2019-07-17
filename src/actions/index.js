import { push } from 'connected-react-router'

export const changeDataType = dataType =>({
  type: 'CHANGE_DATA_TYPE',
  dataType: dataType
})

export const lineupFinder = (foundLineups) =>({
  type:'ADD_LINEUP_FINDER_INFO',
  payload: foundLineups
})

export const chooseGame = game =>{
  return dispatch => {
    dispatch({
      type:'SELECT_GAME',
      game
    });
    dispatch(push('/'+ game));
  }
}

export const dataLoaded = () =>({
  type: 'LOAD_SUCCESSFUL'
})

export const changeSortType = (prevSort, newSort, array) =>({
  type: 'CHANGE_SORT_TYPE',
  prevSort,
  newSort,
  array
})

export const changeFinderActive = (active)=>({
  type: 'CHANGE_FINDER_ACTIVE',
  payload: active
})

export const changeInfoType = (infoType) =>({
  type: 'CHANGE_INFO_TYPE',
  infoType
})
