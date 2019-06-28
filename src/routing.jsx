import React, { Component } from 'react';
import App from './App';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database'
import config from './config.js'
import { connect } from 'react-redux'
import Header from './containers/header.js'
import { chooseGame } from './actions/index.js'


firebase.initializeApp(config)

class Routing extends Component{
  componentDidMount(){
    const path = this.props.path.replace('/', '')
    if(this.props.gameName !== path ){
      this.props.changeGame(path)
    }
  }
  componentDidUpdate(prevProps){
    if(this.props.dataLoaded && this.props.gameName !== this.props.path.replace('/','')){
      this.props.changeGame(this.props.path.replace('/',''))
    }
  }
  render(){
    return (
      <Router>
        <div>
          <Route path = "/" component = {Header} />
          <Route path ="/" component = {App} />
        </div>
      </Router>
    )
  }
}
const mapDispatchToProps = dispatch =>({
  changeGame: (game)=>dispatch(chooseGame(game)),
})
const mapStateToProps = state =>({
  individualGames: state.individualGames,
  gameName: state.gameName,
  dataLoaded: state.dataLoaded,
  path: state.router.location.pathname,
  routerAction: state.router.location.action,
})
export default connect(mapStateToProps, mapDispatchToProps)(Routing)
