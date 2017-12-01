import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js'
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';




let testArray = (array) => array.forEach((x) => console.log(x));
class Data {
  constructor(lineup, value) {
    this.lineup = lineup;
    this.value = value;
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

           let temp = new Data (x.key, x.val());
           let index = findLineup(array,temp.lineup)
           if(index === -1){
             array.push(temp);
           }
           else{
             array[index].value += temp.value
           }
         });
         })
        array.sort((a,b)=>{return a.value - b.value}).reverse();

       this.setState({dataArray: array});
     })
  }
  reverseOrder(){
    this.setState({dataArray: this.state.dataArray.reverse()});
    this.ascending = !this.ascending;
  }
  render() {
    console.log(this.state.dataArray.length)
    return (
      <div className="App">
        <header className="App-header">
          <h1 style = {{position: "relative", top: "-10px"}}>Season Total</h1>
          <Dropdown name = "Season Total"></Dropdown>
        </header>
        <table>
          <tbody>
            <tr>
              <th style = {{width: "85%"}}>Lineup</th><th>
                <button style = {{background: "#42444e", width:"100%", border: "none"}} onClick = {this.reverseOrder}><b>+&frasl;-</b></button></th>
            </tr>
        {this.state.dataArray.map((x,i) => {
          return (
            <tr key ={i}>
              <td>{x.lineup}</td><td>{x.value}</td>
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
