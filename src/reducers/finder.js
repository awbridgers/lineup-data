export const finder = (state =[], action) =>{
  switch(action.type){
    case 'ADD_LINEUP_FINDER_INFO':
      return action.payload;
    default:
    return state;
  }
}
