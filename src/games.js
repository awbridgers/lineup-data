import React, { Component } from 'react';
import roster from "./roster.js"
import Finder from './finder.jsx'
import DataTable from './dataTable.jsx'
import { connect } from 'react-redux';
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



class Game extends Component {
  constructor(props){
    super(props);
    this.state = {finder: false,
      player1: "", player2: "", player3: "", player4: "", player5: "", finderArray:[]};
  }
  
   switchData = () => {
     if(this.props.dataType === "lineup"){
       if(this.state.playerArray.length === 0){
         this.makePlayerArray();
       }
       this.setState({dataType: "player"});
     }
     else{
       this.setState({dataType: "lineup"});
     }
   }

   activateFinder = () => {
     this.setState({finder:true});
     console.log(this.state.finder)
   }
   handleInput = (e) =>{
     this.setState({[e.target.name]: e.target.value});
   }
   lineupFinder = () =>{
     let tempArray = [this.state.player1,this.state.player2,this.state.player3,this.state.player4,this.state.player5]
     let fixedArray =[];
     tempArray.forEach((name,i) => {
       if(name !== ""){
         fixedArray.push(tempArray[i]);
       }
     })

     if(!checkRoster(fixedArray)){
       alert("One of the players is misspelled or not a member of the team");
     }
     else{
       let finderArray =[];
       this.state.dataArray.forEach((lineup) => {
         if(fixedArray.every(name => lineup.lineup.includes(name))){
           finderArray.push(lineup);
         }});
         this.setState({finderArray: finderArray, dataType: "finder",finder: false});
       }
     }
  back = () =>{
    this.setState({dataType: 'lineup', finder:false});
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
  render(){
    return (
      <div className="App">

          {this.props.dataLoaded && <DataTable/>}

        {this.state.finder && <Finder onClick = {this.lineupFinder} cancel = {this.cancel}
          player1 = {this.state.player1}   player2 = {this.state.player2} player3 = {this.state.player3}
          player4 = {this.state.player4}   player5 = {this.state.player5}
          handleInput = {this.handleInput}/>}
      </div>
    );
  }
}

const mapStateToProps = state =>({
  lineups: state.lineupData,
  dataLoaded: state.dataLoaded,
  gameName: state.gameName,
  dataType: state.dataType,
  routerAction: state.router.action
})


export default withRouter(connect(mapStateToProps)(Game));
