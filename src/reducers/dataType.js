export const dataType = (state = 'lineup', action)=>{
  switch(action.type){
    case 'CHANGE_DATA_TYPE':
      return action.dataType;
    default:
      return state

  }
}
