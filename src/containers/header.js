import React, { Component } from 'react';
import Dropdown from './dropDown.js'
import {roster} from '../lineupClass.js'
import { connect } from 'react-redux'
import { changeDataType, chooseGame, changeFinderActive, changeInfoType } from '../actions/index.js'
import { withRouter } from 'react-router'



class Header extends Component {

  activateFinder = () => {
    //set finderActive to the opposite of what it is
    this.props.changeFinder(!this.props.finderActive)
  }
  handleInput = (e) =>{
    this.setState({[e.target.name]: e.target.value});
  }
  checkRoster = (array) => {
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

  lineupFinder = () =>{
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let fixedArray = tempArray.filter((name) => name!== '');

    if(!this.checkRoster(fixedArray)){
      alert("One of the players is misspelled or not a member of the team");
    }
    else{
      let finderArray =[];
      this.state.dataArray.forEach((lineup) => {
        if(fixedArray.every(name => lineup.lineup.includes(name))){
          finderArray.push(lineup);
        }
      });
    let reduxArray = this.props.lineups.filter((lineup)=> fixedArray.every(name => lineup.lineup.includes(name)))
    this.props.addLineupFinderInfo(reduxArray)
    this.setState({finderArray: finderArray, dataType: "finder",finder: false});
    this.props.changeDataType('finder');
    }
  }
  switchData = () =>{
    if(this.props.dataType === "lineup"){
      this.props.changeDataType('player')
    }
    else{
      this.props.changeDataType('lineup')
    }
  }
  back = () =>{
    this.props.changeDataType('lineup')
  }
  switchType = () =>{
    if(this.props.infoType === 'overview'){
      this.props.changeInfoType('advanced')
    }
    else if(this.props.infoType === 'advanced'){
      this.props.changeInfoType('overview')
    }
  }
  cancel = () =>{
    this.setState({finder:false});
  }
  render(){
    return (
      <div>
        <header className="App-header">
          <div className = 'header'>
            <div className = 'headerButtonContainer'>
              <button className = "finderButton" onClick = {this.activateFinder}>Lineup Finder</button>
            </div>
            {(this.props.gameName === '' || this.props.gameName === 'Acc-Totals') &&
              <div className = 'title'>
                <h1>Season Total</h1>
                <Dropdown/>
              </div>
            }
            {(this.props.gameName !== '' && this.props.gameName !== 'Acc-Totals' && this.props.dataLoaded) &&
              <div className = 'inline'>
                <div className = 'gameScore'>
                  <div id = 'wakeScore'>Wake Forest: {this.props.individualGames[this.props.gameName].score.wake}</div>
                  <div id = 'oppScore'>
                    {this.props.gameName.replace(/_/g, ' ')}: {this.props.individualGames[this.props.gameName].score.opp}
                  </div>
                </div>
                <Dropdown default = {this.props.gameName}/>
              </div>
            }
            <div className = 'headerButtonContainer'>
              <button className = 'type' onClick = {this.switchType}>
              {`${this.props.infoType === 'overview' ? 'Advanced' : 'Overview'}`}</button>
            {this.props.dataType !== 'finder' &&
              <button className = "type" onClick = {this.switchData}>{`${this.props.dataType === 'lineup' ?
                "View Players": "View Lineups"}`}</button>}
              {this.props.dataType=== 'finder' &&
                <button className = "type" onClick = {this.back}>Back</button>}
            </div>
          </div>
        </header>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  changeGame: (game)=> dispatch(chooseGame(game)),
  changeFinder: (active)=> dispatch(changeFinderActive(active)),
  changeInfoType: (infoType)=> dispatch(changeInfoType(infoType)),

})
const mapStateToProps = state =>({
  dataType: state.dataType,
  gameName: state.gameName,
  individualGames: state.individualGames,
  path: state.router.location.pathname,
  dataLoaded: state.dataLoaded,
  finderActive: state.finderActive,
  infoType: state.infoType

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
