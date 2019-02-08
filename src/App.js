import React, { Component } from 'react';
import './App.css';
import roster from './roster.js'
import Finder from './finder.jsx'
import DataTable from './dataTable.jsx';
import { connect } from 'react-redux';
import { changeDataType, lineupFinder, changeFinderActive } from './actions/index.js'
import { withRouter } from 'react-router'






const checkRoster = (array) => {
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



class App extends Component {
  constructor(){
    super();
    this.state = {dataArray: [], playerArray: [], dataType: 'lineup', finder: false,
      player1: "", player2: "", player3: "", player4: "", player5: "", finderArray:[]};
    this.sortLineupType = 'net';
    this.sortArrayType = 'lineup';
  }

  switchData = () =>{
    if(this.state.dataType === "lineup"){
      //this.setState({dataType: "player"});
      this.props.changeDataType('player')
    }
    else{
      //this.setState({dataType: "lineup"})
      this.props.changeDataType('lineup')
    }
  }
  sortLineupTable = (e, dataType) =>{
    // console.log(e.target.id)
    let type = e.target.id;
    let array;
    switch(dataType){
      case 'player':
        array = this.state.playerArray;
        break;
      case 'lineup':
        array = this.state.dataArray;
        break;
      case 'finder':
        array = this.state.finderArray;
        break;
      default:
        break;
    }
    if(type === this.sortLineupType && dataType === this.sortArrayType){         //if the sort type is the same, reverse the order
      array.reverse();
    }
    else{
      if(type === "net"){
        array.sort((a,b)=>{return (b.pointsFor-b.pointsAgainst) - (a.pointsFor - a.pointsAgainst)});
        this.sortLineupType = "net";
      }
      else if (type === "pf"){
        array.sort((a,b)=>{return (b.pointsFor) - (a.pointsFor)});
        this.sortLineupType = "pf";
      }
      else if(type === "pa"){
        array.sort((a,b)=>{return (b.pointsAgainst) - (a.pointsAgainst)});
        this.sortLineupType = "pa";
      }
      else if (type === "time"){
        array.sort((a,b)=>{return (b.time) - (a.time)});
        this.sortLineupType = "time";
      }
      else if (type === "reb"){
        array.sort((a,b)=>{return (b.reboundsFor - b.reboundsAgainst) - (a.reboundsFor - a.reboundsAgainst)});
        this.sortLineupType = "reb";
      }
      else if (type === "offRating"){
        array.sort((a,b)=>{return this.returnOffRating(b) - this.returnOffRating(a)});
        this.sortLineupType = "offRating";
      }
      else if (type === "defRating"){
        array.sort((a,b)=>{return this.returnDefRating(a) - this.returnDefRating(b)});
        this.sortLineupType = "defRating";
      }

    }
      this.sortArrayType = dataType;
      if(dataType === 'lineup'){
        this.setState({dataArray: array});
      }
      else if(dataType === 'player'){
        this.setState({playerArray: array});
      }
      else if(dataType === 'finder'){
        this.setState({finderArray: array});
      }
  }

  activateFinder = () => {
    this.props.changeFinder(!this.props.finderActive)
  }
  handleInput = (e) =>{
    this.setState({[e.target.name]: e.target.value});
  }
  lineupFinder = () =>{
    //add all the input names to array and filter out any spaces left blank
    let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
    let fixedArray = tempArray.filter((name) => name!== '');

    //make sure the players are on the team!
    if(!checkRoster(fixedArray)){
      alert("One of the players is misspelled or not a member of the team");
    }
    else{
      let finderArray =[];
      let fromWhichArray = (this.props.gameName === '') ? this.props.lineups : this.props.individualGames[this.props.gameName].lineup
      let reduxArray = fromWhichArray.filter((lineup)=> fixedArray.every(name => lineup.lineup.includes(name)))
      const reduxArrayFilter = reduxArray.filter(x => x.possFor!== 0 && x.possAgainst!==0);
      this.props.addLineupFinderInfo(reduxArrayFilter)
      this.props.changeFinder(false);
      this.props.changeDataType('finder');
      }
    }
  back = () =>{
    this.setState({dataType: 'lineup', finder:false});
    this.props.changeDataType('lineup')
  }
  cancel = () =>{
    this.setState({finder:false});
  }
  returnOffRating = (player) =>{
    const rating = Math.round((player.pointsFor/player.possFor)*100)
    //for the purposes of sorting, if the offRating is infinite or NaN, return a small number (so its always last)
    return isFinite(rating) ? rating : -1
  }
  returnDefRating = (player) =>{
    const rating = Math.round((player.pointsAgainst/player.possAgainst)*100)
    //for the purposes of sorting def Rating, infinity or NaN should return a big number (goes last in sort for Def Rating)
    return isFinite(rating) ? rating : 1000
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
const mapDispatchToProps = dispatch =>({
  changeDataType: (dt) => dispatch(changeDataType(dt)),
  addLineupFinderInfo: (lineupArray) => dispatch(lineupFinder(lineupArray)),
  changeFinder: (active)=> dispatch(changeFinderActive(active))
})

const mapStateToProps = state =>({
  lineups: state.lineupData.lineup,
  dataType: state.dataType,
  dataLoaded: state.dataLoaded,
  finderActive: state.finderActive,
  gameName: state.gameName,
  individualGames: state.individualGames,
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
