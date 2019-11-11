import React, { Component } from 'react';
import './App.css';
import {roster} from './lineupClass.js'
import Finder from './containers/finder.jsx'
import DataTable from './containers/dataTable.jsx';
import {Glossary} from './components/glossary.js';
import { connect } from 'react-redux';
import { changeDataType, lineupFinder, changeFinderActive } from './actions/index.js'



export class App extends Component {
  constructor(){
    super();
    this.state = {
      dataArray: [],
      playerArray: [],
      dataType: 'lineup',
      finder: false,
      player1: "",
      player2: "",
      player3: "",
      player4: "",
      player5: "",
      finderArray:[],
      omit1: '',
      omit2: '',
      omit3: '',
      omit4: '',
      omit5: '',
    };
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

  handleInput = (e, num) =>{
    this.setState({['player'+num]: e.target.value});
  }
  handleOmit = (e, num) =>{
    this.setState({['omit'+num]:e.target.value})
  }
  lineupFinder = () =>{
    //add all the input names to array and filter out any spaces left blank
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let omitArray = [this.state.omit1,this.state.omit2,this.state.omit3,this.state.omit4,this.state.omit5]
    let fixedArray = tempArray.filter((name) => name!== '');
    let omitPlayersArray = omitArray.filter(name=>name!== '');

    //make sure the players are on the team!
    if(!this.checkRoster(fixedArray)){
      alert("One of the players is misspelled or not a member of the team");
    }
    else{
      //choose the overall array for totals or individual game array for just a game
      let fromWhichArray = (this.props.gameName === '') ? this.props.lineups : this.props.individualGames[this.props.gameName].lineup
      //filter and return only lineups where every chosen player is in the lineup
      let reduxArray = fromWhichArray.filter((lineup)=>{
        return fixedArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase())) &&
        omitPlayersArray.every(name => !lineup.lineup.toLowerCase().includes(name.toLowerCase()))
      })
      //filter out any lineups with 0 possessions
      const reduxArrayFilter = reduxArray.filter(x => x.possFor!== 0 && x.possAgainst!==0);
      this.props.addLineupFinderInfo(reduxArrayFilter)
      this.props.changeFinder(false);
      this.props.changeDataType('finder');
      }
    }
  render() {
    if(this.props.glossary){
      return <div className = 'App'><Glossary /></div>
    }
    return (
      <div className="App">
        {this.props.dataLoaded && <DataTable />}
        {this.props.finderActive &&
          <Finder onClick = {this.lineupFinder}
            player1 = {this.state.player1}
            player2 = {this.state.player2}
            player3 = {this.state.player3}
            player4 = {this.state.player4}
            player5 = {this.state.player5}
            omit1 = {this.state.omit1}
            omit2 = {this.state.omit2}
            omit3 = {this.state.omit3}
            omit4v= {this.state.omit4}
            omit5 = {this.state.omit5}
            handleInput = {this.handleInput}
            handleOmit = {this.handleOmit}
          />
        }
    </div>
    );
  }
}
export const mapDispatchToProps = dispatch =>({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  addLineupFinderInfo: (lineupArray) => dispatch(lineupFinder(lineupArray)),
  changeFinder: (active)=> dispatch(changeFinderActive(active)),
})

export const mapStateToProps = state =>({
  lineups: state.lineupData.lineup,
  dataType: state.dataType,
  dataLoaded: state.dataLoaded,
  finderActive: state.finderActive,
  gameName: state.gameName,
  individualGames: state.individualGames,
  glossary: state.glossary
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
