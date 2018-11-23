
export const lineupData = (state =['TEST'], action) =>{
  switch(action.type){
    case 'STORE_DATA':
      return action.payload

    default:
      return state;
  }
}
