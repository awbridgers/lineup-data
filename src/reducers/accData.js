export const accData = (state = [], action) => {
  switch(action.type){
    case 'STORE_DATA':
      return {
        lineup: action.payload.accLineup,
        player: action.payload.accPlayer
      }
    default:
      return state;
  }
}
