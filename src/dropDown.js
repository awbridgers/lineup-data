import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js'
import * as firebase from 'firebase'
import {HashRouter as Router, Route, Switch, Link, Redirect, withRouter} from 'react-router-dom';

class Game {
  constructor(name,order){
    this.name = name;
    this.order = order;
  }
}
let testArray = (array) => array.forEach((x) => console.log(x));
let fixName = (string) => {
  string = Array.from(string);      //convert string to array
  string.forEach((x,i) => {       //itereate through
    if(x === '_'){                //if x is a -, change it to a space
      string[i] = " ";
    }
  })
  return string.join("");         //join the array back to a string a return
}

 class Dropdown extends Component {
  constructor(){
    super();
    //this.db = firebase.initializeApp(config);
    this.ref = firebase.database().ref();
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {gameList: [], redirect: false};
  }
  componentWillMount(){
    this.ref.once('value').then((snapshot) => {
      let array =[];
      snapshot.forEach((childSnapshot) => {
        //console.log(childSnapshot.key)
        array.push(new Game (childSnapshot.key,childSnapshot.child('order').val()));
      })
      array.sort((a,b)=>{return(a.order - b.order)});
      this.setState({gameList: array, redirect: false})
    })
  }

  handleSelect(event){
    this.selection = event.target.value;
    this.props.history.push("/" + this.selection);

  }
  render(){

    //testArray(this.state.gameList)
    return (
      <select onChange = {this.handleSelect} style = {{position: "absolute",left: "0", right: "0",margin: "auto", top: "80px" }}>
        <option disabled selected value> -- select a game -- </option>
        <option value = "">Season Total</option>
        {this.state.gameList.map((x,i)=> {
          return (
            <option key = {i} value = {x.name}>{fixName(x.name)}</option>
          )
        })}
      </select>
    )
  }
}
export default withRouter(Dropdown);
