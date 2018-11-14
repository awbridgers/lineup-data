import React, { Component } from 'react';
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import roster from "./roster.js"
import convert from 'convert-seconds';
import Finder from './finder.jsx'
import DataTable from './dataTable.jsx'



const checkRoster = (array) => {
  let isIncluded = true;
  array.forEach((name)=>{
    if(roster.includes(name) || name === ""){
      //do nothing
    }
    else{
      isIncluded = false;
    }
  });
  return isIncluded;
}

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


const setUpName = (array) =>{
  roster.forEach((name) =>{
    array.push(new Data (name, 0, 0, 0,0,0,0,0));
  })
}
const fixName = (string) => {
  string = Array.from(string);      //convert string to array
  string.forEach((x,i) => {       //itereate through
    if(x === '_'){                //if x is a -, change it to a space
      string[i] = " ";
    }
  })
  return string.join("");
}

const adjustName = (string) => {
  string = Array.from(string);      //convert string to array
  string.forEach((x,i) => {       //itereate through
    if(x === '_'){                //if x is a -, change it to a space
      string[i] = " ";
    }
    else if (x === "@"){
      string[i] = "";
    }
  })
  return string.join("");
}


export default class Game extends Component {
  constructor(props){
    super(props);
    this.ref = firebase.database().ref(this.props.gameName);
    this.state = {dataArray: [], wakeScore: 0, oppScore: 0, loading:true, dataType: "lineup", playerArray:[],
      finder: false, player1: "", player2: "", player3: "", player4: "", player5: "", finderArray:[]};
    this.ascending = true;
    this.opponent = fixName(this.props.gameName);
    this.sortLineupType = 'net';
    this.sortArrayType = 'lineup';

  }
  componentWillMount(){
     this.getData = this.ref.once('value').then((snapshot) => {
       let array =[];
       snapshot.child('lineups').forEach((x)=>{
         array.push(new Data (x.key, x.val().pointsFor, x.val().pointsAgainst, x.val().time,
          x.val().reboundsFor, x.val().reboundsAgainst, x.val().possFor, x.val().possAgainst));
       });
       let wakeScore = snapshot.child('score').child('wake').val();
       let oppScore = snapshot.child('score').child("opp").val();

       array.sort((a,b)=> {return(a.pointsFor-a.pointsAgainst)-(b.pointsFor-b.pointsAgainst)}).reverse();

       this.setState({dataArray: array, wakeScore: wakeScore, oppScore: oppScore, loading:false});
       this.makePlayerArray();
     });


   }
   makePlayerArray = () => {
     let tempArray =[];
     let playerArray =[];
     setUpName(tempArray)   //add all of the players to the array for searching
     //for each player, search the lineups for them and add the data to their own
     tempArray.forEach((player)=> {
       this.state.dataArray.forEach((data)=>{
         if(data.lineup.includes(player.lineup)){
           player.pointsFor += data.pointsFor;
           player.pointsAgainst += data.pointsAgainst;
           player.time += data.time;
           player.reboundsFor += data.reboundsFor;
           player.reboundsAgainst += data.reboundsAgainst;
           player.possFor += data.possFor;
           player.possAgainst += data.possAgainst
         }
       });
     });
     //remove any players that did not play
     tempArray.forEach((data,i) =>{
       if(data.time === 0 && data.pointsFor === 0 && data.pointsAgainst === 0){
         //do nothing
       }
       else{
         playerArray.push(tempArray[i]);
       }
     })
     playerArray.sort((a,b)=> {return(a.pointsFor-a.pointsAgainst)-(b.pointsFor-b.pointsAgainst)}).reverse();
     this.setState({playerArray: playerArray});
   }
   switchData = () => {
     if(this.state.dataType === "lineup"){
       if(this.state.playerArray.length === 0){
         this.makePlayerArray();
       }
       this.setState({dataType: "player"});
     }
     else{
       this.setState({dataType: "lineup"});
     }
   }
   sortLineupTable = (e, dataType) =>{
     let type = e.target.id;
     let array;
     switch(dataType){
       case 'player':
         array = this.state.playerArray;
         break;
       case 'lineup':
         array = this.state.dataArray;
         break;
       case 'finder':
         array = this.state.finderArray;
         break;
       default:
         break;
     }
     if(type === this.sortLineupType && dataType === this.sortArrayType){         //if the sort type is the same, reverse the order
       array.reverse();
     }
     else{
       if(type === "net"){
         array.sort((a,b)=>{return (b.pointsFor-b.pointsAgainst) - (a.pointsFor - a.pointsAgainst)});
         this.sortLineupType = "net";
       }
       else if (type === "pf"){
         array.sort((a,b)=>{return (b.pointsFor) - (a.pointsFor)});
         this.sortLineupType = "pf";
       }
       else if(type === "pa"){
         array.sort((a,b)=>{return (b.pointsAgainst) - (a.pointsAgainst)});
         this.sortLineupType = "pa";
       }
       else if (type === "time"){
         array.sort((a,b)=>{return (b.time) - (a.time)});
         this.sortLineupType = "time";
       }
       else if (type === "reb"){
         array.sort((a,b)=>{return (b.reboundsFor - b.reboundsAgainst) - (a.reboundsFor - a.reboundsAgainst)});
         this.sortLineupType = "reb";
       }
       else if (type === "offRating"){
         array.sort((a,b)=>{return this.returnOffRating(b) - this.returnOffRating(a)});
         this.sortLineupType = "offRating";
       }
       else if (type === "defRating"){
         array.sort((a,b)=>{return this.returnDefRating(a) - this.returnDefRating(b)});
         this.sortLineupType = "defRating";
       }

     }
       this.sortArrayType = dataType;
       if(dataType === 'lineup'){
         this.setState({dataArray: array});
       }
       else if(dataType === 'player'){
         this.setState({playerArray: array});
       }
       else if(dataType === 'finder'){
         this.setState({finderArray: array});
       }
   }

