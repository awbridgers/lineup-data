export const finder = (state =[], action) =>{
  switch(action.type){
    case 'ADD_LINEUP_FINDER_INFO':
      return action.payload;
    default:
    return state;
  }
}


export const finderActive = (state = false, action)=>{
  switch(action.type){
    case 'CHANGE_FINDER_ACTIVE':
      return action.payload;
    default:
      return state;
  }
}
