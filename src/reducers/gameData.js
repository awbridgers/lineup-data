
export const lineupData = (state =[], action) =>{
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
