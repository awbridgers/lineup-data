import React, { Component } from 'react';
import Dropdown from './dropDown.js'
import roster from './roster.js'
import { connect } from 'react-redux'
import { changeDataType, chooseGame } from './actions/index.js'
import { withRouter } from 'react-router'


class Header extends Component {
  constructor(props){
    super(props)
    this.State = { player1: "", player2: "", player3: "", player4: "", player5: "", finder: false}

  }
  activateFinder = () => {
    this.setState({finder:true});
    //console.log(this.state.finder)
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
        }});
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
    this.setState({finder:false});
    this.props.changeDataType('lineup')
  }
  cancel = () =>{
    this.setState({finder:false});
  }
  render(){
    return (
      <div>
        <header className="App-header">
          <div className = 'header'>
            <div>
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
            <div>
              {this.props.dataType === "lineup" &&
                <button className = "type" onClick = {this.switchData}>View Players</button>}
              {this.props.dataType === "player" &&
                <button className = "type" onClick = {this.switchData}>View Lineups</button>}
              {this.props.dataType=== 'finder' &&
                <button className = "back" onClick = {this.back}>Back</button>}
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

})
const mapStateToProps = state =>({
  dataType: state.dataType,
  gameName: state.gameName,
  individualGames: state.individualGames,
  path: state.router.location.pathname,
  dataLoaded: state.dataLoaded

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
