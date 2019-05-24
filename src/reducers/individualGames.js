export const individualGames = (state ={}, action) =>{
  switch(action.type){
    case 'STORE_INDIVIDUAL_GAME':
      return {...state, [action.game]: action.payload}

    default:
      return state;
  }
}
