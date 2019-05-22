
export const lineupData = (state =['TEST'], action) =>{
  switch(action.type){
    case 'STORE_DATA':
      return {
        lineup: action.payload.lineup,
        player: action.payload.player
      }

    default:
      return state;
  }
}
