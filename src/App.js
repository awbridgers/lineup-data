import React, { Component } from 'react';
import './App.css';
import {roster} from './lineupClass.js'
import Finder from './containers/finder.jsx'
import DataTable from './containers/dataTable.jsx';
import {Glossary} from './components/glossary.js';
import { connect } from 'react-redux';
import { changeDataType, lineupFinder, changeFinderActive } from './actions/index.js'
import Header from './containers/header.js'



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
      exclusive: 'and'
    };
  }
  activateFinder = () => {
    //set finderActive to the opposite of what it is
    if(this.props.changeFinderActive)
    this.props.changeFinder(!this.props.finderActive)
  }
  resetFinder = () =>{
    this.setState({
      omit1: '',
      omit2: '',
      omit3: '',
      omit4: '',
      omit5: '',
      player1: "",
      player2: "",
      player3: "",
      player4: "",
      player5: ""
    })
  }
  back = () =>{
    this.setState({
      omit1: '',
      omit2: '',
      omit3: '',
      omit4: '',
      omit5: '',
      player1: "",
      player2: "",
      player3: "",
      player4: "",
      player5: ""
    })
    this.props.changeDataType('lineup')
  }
  handleInput = (e, num) =>{
    this.setState({['player'+num]: e.target.value});
  }
  handleOmit = (e, num) =>{
    this.setState({['omit'+num]:e.target.value})
  }
  changeExclusive = (e) =>{
    this.setState({exclusive: e.target.value})
  }
  lineupFinder = () =>{
    //add all the input names to array and filter out any spaces left blank
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let omitArray = [this.state.omit1,this.state.omit2,this.state.omit3,this.state.omit4,this.state.omit5]
    let fixedArray = tempArray.filter((name) => name!== '');
    let omitPlayersArray = omitArray.filter(name=>name!== '');

    //choose the overall array for totals or individual game array for just a game
    let fromWhichArray = (this.props.gameName === '') ? this.props.lineups : this.props.individualGames[this.props.gameName].lineup
    //filter and return only lineups where every chosen player is in the lineup
    let reduxArray;
    if(this.state.exclusive === 'or'){
      reduxArray = fromWhichArray.filter((lineup)=>{
        return fixedArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase())) &&
        omitPlayersArray.every(name => !lineup.lineup.toLowerCase().includes(name.toLowerCase()))
      })
    }
    else{
      reduxArray = fromWhichArray.filter((lineup)=>{
        return omitPlayersArray.length > 0 ?
        fixedArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase())) &&
        !omitPlayersArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase())) :

        fixedArray.every(name => lineup.lineup.toLowerCase().includes(name.toLowerCase()))
      })
    }
    //filter out any lineups with 0 possessions
    const reduxArrayFilter = reduxArray.filter(x => x.possFor!== 0 && x.possAgainst!==0);
    this.props.addLineupFinderInfo(reduxArrayFilter)
    this.props.changeFinder(false);
    this.props.changeDataType('finder');

    }
  render() {
    if(this.props.glossary){
      return <div className = 'App'><Glossary /></div>
    }
    return (
      <div className="App">
        <Header back = {this.back}/>
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
            omit4 = {this.state.omit4}
            omit5 = {this.state.omit5}
            handleInput = {this.handleInput}
            handleOmit = {this.handleOmit}
            exclusive = {this.state.exclusive}
            changeExclusive = {this.changeExclusive}
            resetFinder = {this.resetFinder}
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
