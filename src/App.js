import React, { Component } from 'react';
import './App.css';
import {roster} from './lineupClass.js'
import Finder from './containers/finder.jsx'
import DataTable from './containers/dataTable.jsx';
import { connect } from 'react-redux';
import { changeDataType, lineupFinder, changeFinderActive } from './actions/index.js'

export class App extends Component {
  constructor(){
    super();
    this.state = {dataArray: [], playerArray: [], dataType: 'lineup', finder: false,
      player1: "", player2: "", player3: "", player4: "", player5: "", finderArray:[]};
  }
  checkRoster = (array) => {
    let lowerRoster = roster.map(player=>player.toLowerCase());
    let isIncluded = true;
    array.forEach((name)=>{
      if(lowerRoster.includes(name.toLowerCase()) || name === ""){
        //do nothing
      }
      else{
        isIncluded = false;
      }
    });
    return isIncluded;
  }

  handleInput = (e) =>{
    this.setState({[e.target.name]: e.target.value});
  }
  lineupFinder = () =>{
    //add all the input names to array and filter out any spaces left blank
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let fixedArray = tempArray.filter((name) => name!== '');

    //make sure the players are on the team!
    if(!this.checkRoster(fixedArray)){
      alert("One of the players is misspelled or not a member of the team");
    }
    else{
      //choose the overall array for totals or individual game array for just a game
      let fromWhichArray = (this.props.gameName === '') ? this.props.lineups : this.props.individualGames[this.props.gameName].lineup
      //filter and return only lineups where every chosen player is in the lineup
      let reduxArray = fromWhichArray.filter((lineup)=>{
        return fixedArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase()))
      })
      //filter out any lineups with 0 possessions
      const reduxArrayFilter = reduxArray.filter(x => x.possFor!== 0 && x.possAgainst!==0);
      this.props.addLineupFinderInfo(reduxArrayFilter)
      this.props.changeFinder(false);
      this.props.changeDataType('finder');
      }
    }
  render() {
    return (
      <div className="App">
        {this.props.dataLoaded && <DataTable />}

        {this.props.finderActive && <Finder onClick = {this.lineupFinder}
          player1 = {this.state.player1}   player2 = {this.state.player2} player3 = {this.state.player3}
          player4 = {this.state.player4}   player5 = {this.state.player5}
          handleInput = {this.handleInput}/>}
    </div>
    );
  }
}
export const mapDispatchToProps = dispatch =>({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  addLineupFinderInfo: (lineupArray) => dispatch(lineupFinder(lineupArray)),
  changeFinder: (active)=> dispatch(changeFinderActive(active))
})

export const mapStateToProps = state =>({
  lineups: state.lineupData.lineup,
  dataType: state.dataType,
  dataLoaded: state.dataLoaded,
  finderActive: state.finderActive,
  gameName: state.gameName,
  individualGames: state.individualGames,
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
