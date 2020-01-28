import React, { Component } from 'react';
import Dropdown from './dropDown.js'
import { connect } from 'react-redux'
import {
  changeDataType,
  chooseGame,
  changeFinderActive,
  changeInfoType,
  changeGlossaryActive
} from '../actions/index.js'



export class Header extends Component {

  activateFinder = () => {
    //set finderActive to the opposite of what it is
    this.props.changeFinder(!this.props.finderActive)
  }
  switchData = () =>{
    if(this.props.dataType === "lineup"){
      this.props.changeDataType('player')
    }
    else{
      this.props.changeDataType('lineup')
    }
  }

  switchType = () =>{
    if(this.props.infoType === 'overview'){
      this.props.changeInfoType('advanced')
    }
    else{
      this.props.changeInfoType('overview')
    }
  }
  activateGlossary = () =>{
    this.props.changeGlossaryActive(!this.props.glossary);
  }
  render(){
    return (
      <div>
        <header className="App-header">
          <div className = 'header'>
            <div className = 'headerButtonContainer'>
              <button className = "type" onClick = {this.activateFinder}>Lineup Finder</button>
              {this.props.dataType !== 'finder' &&
                <button id = 'switchData' className = "type" onClick = {this.switchData}>{`${this.props.dataType === 'lineup' ?
                  "View Players": "View Lineups"}`}</button>}
                {this.props.dataType=== 'finder' &&
                  <button id = 'back' className = "type" onClick = {this.props.back}>All Lineups</button>}
            </div>
            {(this.props.gameName === '' || this.props.gameName === 'Acc-Totals') &&
              <div className = 'title'>
                <h1>{`${this.props.gameName === '' ? 'Season': 'ACC'}`} Total</h1>
                <div className = 'dropdown'>
                  <Dropdown/>
                </div>
              </div>
            }
            {(this.props.gameName !== '' && this.props.gameName !== 'Acc-Totals' && this.props.dataLoaded) &&
                <div className = 'title'>
                  <div id = 'wakeScore'>Wake Forest: {this.props.individualGames[this.props.gameName].score.wake}</div>
                  <div id = 'oppScore'>
                    {this.props.gameName.replace(/_/g, ' ')}: {this.props.individualGames[this.props.gameName].score.opp}
                  </div>
                <div className = 'dropdown'>
                  <Dropdown default = {this.props.gameName}/>
                </div>
              </div>
            }
            <div className = 'headerButtonContainer'>
              <button id = 'switchType' className = 'type' onClick = {this.switchType}>
              {`${this.props.infoType === 'overview' ? 'Advanced' : 'Overview'}`}</button>

                <button className = "type" onClick = {this.activateGlossary}>{`${this.props.glossary ? 'Back' : 'Glossary'}`}</button>
            </div>
          </div>
        </header>
      </div>
    )
  }
}
export const mapDispatchToProps = dispatch => ({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  changeGame: (game)=> dispatch(chooseGame(game)),
  changeFinder: (active)=> dispatch(changeFinderActive(active)),
  changeInfoType: (infoType)=> dispatch(changeInfoType(infoType)),
  changeGlossaryActive: (active)=> dispatch(changeGlossaryActive(active)),
})
export const mapStateToProps = state =>({
  dataType: state.dataType,
  gameName: state.gameName,
  individualGames: state.individualGames,
  dataLoaded: state.dataLoaded,
  finderActive: state.finderActive,
  infoType: state.infoType,
  glossary: state.glossary,

})
export default connect(mapStateToProps, mapDispatchToProps)(Header);
