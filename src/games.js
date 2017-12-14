import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import config from './config.js'
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import secToMin from 'sec-to-min';

import logo from './logo.svg';




class Data {
  constructor(lineup, pointsFor, pointsAgainst,time) {
    this.lineup = lineup;
    this.pointsFor = parseInt(pointsFor,10);
    this.pointsAgainst = parseInt(pointsAgainst,10);
    this.time = parseInt(time,10);
  }
}
let fixName = (string) => {
  string = Array.from(string);      //convert string to array
  string.forEach((x,i) => {       //itereate through
    if(x === '_'){                //if x is a -, change it to a space
      string[i] = " ";
    }
  })
  return string.join("");
}

export default class Game extends Component {
  constructor(props){
    super(props);
    this.ref = firebase.database().ref(this.props.gameName);
    this.state = {dataArray: [], wakeScore: 0, oppScore: 0, loading:true};
    this.reverseOrder = this.reverseOrder.bind(this);
    this.ascending = true;
    this.opponent = fixName(this.props.gameName);
  }
  componentWillMount(){
     this.getData = this.ref.once('value').then((snapshot) => {
       let array =[];
       snapshot.child('lineups').forEach((x)=>{
         array.push(new Data(x.key, x.val().pointsFor,x.val().pointsAgainst, x.val().time));
       });
       let wakeScore = snapshot.child('score').child('wake').val();
       let oppScore = snapshot.child('score').child("opp").val();

       array.sort((a,b)=> {return(a.pointsFor-a.pointsAgainst)-(b.pointsFor-b.pointsAgainst)}).reverse();

       this.setState({dataArray: array, wakeScore: wakeScore, oppScore: oppScore, loading:false});
     });
   }
  reverseOrder(){
    this.setState({dataArray: this.state.dataArray.reverse()});
    this.ascending = !this.ascending;
  }
  render(){

    return (
      <div className="App">
        <header className="App-header">
          <div style = {{position: "relative", top: "-30px", fontSize: "25px"}}><p>Wake Forest: {this.state.wakeScore}</p>
          <p style ={{position: "relative", top: "-28px", marginBottom: "0px"}}>{fixName(this.props.gameName)}: {this.state.oppScore}</p></div>
          <Dropdown></Dropdown>

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
