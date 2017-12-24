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
    this.sortTable = this.sortTable.bind(this);
    this.makePlayerArray = this.makePlayerArray.bind(this);
    this.switchData = this.switchData.bind(this);
    this.sortType = "net";

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
      this.setState({dataType: "player", sortType: "net"})
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
  sortTable(e){
    let type = e.target.id;
    let array = this.state.dataArray;
    let playerSort = false;
    if(type.charAt(type.length-1) === "p"){
      playerSort = true;
      array = this.state.playerArray
      type = type.slice(0, -1)
    }
    if(type === this.sortType){         //if the sort type is the same, reverse the order
      array.reverse();
    }
    else{
      if(type === "net"){
        array.sort((a,b)=>{return (a.pointsFor-a.pointsAgainst) - (b.pointsFor -b.pointsAgainst)}).reverse();
        this.sortType = "net";
      }
      else if (type === "pf"){
        array.sort((a,b)=>{return (b.pointsFor) - (a.pointsFor)});
        this.sortType = "pf";
      }
      else if(type === "pa"){
        array.sort((a,b)=>{return (b.pointsAgainst) - (a.pointsAgainst)});
        this.sortType = "pa";
      }
      else if (type === "time"){
        array.sort((a,b)=>{return (b.time) - (a.time)});
        this.sortType = "time";
      }
    }
    if(playerSort){
      this.setState({playerArray: array})
    }
    else{
      this.setState({dataArray: array})
    }
  }
  render() {
    testArray(this.state.playerArray);
    //console.log(this.state.dataArray.length)
    return (
      <div className="App">
        <header className="App-header">
          <div style = {{height: "90px", textAlign: "center", position: "relative", top: "-10px"}}>
          <h1>Season Total</h1>
          </div>
          <Dropdown name = "Season Total"></Dropdown>
            {this.state.dataType === "lineup" &&
              <button className = "type" onClick = {this.switchData}>By Player</button>}
            {this.state.dataType === "player" &&
              <button className = "type" onClick = {this.switchData}>By Lineup</button>}
        </header>
        <div sytle = {{textAlign: 'center'}}>
          {(this.state.dataType === 'player' &&
            <table>
              <tbody>
                <tr>
                    <th>Player</th>
                    <th  style = {{width: "14%"}}className = "click" id = "timep" onClick = {this.sortTable}>Time</th>
                    <th  style = {{width: "10%"}}className = "click" id = "pfp" onClick = {this.sortTable}>PF</th>
                    <th  style = {{width: "10%"}}className = "click" id = "pap" onClick = {this.sortTable}>PA</th>
                    <th style = {{width: "10%"}}className = "click" id = "netp" onClick = {this.sortTable}>+/-</th>

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
                  <th  style = {{width: "14%"}}className = "click" id = "time" onClick = {this.sortTable}>Time</th>
                  <th  style = {{width: "10%"}}className = "click" id = "pf" onClick = {this.sortTable}>PF</th>
                  <th  style = {{width: "10%"}}className = "click" id = "pa" onClick = {this.sortTable}>PA</th>
                  <th style = {{width: "10%"}}className = "click" id = "net" onClick = {this.sortTable}>+/-</th>

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
