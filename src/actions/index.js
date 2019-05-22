import roster from '../roster.js';
import { push } from 'connected-react-router'
import Data from '../lineupClass.js'
//------------------------------------Lazy Code---------------------------------
const setPlayerStats = (array) => {
  let playerArray = [];
  roster.forEach((player)=>{
    let playerObject = new Data(player)
    array.forEach((lineup)=>{
      //lineup just refers to a single player in this case
      //if the lineup includes the players name
      if(lineup.lineup.includes(player)){
        updateStats(playerObject, lineup);
      }
    })
    playerArray.push(playerObject);
  })
  return playerArray
}
const updateStats = (lineup, temp) => {
  Object.keys(lineup).forEach((prop)=>{
    if(prop === 'lineup'){
      //do nothing
    }
    else{
      lineup[prop] += temp[prop];
    }
  })
}
//--------------------------ACTIONS START HERE----------------------------------
export const addData = (database) => {
  return dispatch => database.ref().once('value').then((snapshot) => {
    //go through each game in the database and get the info
    let totalStats =[];
    let accStats = [];
    snapshot.forEach((game) => {
      let individualGames = [];
      let accGame = game.child('accGame').val();
      game.child('lineups').forEach((x) => {
        //copy the object from firebase, add the lineup and some calculations for ease
        let temp = {...x.val(),
          lineup: x.key,
          totalShotsFor: x.val().attemptedTwosFor + x.val().attemptedThreesFor,
          totalShotsAgainst: x.val().attemptedTwosAgainst + x.val().attemptedThreesAgainst,
          possFor: x.val().attemptedTwosFor + x.val().attemptedThreesFor -
            x.val().offRebFor + x.val().turnoversFor + (0.475*x.val().ftaFor),
          possAgainst: x.val().attemptedTwosAgainst + x.val().attemptedThreesAgainst -
            x.val().offRebAgainst + x.val().turnoversAgainst + (0.475*x.val().ftaAgainst)
          }
        //since each lineup is unique per game, just push the lineup to the indigames array
        individualGames.push(temp);

        //now check to see if the lineup is unique to the total stats/acc
        let index = totalStats.findIndex((lineup)=>lineup.lineup === temp.lineup);
        let accIndex = accStats.findIndex((lineup)=>lineup.lineup === temp.lineup);
        //if the lineup doesn't exist, push it to the total array
        if(index === -1){
          totalStats.push(temp);
        }
        //if the lineup does exist, update the existing lineup with the stats
        else{
          let newObject = {...totalStats[index]}
          updateStats(newObject,temp);
          totalStats[index] = newObject;
        }
        //if the game is an acc game, we need to add it to the array somewhere
        if(accGame){
          //if the lineup doesn't already exist, push
          if(accIndex === -1){
            accStats.push(temp);
          }
          //if the lineup does exist, update its stats
          else{
            let newObject = {...accStats[index]};
            updateStats(newObject, temp);
            accStats[index] = newObject
          }
        }
      });
      //once through each lineup for the game, add the game to the store
      dispatch({
        type:'STORE_INDIVIDUAL_GAME',
        payload: {
          lineup: individualGames,
          player:setPlayerStats(individualGames).filter((player)=>player.time !==0),
          order: game.child('order').val(),
          score: game.child('score').val()},
        game: game.key
      })
    })
    //once through all lineups of all games, add the totals to the store
    dispatch({
      type: 'STORE_DATA',
      payload: {
        lineup: totalStats,
        player: setPlayerStats(totalStats).filter((player)=>player.time !==0),
        accLineup: accStats,
        accPlayer: setPlayerStats(accStats).filter((player)=>player.time !==0)
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

export const changeInfoType = (infoType) =>({
  type: 'CHANGE_INFO_TYPE',
  infoType
})
