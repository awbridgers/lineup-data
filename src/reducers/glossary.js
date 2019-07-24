export const glossary = (state = false, action) =>{
  switch(action.type){
    case 'CHANGE_GLOSSARY_ACTIVE':
      return action.payload;
    default:
      return state;
  }
}