   activateFinder = () => {
     this.setState({finder:true});
     console.log(this.state.finder)
   }
   handleInput = (e) =>{
     this.setState({[e.target.name]: e.target.value});
   }
   lineupFinder = () =>{
     let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
     let fixedArray =[];
     tempArray.forEach((name,i) => {
       if(name !== ""){
         fixedArray.push(tempArray[i]);
       }
     })

     if(!checkRoster(fixedArray)){
       alert("One of the players is misspelled or not a member of the team");
     }
     else{
       let finderArray =[];
       this.state.dataArray.forEach((lineup) => {
         if(fixedArray.every(name => lineup.lineup.includes(name))){
           finderArray.push(lineup);
         }});
         this.setState({finderArray: finderArray, dataType: "finder",finder: false});
       }
     }
  back = () =>{
    this.setState({dataType: 'lineup', finder:false});
  }
  cancel = () =>{
    this.setState({finder:false});
  }
  returnOffRating = (player) =>{
    const rating = Math.round((player.pointsFor/player.possFor)*100)
    return isFinite(rating) ? rating : 1
  }
  returnDefRating = (player) =>{
    const rating = Math.round((player.pointsAgainst/player.possAgainst)*100)
    return isFinite(rating) ? rating : 1
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className = 'gamesHeader'>
            <div className = 'inline'>
              <button className = "finderButton" onClick = {this.activateFinder}>Lineup Finder</button>
            </div>
            <div className = 'inline'>
              <div className = 'gameScore'>
                <div id = 'wakeScore'>Wake Forest: {this.state.wakeScore}</div>
                <div id = 'oppScore'>{adjustName(this.props.gameName)}: {this.state.oppScore}</div>
              </div>
              <Dropdown name = {this.props.gameName}/>
            </div>
            <div className = 'inline'>
              {this.state.dataType === "lineup" &&
                <button className = "type" onClick = {this.switchData}>View Players</button>}
              {this.state.dataType === "player" &&
                <button className = "type" onClick = {this.switchData}>View Lineups</button>}
              {this.state.dataType=== 'finder' &&
                <button className = "back" onClick = {this.back}>Back</button>}
            </div>
          </div>
        </header>

          <DataTable dataType = {this.state.dataType} dataArray = {this.state.dataArray}
              playerArray = {this.state.playerArray} finderArray = {this.state.finderArray} sort ={this.sortLineupTable}/>
        
        {this.state.finder && <Finder onClick = {this.lineupFinder} cancel = {this.cancel}
          player1 = {this.state.player1}   player2 = {this.state.player2} player3 = {this.state.player3}
          player4 = {this.state.player4}   player5 = {this.state.player5}
          handleInput = {this.handleInput}/>}
      </div>
    );
  }
}
