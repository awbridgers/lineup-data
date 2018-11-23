import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import roster from './roster.js'
import Finder from './finder.jsx'
import DataTable from './dataTable.jsx';
import { connect } from 'react-redux';
import { changeDataType, lineupFinder } from './actions/index.js'



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
const setUpName = (array) =>{
  roster.forEach((name) =>{
    array.push(new Data (name, 0, 0, 0,0,0,0,0));
  })
}
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



class App extends Component {
  constructor(){
    super();

    this.ref = firebase.database().ref();
    this.state = {dataArray: [], playerArray: [], dataType: 'lineup', finder: false,
      player1: "", player2: "", player3: "", player4: "", player5: "", finderArray:[]};
    this.sortLineupType = 'net';
    this.sortArrayType = 'lineup';


  }
  componentDidMount(){
     this.getData = this.ref.once('value').then((snapshot) => {
       let array =[];

       snapshot.forEach((childSnapshot) => {
         //console.log(childSnapshot.key)
         childSnapshot.child('lineups').forEach((x) => {
           //console.log(x.val());
           let temp = new Data (x.key, x.val().pointsFor, x.val().pointsAgainst, x.val().time,
            x.val().reboundsFor, x.val().reboundsAgainst, x.val().possFor, x.val().possAgainst);
           let index = findLineup(array,temp.lineup)
           if(index === -1){
             array.push(temp);
           }
           else{
             array[index].pointsFor += temp.pointsFor;
             array[index].pointsAgainst += temp.pointsAgainst;
             array[index].time += temp.time;
             array[index].reboundsFor += temp.reboundsFor;
             array[index].reboundsAgainst += temp.reboundsAgainst;
             array[index].possFor += temp.possFor;
             array[index].possAgainst += temp.possAgainst;
           }
         });
         })
        array.sort((a,b)=>{return (a.pointsFor-a.pointsAgainst) - (b.pointsFor -b.pointsAgainst)}).reverse();
       this.setState({dataArray: array});
       this.makePlayerArray();
     })
  }
  switchData = () =>{
    if(this.state.dataType === "lineup"){
      this.setState({dataType: "player"});
      this.props.changeDataType('player')
    }
    else{
      this.setState({dataType: "lineup"})
      this.props.changeDataType('lineup')
    }
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
          player.possAgainst += data.possAgainst;
        }
      });
    });
    //remove any players that did not play
    tempArray.forEach((data,i) =>{
      if(data.time !== 0){
        playerArray.push(tempArray[i]);
      }
    })
    playerArray.sort((a,b)=> {return(a.pointsFor-a.pointsAgainst)-(b.pointsFor-b.pointsAgainst)}).reverse();
    this.setState({playerArray: playerArray});
  }
  sortLineupTable = (e, dataType) =>{
    // console.log(e.target.id)
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
    //console.log(this.state.finder)
  }
  handleInput = (e) =>{
    this.setState({[e.target.name]: e.target.value});
  }
  lineupFinder = () =>{
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let fixedArray = tempArray.filter((name) => name!== '');

    if(!checkRoster(fixedArray)){
      alert("One of the players is misspelled or not a member of the team");
    }
    else{
      let finderArray =[];
      this.state.dataArray.forEach((lineup) => {
        if(fixedArray.every(name => lineup.lineup.includes(name))){
          finderArray.push(lineup);
        }});
      let reduxArray = this.props.lineups.filter((lineup)=> fixedArray.every(name => lineup.lineup.includes(name)))
      this.props.addLineupFinderInfo(reduxArray)

        this.setState({finderArray: finderArray, dataType: "finder",finder: false});
        this.props.changeDataType('finder');
      }
    }
  back = () =>{
    this.setState({dataType: 'lineup', finder:false});
    this.props.changeDataType('lineup')
  }
  cancel = () =>{
    this.setState({finder:false});
  }
  returnOffRating = (player) =>{
    const rating = Math.round((player.pointsFor/player.possFor)*100)
    //for the purposes of sorting, if the offRating is infinite or NaN, return a small number (so its always last)
    return isFinite(rating) ? rating : -1
  }
  returnDefRating = (player) =>{
    const rating = Math.round((player.pointsAgainst/player.possAgainst)*100)
    //for the purposes of sorting def Rating, infinity or NaN should return a big number (goes last in sort for Def Rating)
    return isFinite(rating) ? rating : 1000
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className = 'header'>
            <div>
              <button className = "finderButton" onClick = {this.activateFinder}>Lineup Finder</button>
            </div>
            <div className = 'title'>
              <h1>Season Total</h1>
              <Dropdown/>
            </div>
            <div>
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
const mapDispatchToProps = dispatch =>({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  addLineupFinderInfo: (lineupArray) => dispatch(lineupFinder(lineupArray))
})

const mapStateToProps = state =>({
  lineups: state.lineupData,
  dataType: state.dataType
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
