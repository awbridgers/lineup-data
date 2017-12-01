import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import config from './config.js'
import * as firebase from 'firebase'
import Games from "./games.js";

firebase.initializeApp(config);


let testArray = (array) => array.forEach((x) => console.log(x));


export default class Routing extends Component{
  constructor(){
    super();
    this.app = firebase.database().ref();
    this.state ={teamArray: []};
  }
  componentWillMount(){
    this.tempArray =[];
    this.app.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        this.tempArray.push(childSnapshot.key);
      })
      this.setState({teamArray: this.tempArray});
    })
  }
  render(){
    return (
      <Router>
        <div>
        <Route exact path ="/" component = {App} />
        {this.state.teamArray.map((x,i) => {
          return (
            <Route key={i} path = {"/"+x} render={props => <Games gameName = {x} {...props} />} />
          )
        })
      }

        </div>
      </Router>
    )
  }
}

ReactDOM.render(<Routing />, document.getElementById('root'));
registerServiceWorker();
