import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js'
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import roster from './roster.js'
import convert from "convert-seconds"

const fixTime = seconds => {
  let secs = convert(seconds).seconds
  if(secs < 10){
    secs = "0" + secs;
  }
  const minutes = convert(seconds).minutes + (convert(seconds).hours*60);
  return minutes + ":" + secs;
}
let testArray = (array) => array.forEach((x) => console.log(x));
class Data {
  constructor(lineup, pointsFor, pointsAgainst,time) {
    this.lineup = lineup;
    this.pointsFor = parseInt(pointsFor,10);
    this.pointsAgainst = parseInt(pointsAgainst,10);
    this.time = parseInt(time,10);
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
    array.push(new Data (name, 0, 0, 0));
  })
}

class App extends Component {
  constructor(){
    super();

    this.ref = firebase.database().ref();
    this.state = {dataArray: [], playerArray: [], dataType: 'lineup'};
    this.sortLineupTable = this.sortLineupTable.bind(this);
    this.sortPlayerTable = this.sortPlayerTable.bind(this);
    this.makePlayerArray = this.makePlayerArray.bind(this);
    this.switchData = this.switchData.bind(this);
    this.sortLineupType = 'net';
    this.sortPlayerType = 'net';


  }
  componentDidMount(){
     this.getData = this.ref.once('value').then((snapshot) => {
       let array =[];

       snapshot.forEach((childSnapshot) => {
         //console.log(childSnapshot.key)
         childSnapshot.child('lineups').forEach((x) => {
           //console.log(x.val());
           let temp = new Data (x.key, x.val().pointsFor, x.val().pointsAgainst, x.val().time);
           let index = findLineup(array,temp.lineup)
           if(index === -1){
             array.push(temp);
           }
           else{
             array[index].pointsFor += temp.pointsFor;
             array[index].pointsAgainst += temp.pointsAgainst;
             array[index].time += temp.time;
           }
         });
         })
        array.sort((a,b)=>{return (a.pointsFor-a.pointsAgainst) - (b.pointsFor -b.pointsAgainst)}).reverse();

       this.setState({dataArray: array});
     })
  }
  switchData(){
    if(this.state.dataType === "lineup"){
      if(this.state.playerArray.length === 0){
        this.makePlayerArray();
      }
      this.setState({dataType: "player"});
    }
    else{
      this.setState({dataType: "lineup"})
    }
  }
  makePlayerArray(){
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
        }
      });
    });
    //remove any players that did not play
    tempArray.forEach((data,i) =>{
      if(data.time != 0 && data.pointsFor != 0 && data.pointsAgainst != 0){
        playerArray.push(tempArray[i]);
      }
    })
    playerArray.sort((a,b)=> {return(a.pointsFor-a.pointsAgainst)-(b.pointsFor-b.pointsAgainst)}).reverse();
    this.setState({playerArray: playerArray});
  }
  sortLineupTable(e){
    let type = e.target.id;
    let array = this.state.dataArray;
    if(type === this.sortLineupType){         //if the sort type is the same, reverse the order
      array.reverse();
    }
    else{
      if(type === "net"){
        array.sort((a,b)=>{return (a.pointsFor-a.pointsAgainst) - (b.pointsFor -b.pointsAgainst)}).reverse();
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
    }
      this.setState({dataArray: array});
  }
  sortPlayerTable(e){
    let type = e.target.id;
    let array = this.state.playerArray;
    if(type === this.sortPlayerType){         //if the sort type is the same, reverse the order
      array.reverse();
    }
    else{
      if(type === "net"){
        array.sort((a,b)=>{return (a.pointsFor-a.pointsAgainst) - (b.pointsFor -b.pointsAgainst)}).reverse();
        this.sortPlayerType = "net";
      }
      else if (type === "pf"){
        array.sort((a,b)=>{return (b.pointsFor) - (a.pointsFor)});
        this.sortPlayerType = "pf";
      }
      else if(type === "pa"){
        array.sort((a,b)=>{return (b.pointsAgainst) - (a.pointsAgainst)});
        this.sortPlayerType = "pa";
      }
      else if (type === "time"){
        array.sort((a,b)=>{return (b.time) - (a.time)});
        this.sortPlayerType = "time";
      }
    }
      this.setState({playerArray: array});
  }
  render() {
    //testArray(this.state.playerArray);
    //console.log(this.state.dataArray.length)
    return (
      <div className="App">
        <header className="App-header">
          <div style = {{height: "90px", textAlign: "center", position: "relative"}}>
          <h1>Season Total</h1>
          <Dropdown name = "Season Total"></Dropdown>
          </div>
            {this.state.dataType === "lineup" &&
              <button className = "type" onClick = {this.switchData}>View Players</button>}
            {this.state.dataType === "player" &&
              <button className = "type" onClick = {this.switchData}>View Lineups</button>}

        </header>
        <div sytle = {{textAlign: 'center'}}>
          {(this.state.dataType === 'player' &&
            <table>
              <tbody>
                <tr>
                    <th>Player</th>
                    <th  style = {{width: "14%"}}className = "click" id = "time" onClick = {this.sortPlayerTable}>Time</th>
                    <th  style = {{width: "10%"}}className = "click" id = "pf" onClick = {this.sortPlayerTable}>PF</th>
                    <th  style = {{width: "10%"}}className = "click" id = "pa" onClick = {this.sortPlayerTable}>PA</th>
                    <th style = {{width: "10%"}}className = "click" id = "net" onClick = {this.sortPlayerTable}>+/-</th>

                </tr>
            {this.state.playerArray.map((x,i) => {
              return (
                <tr key ={i} style = {{height: "58px", fontSize: "calc(8px + .8vw)", fontFamily: "Tahoma, Verdana, Segoe, sans-serif"}}>
                  <td>{x.lineup}</td><td>{fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
                </tr>
              )
            })
            }
            </tbody>
            </table>
          )}
          {(this.state.dataType === 'lineup' &&
          <table>
            <tbody>
              <tr>
                  <th>Lineup</th>
                  <th  style = {{width: "14%"}}className = "click" id = "time" onClick = {this.sortLineupTable}>Time</th>
                  <th  style = {{width: "10%"}}className = "click" id = "pf" onClick = {this.sortLineupTable}>PF</th>
                  <th  style = {{width: "10%"}}className = "click" id = "pa" onClick = {this.sortLineupTable}>PA</th>
                  <th style = {{width: "10%"}}className = "click" id = "net" onClick = {this.sortLineupTable}>+/-</th>

              </tr>
          {this.state.dataArray.map((x,i) => {
            return (
              <tr key ={i} style = {{height: "58px", fontSize: "calc(8px + .8vw)", fontFamily: "Tahoma, Verdana, Segoe, sans-serif"}}>
                <td>{x.lineup}</td><td>{fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
              </tr>
            )
          })
          }
          </tbody>
          </table>
        )}
      </div>
    </div>
    );
  }
}

export default App;
