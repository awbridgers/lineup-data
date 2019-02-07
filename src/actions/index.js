import roster from '../roster.js';
import { push } from 'connected-react-router'
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
}
const updateStats = (lineup, temp) => {
  lineup.pointsFor += temp.pointsFor;
  lineup.pointsAgainst += temp.pointsAgainst;
  lineup.time += temp.time;
  lineup.reboundsFor += temp.reboundsFor;
  lineup.reboundsAgainst += temp.reboundsAgainst;
  lineup.possFor += temp.possFor;
  lineup.possAgainst += temp.possAgainst;
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
    //go through each game and get the needed data
    let array =[];
    let playerArray = [];
    snapshot.forEach((childSnapshot) => {
      let childArray =[], childPlayerArray = [];
      //create a new object for each lineup and add it to an array
      childSnapshot.child('lineups').forEach((x) => {
        let temp = new Data (x.key, x.val().pointsFor, x.val().pointsAgainst, x.val().time,
         x.val().reboundsFor, x.val().reboundsAgainst, x.val().possFor, x.val().possAgainst);
        let index = findLineup(array,temp.lineup)
        //push the lineup to the childArray: this array is for individaul games, and each lineup already has stats added up
        childArray.push(temp);
        //if the lineup doesn't exist, push it to the total array
        if(index === -1){
          array.push(temp);
        }
        //if the lineup does exist, update the existing lineup with the stats
        else{
          //create a new object to update and set put it in the array at the index
          let newObject = {...array[index]}
          updateStats(newObject,temp);
          array[index] = newObject;
        }
      });
      //setup the player stats for each inidiviual game
      roster.forEach((name)=>{
        let wakePlayer = new Data(name,0,0,0,0,0,0,0);
        childArray.forEach((lineup)=>{
          if(lineup.lineup.includes(name)){
            updateStats(wakePlayer, lineup);
          }
        })
        childPlayerArray.push(wakePlayer)
      })
      //push the child array for the individual game with the lineups and player stats for each game.
      dispatch({
        type:'STORE_INDIVIDUAL_GAME',
        payload: {
          lineup: childArray,
          player:childPlayerArray.filter((player)=>player.time !==0),
          order: childSnapshot.child('order').val(),
          score: childSnapshot.child('score').val()},
        game: childSnapshot.key
      })
    })
    //setup the player stats for the total season
    roster.forEach((name)=>{
      let wakePlayer = new Data(name,0,0,0,0,0,0,0);
      array.forEach((lineup)=>{
        if(lineup.lineup.includes(name)){
          updateStats(wakePlayer, lineup);
        }
      })
      playerArray.push(wakePlayer)
    })
    //push the total data to store for all of the game added together
    dispatch({
      type: 'STORE_DATA',
      payload: {
        lineup: array,
        player: playerArray.filter((player)=>player.time !==0)
      }
    });
  },(err)=>{
    console.log(err)
  }).then(()=>{
    //tell the app that all data is loaded
    dispatch({
      type: "LOAD_SUCCESSFUL"
    })
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

export const chooseGame = game =>{
  return dispatch => {
    dispatch({
      type:'SELECT_GAME',
      game
    });
    dispatch(push('/'+ game));
  }
}

export const dataLoaded = () =>({
  type: 'LOAD_SUCCESSFUL'
})

export const changeSortType = (prevSort, newSort, array) =>({
  type: 'CHANGE_SORT_TYPE',
  prevSort,
  newSort,
  array
})

export const changeFinderActive = (active)=>({
  type: 'CHANGE_FINDER_ACTIVE',
  payload: active
})
