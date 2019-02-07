export const dataLoaded = (state = false, action) =>{
  switch(action.type){
    case 'LOAD_SUCCESSFUL':
      return true
    default:
      return state;
  }
}
