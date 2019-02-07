export const gameName = (state = '', action)=>{
  switch(action.type){
    case 'SELECT_GAME':
      return action.game
    default:
      return state
  }
}
