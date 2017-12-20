import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js'
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';

const fixTime = seconds => {
  let secs = Math.round(seconds);

  if (secs < 0) throw new Error('Seconds must be positive');

  if (secs < 60) {
    if (secs < 10) return "0:0" + secs;

    return "0:" + secs;
  }

  let minuteDivisor = secs % (60 * 60);
  let minutes = Math.floor(minuteDivisor / 60);

  let secondDivisor = minuteDivisor % 60;
  let remSecs = Math.ceil(secondDivisor);

  if (remSecs < 10 && remSecs > 0) remSecs = "0" + remSecs;
  if (remSecs === 0) remSecs = remSecs + "0";

  let time = {
    m: minutes,
    s: remSecs
  };

  return time.m + ":" + time.s;
};

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

class App extends Component {
  constructor(){
    super();

    this.ref = firebase.database().ref();
    this.state = {dataArray: []};
    this.sortTable = this.sortTable.bind(this);
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
  sortTable(e){
    const type = e.target.id;
    let array = this.state.dataArray;
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
    this.setState({dataArray: array})
  }
  render() {
    //console.log(this.state.dataArray.length)
    return (
      <div className="App">
        <header className="App-header">
          <div style = {{height: "90px"}}>
          <h1 style = {{position: "relative", top: "-10px"}}>Season Total</h1>
          </div>
          <Dropdown name = "Season Total"></Dropdown>
        </header>
        <table>
          <tbody>
            <tr>
              <th style = {{width: "65%"}}>Lineup</th>
              <th className = "click" id = "time" onClick = {this.sortTable}>Time</th>
              <th className = "click" id = "pf" onClick = {this.sortTable}>Points <br />For</th>
              <th className = "click" id = "pa" onClick = {this.sortTable}>Points Against</th>
              <th className = "click" id = "net" onClick = {this.sortTable}> + &frasl; -</th>
            </tr>
        {this.state.dataArray.map((x,i) => {
          return (
            <tr key ={i} style = {{ fontSize: "20px", fontFamily: "Tahoma, Verdana, Segoe, sans-serif"}}>
              <td>{x.lineup}</td><td>{fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
            </tr>
          )
        })
        }
        </tbody>
        </table>
      </div>
    );
  }
}

export default App;
