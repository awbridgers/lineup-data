class Data {
  constructor(lineup, pointsFor, pointsAgainst,time, reboundsFor, reboundsAgainst, possFor, possAgainst) {
    this.lineup = lineup;
    this.pointsFor = parseInt(pointsFor,10);
    this.pointsAgainst = parseInt(pointsAgainst,10);
    this.time = parseInt(time,10);
    this.reboundsFor = parseInt(reboundsFor, 10);
    this.reboundsAgainst = parseInt(reboundsAgainst,10);
    this.possFor = parseInt(possFor, 10);
    this.possAgainst = parseInt(possAgainst,10);
  }
  updateStats = (temp) => {
    this.pointsFor += temp.pointsFor;
    this.pointsAgainst += temp.pointsAgainst;
    this.time += temp.time;
    this.reboundsFor += temp.reboundsFor;
    this.reboundsAgainst += temp.reboundsAgainst;
    this.possFor += temp.possFor;
    this.possAgainst += temp.possAgainst;
  }
}
let findLineup = (array, lineup) => {
  let index = -1
  array.forEach((x,i) => {
    if(x.lineup === lineup)
    {
      index = i;
    }
  });
  return index;
}



export const addData = (database) => {
  return dispatch => database.ref().once('value').then((snapshot) => {

    let array =[];
    snapshot.forEach((childSnapshot) => {
      let childArray =[]
      childSnapshot.child('lineups').forEach((x) => {
        let temp = new Data (x.key, x.val().pointsFor, x.val().pointsAgainst, x.val().time,
         x.val().reboundsFor, x.val().reboundsAgainst, x.val().possFor, x.val().possAgainst);
        let index = findLineup(array,temp.lineup)
        childArray.push(temp);
        if(index === -1){
          array.push(temp);
        }
        else{
          array[index].updateStats(temp)
        }
      });
      dispatch({
        type:'STORE_INDIVIDUAL_GAME',
        payload: {'lineups': childArray, 'order': childSnapshot.child('order').val(), 'score': childSnapshot.child('score').val()},
        game: childSnapshot.key
      })
    })
    dispatch({
      type: 'STORE_DATA',
      payload: array
    });
  }, (err) => {
    dispatch(
    {type: 'STORE_FAILED'})
  })
}


export const changeDataType = dataType =>({
  type: 'CHANGE_DATA_TYPE',
  dataType: dataType
})

export const lineupFinder = (foundLineups) =>({
  type:'ADD_LINEUP_FINDER_INFO',
  payload: foundLineups
})
