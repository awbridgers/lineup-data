export const infoType = (state = 'overview', action)=>{
  switch(action.type){
    case 'CHANGE_INFO_TYPE':
      return action.infoType;
    default:
      return state
  }
}
