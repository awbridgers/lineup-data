import roster from '../roster.js';
import { push } from 'connected-react-router'
import Data from '../lineupClass.js'


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


export const addData = (database) => {
  return dispatch => database.ref().once('value').then((snapshot) => {
    //go through each game in the database and get the info
    let totalStats =[];
    let playerArray = [];
    snapshot.forEach((game) => {
      let individualGames = [], individualGamesPlayerArray = [];
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

        //now check to see if the lineup is unique to the total stats
        let index = totalStats.findIndex((lineup)=>lineup.lineup === temp.lineup)
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
      });
      //ALL LINEUPS FOR THE GAME HAVE BEEN ADDED
      //now add the player stats for each game
      roster.forEach((name)=>{
        let wakePlayer = new Data(name)
        individualGames.forEach((player)=>{
          //if the lineup includes the players name, add it to existing player stats
          if(player.lineup.includes(name)){
            updateStats(wakePlayer, player);
          }
        })
        //after all the stats are updated for the player, push the player to array
        individualGamesPlayerArray.push(wakePlayer)
      })
      //now that the lineup and player data for the game are added,
      //add the individual game data to the store
      dispatch({
        type:'STORE_INDIVIDUAL_GAME',
        payload: {
          lineup: individualGames,
          player:individualGamesPlayerArray.filter((player)=>player.time !==0),
          order: game.child('order').val(),
          score: game.child('score').val()},
        game: game.key
      })
    })
    //do the same as before but with the total season stats for players
    roster.forEach((name)=>{
      let wakePlayer = new Data(name);
      totalStats.forEach((lineup)=>{
        if(lineup.lineup.includes(name)){
          updateStats(wakePlayer, lineup);
        }
      })
      playerArray.push(wakePlayer)
    })
    //and add the total season stats to the store
    dispatch({
      type: 'STORE_DATA',
      payload: {
        lineup: totalStats,
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

export const changeInfoType = (infoType) =>({
  type: 'CHANGE_INFO_TYPE',
  infoType
})
