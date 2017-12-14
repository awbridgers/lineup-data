import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js'
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import secToMin from "sec-to-min";




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
    this.reverseOrder = this.reverseOrder.bind(this);
    this.ascending = true;

  }
  componentDidMount(){
     this.getData = this.ref.once('value').then((snapshot) => {
       let array =[];

       snapshot.forEach((childSnapshot) => {
         //console.log(childSnapshot.key)
         childSnapshot.child('lineups').forEach((x) => {
           console.log(x.val());
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
  reverseOrder(){
    this.setState({dataArray: this.state.dataArray.reverse()});
    this.ascending = !this.ascending;
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
              <th style = {{width: "55%"}}>Lineup</th>
              <th>Time</th>
              <th>Points For</th>
              <th>Points Against</th>
              <th className = "click" onClick = {this.reverseOrder}> + &frasl; -
              </th>
            </tr>
        {this.state.dataArray.map((x,i) => {
          return (
            <tr key ={i} style = {{height: "58px"}}>
              <td>{x.lineup}</td><td>{secToMin(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
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
