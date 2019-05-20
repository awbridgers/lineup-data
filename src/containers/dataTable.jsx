import React, { Component } from 'react';
import '../App.css';
import convert from "convert-seconds"
import { connect } from 'react-redux';
import { changeSortType, chooseGame } from '../actions/index.js'
import { withRouter } from 'react-router'
import TableLayout from '../components/tableLayout.js.jsx';
import lineupClass from '../lineupClass.js'




class DataTable extends Component{
  sort = (a,b,array)=>{
    let sortType = this.props.sortType[array].sortType
    switch (sortType){
      case 'time':
        return b.time-a.time;
      case 'net':
        return (b.pointsFor-b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
      case 'pf':
        return b.pointsFor - a.pointsFor;
      case 'pa':
        return b.pointsAgainst - a.pointsAgainst
      case 'reb':
        return ((b.offRebFor + b.defRebFor)-(b.offRebAgainst + b.defRebAgainst)) -
          ((a.offRebFor + a.defRebFor)-(a.offRebAgainst + a.defRebAgainst))
      case 'ortg':
        return (b.pointsFor/((b.possFor + b.possAgainst)/2)) - (a.pointsFor/(a.possFor + a.possAgainst)/2);
      case 'drtg':
        return (a.pointsAgainst/((a.possFor + a.possAgainst)/2)) - (b.pointsAgainst/((b.possFor + b.possAgainst)/2));
      case 'fg%':
        return ((b.madeTwosFor + b.madeThreesFor)/b.totalShotsFor) - ((a.madeTwosFor + a.madeThreesFor)/a.totalShotsFor);
      case 'fg%def':
        return ((a.madeTwosAgainst + a.madeThreesAgainst)/a.totalShotsAgainst) -
            ((b.madeTwosAgainst + b.madeThreesAgainst)/b.totalShotsAgainst);
      case '3p%':
        return (b.madeThreesFor/b.attemptedThreesFor) - (a.madeThreesFor/a.attemptedThreesFor);
      case '3p%def':
        return (a.madeThreesAgainst/a.attemptedThreesAgainst) - (b.madeThreesAgainst/b.attemptedThreesAgainst);
      case 'a/t':
        return (b.assistsFor/b.turnoversFor) - (a.assistsFor/a.turnoversFor);
      case 'poss':
        return ((b.possFor + b.possAgainst)/2) - ((a.possFor + a.possAgainst)/2);
      case 'orb%':
        return ((b.offRebFor)/(b.offRebFor + b.defRebAgainst)) - ((a.offRebFor)/(a.offRebFor + a.defRebAgainst));
      case 'drb%':
        return ((b.defRebFor)/(b.defRebFor + b.offRebAgainst)) - ((a.defRebFor)/(a.defRebFor + a.offRebAgainst));
      case 'ast%':
        return (b.assistsFor/(b.madeTwosFor + b.madeThreesFor)) - (a.assistsFor/(a.madeTwosFor + a.madeThreesFor));
      case 'a/poss':
        return (b.assistsFor/((b.possFor + b.possAgainst)/2)) - (a.assistsFor/((a.possFor + a.possAgainst)/2));
      case 'tov%':
        return (b.turnoversFor/((b.possFor + b.possAgainst)/2)) - (a.turnoversFor/((a.possFor + a.possAgainst)/2))
      default:
        return (b.pointsFor-b.pointsAgainst) - (a.pointsFor - a.pointsAgainst)
    }

  }
  fixTime = (seconds) =>{
    let secs = convert(seconds).seconds
    if(secs < 10){
      secs = "0" + secs;
    }
    const minutes = convert(seconds).minutes + (convert(seconds).hours*60);
    return minutes + ":" + secs;
  }
  totalStats = (array) => {
    let initialStats = new lineupClass('total');
    array.forEach((lineup)=>{
      Object.keys(lineup).forEach((category)=>{
          initialStats[category] += lineup[category]
      })
    })
    return initialStats
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
  sortClick = (e)=> {
    const prevSort = this.props.sortType[this.props.dataType].sortType;
    const newSort = e.target.id;
    this.props.changeSortType(prevSort, newSort, this.props.dataType);
  }

  render(){

    //create 3 arrays for the lineup, finder and player data. This way, when sorted, the original data isnt messed up
    let lineupArray = [], playerArray = [], finderArray = [];
    //Season totals
    if(this.props.gameName === ''){
      //set the arrays to fiter out no possessions and sort accordingly
      lineupArray = (this.props.sortType.lineup.reverse) ? this.props.dataArray.filter(x => x.possFor!== 0 && x.possAgainst!==0).sort((a,b)=>this.sort(a,b, 'lineup')).reverse() :
         this.props.dataArray.filter(x => x.possFor!== 0 && x.possAgainst!==0).sort((a,b)=>this.sort(a,b, 'lineup'));
      playerArray = (this.props.sortType.player.reverse) ? this.props.playerArray.sort((a,b)=>this.sort(a,b, 'player')).reverse() :
          this.props.playerArray.sort((a,b)=>this.sort(a,b, 'player'))
    }
    else{
      lineupArray = this.props.sortType.lineup.reverse ? this.props.individualGames[this.props.gameName].lineup.sort((a,b)=>this.sort(a,b,'lineup')).reverse() :
        this.props.individualGames[this.props.gameName].lineup.sort((a,b)=>this.sort(a,b,'lineup'))
      playerArray = this.props.sortType.player.reverse ? this.props.individualGames[this.props.gameName].player.sort((a,b)=>this.sort(a,b,'player')).reverse() :
        this.props.individualGames[this.props.gameName].player.sort((a,b)=>this.sort(a,b,'player'))
    }
    finderArray = this.props.sortType.finder.reverse ? this.props.finderArray.sort((a,b,)=>this.sort(a,b,'finder')).reverse() :
      this.props.finderArray.sort((a,b)=>this.sort(a,b,'finder'));
      let lineupTotal = this.totalStats(lineupArray);
      let playerTotal = this.totalStats(playerArray);
      let finderTotal = this.totalStats(finderArray);
    return(
      <div>
        {(this.props.dataType === 'player' &&
          <TableLayout array = {playerArray} sort = {this.sortClick}
            fixTime = {this.fixTime} total = {playerTotal} type = {this.props.infoType}/>
        )}
        {(this.props.dataType === 'lineup' &&
          <TableLayout array = {lineupArray} sort = {this.sortClick}
            fixTime = {this.fixTime} total = {lineupTotal} type = {this.props.infoType}/>)}
        {(this.props.dataType === 'finder' &&
          <TableLayout array = {finderArray} sort = {this.sortClick} fixTime = {this.fixTime}
            total = {finderTotal} type = {this.props.infoType} />  
      )}
    </div>
  )}
}

const mapDispatchToProps = dispatch =>({
changeSortType : (prevSort, newSort, sortBy) => dispatch(changeSortType(prevSort, newSort, sortBy)),
changeGame: (game)=> dispatch(chooseGame(game))
})

const mapStateToProps = state =>({
  dataArray: state.lineupData.lineup,
  playerArray: state.lineupData.player,
  finderArray: state.finder,
  gameName: state.gameName,
  dataType: state.dataType,
  sortType: state.sort,
  individualGames: state.individualGames,
  infoType: state.infoType,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataTable))
