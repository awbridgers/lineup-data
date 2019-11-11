import React, { Component } from 'react';
import '../App.css';
import convert from "convert-seconds"
import { connect } from 'react-redux';
import { changeSortType, chooseGame } from '../actions/index.js'
import TableLayout from '../components/tableLayout.js.jsx';
import lineupClass from '../lineupClass.js'




export class DataTable extends Component{
  componentDidUpdate(){

  }
  sort = (a,b,array)=>{
    let sortType = this.props.sortType[array].sortType
    switch (sortType){
      case 'time':
        return b.time-a.time;
      case 'net':
        return (b.pointsFor-b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
      case 'name':
        return (a.lineup.split(' ')[1].localeCompare(b.lineup.split(' ')[1]))
      case 'pf':
        return b.pointsFor - a.pointsFor;
      case 'pa':
        return b.pointsAgainst - a.pointsAgainst
      case 'reb':
        return ((b.offRebFor + b.defRebFor)-(b.offRebAgainst + b.defRebAgainst)) -
          ((a.offRebFor + a.defRebFor)-(a.offRebAgainst + a.defRebAgainst))
      case 'ortg':
        if(!isFinite(b.pointsFor/((b.possFor + b.possAgainst)/2)) && !isFinite(a.pointsFor/((a.possFor + a.possAgainst)/2))){
          return 0;
        }
        if(!isFinite(b.pointsFor/((b.possFor + b.possAgainst)/2))){
          return -1;
        }
        if(!isFinite(a.pointsFor/((a.possFor + a.possAgainst)/2))){
          return 1;
        }
        return (b.pointsFor/((b.possFor + b.possAgainst)/2)) - (a.pointsFor/((a.possFor + a.possAgainst)/2));
      case 'drtg':
        if(!isFinite(b.pointsAgainst/((b.possFor + b.possAgainst)/2)) && !isFinite(a.pointsAgainst/((a.possFor + a.possAgainst)/2))){
          return 0;
        }
        if(!isFinite(b.pointsAgainst/((b.possFor + b.possAgainst)/2))){
          return -1;
        }
        if(!isFinite(a.pointsAgainst/((a.possFor + a.possAgainst)/2))){
          return 1;
        }
        return (a.pointsAgainst/((a.possFor + a.possAgainst)/2)) - (b.pointsAgainst/((b.possFor + b.possAgainst)/2));
      case 'fg%':
        if(!isFinite((a.madeTwosFor + a.madeThreesFor)/a.totalShotsFor) && !isFinite(
          (b.madeTwosFor + b.madeThreesFor)/b.totalShotsFor)){
            return 0;
          }
        if(!isFinite((a.madeTwosFor + a.madeThreesFor)/a.totalShotsFor)){
          return 1;
        }
        if(!isFinite((b.madeTwosFor + b.madeThreesFor)/b.totalShotsFor)){
          return -1;
        }
        return ((b.madeTwosFor + b.madeThreesFor)/b.totalShotsFor) - ((a.madeTwosFor + a.madeThreesFor)/a.totalShotsFor);
      case 'fg%def':
        if(!isFinite((a.madeTwosAgainst + a.madeThreesAgainst)/a.totalShotsAgainst) && !isFinite(
          (b.madeTwosAgainst + b.madeThreesAgainst)/b.totalShotsAgainst)){
            return 0;
          }
        if(!isFinite((a.madeTwosAgainst + a.madeThreesAgainst)/a.totalShotsAgainst)){
          return 1;
        }
        if(!isFinite((b.madeTwosAgainst + b.madeThreesAgainst)/b.totalShotsAgainst)){
          return -1;
        }
        return ((a.madeTwosAgainst + a.madeThreesAgainst)/a.totalShotsAgainst) -
            ((b.madeTwosAgainst + b.madeThreesAgainst)/b.totalShotsAgainst);
      case '3p%':
        if(a.attemptedThreesFor=== 0 && b.attemptedThreesFor === 0){
          return 0;
        }
        if(a.attemptedThreesFor === 0){
          return 1;
        }
        if(b.attemptedThreesFor=== 0){
          return -1;
        }
        return (b.madeThreesFor/b.attemptedThreesFor) - (a.madeThreesFor/a.attemptedThreesFor);
      case '3p%def':
        if(a.attemptedThreesAgainst === 0 && b.attemptedThreesAgainst === 0){
          return 0;
        }
        if(a.attemptedThreesAgainst === 0){
          return 1;
        }
        if(b.attemptedThreesAgainst === 0){
          return -1;
        }
        return (a.madeThreesAgainst/a.attemptedThreesAgainst) - (b.madeThreesAgainst/b.attemptedThreesAgainst);
      case 'a/t':
        if(!isFinite(b.assistsFor/b.turnoversFor) && !isFinite(a.assistsFor/a.turnoversFor)){
          return 0;
        }
        if(!isFinite(b.assistsFor/b.turnoversFor)){
          return -1;
        }
        if(!isFinite(a.assistsFor/a.turnoversFor)){
          return 1;
        }
        return (b.assistsFor/b.turnoversFor) - (a.assistsFor/a.turnoversFor);
      case 'poss':
        return ((b.possFor + b.possAgainst)/2) - ((a.possFor + a.possAgainst)/2);
      case 'orb%':
        if(!isFinite(b.offRebFor/(b.offRebFor + b.defRebAgainst)) && !isFinite(a.offRebFor/(a.offRebFor + a.defRebAgainst))){
          return 0;
        }
        if(!isFinite(b.offRebFor/(b.offRebFor + b.defRebAgainst))){
          return -1;
        }
        if(!isFinite(a.offRebFor/(a.offRebFor + a.defRebAgainst))){
          return 1;
        }
        return ((b.offRebFor)/(b.offRebFor + b.defRebAgainst)) - ((a.offRebFor)/(a.offRebFor + a.defRebAgainst));
      case 'drb%':
        if(!isFinite(b.defRebFor/(b.defRebFor + b.offRebAgainst)) && !isFinite(a.defRebFor/(a.defRebFor + a.offRebAgainst))){
          return 0;
        }
        if(!isFinite(b.defRebFor/(b.defRebFor + b.offRebAgainst))){
          return -1;
        }
        if(!isFinite(a.defRebFor/(a.defRebFor + a.offRebAgainst))){
          return 1;
        }
        return ((b.defRebFor)/(b.defRebFor + b.offRebAgainst)) - ((a.defRebFor)/(a.defRebFor + a.offRebAgainst));
      case 'ast%':
        if(!isFinite(b.assistsFor/(b.madeTwosFor + b.madeThreesFor)) && !isFinite(a.assistsFor/(a.madeTwosFor + a.madeThreesFor))){
          return 0;
        }
        if(!isFinite(b.assistsFor/(b.madeTwosFor + b.madeThreesFor))){
          return -1;
        }
        if(!isFinite(a.assistsFor/(a.madeTwosFor + a.madeThreesFor))){
          return 1;
        }
        return (b.assistsFor/(b.madeTwosFor + b.madeThreesFor)) - (a.assistsFor/(a.madeTwosFor + a.madeThreesFor));
      case 'a/poss':
        if(!isFinite(b.assistsFor/((b.possFor + b.possAgainst)/2)) && !isFinite(a.assistsFor/((a.possFor + a.possAgainst)/2))){
          return 0;
        }
        if(!isFinite(b.assistsFor/((b.possFor + b.possAgainst)/2))){
          return -1;
        }
        if(!isFinite(a.assistsFor/((a.possFor + a.possAgainst)/2))){
          return 1;
        }
        return (b.assistsFor/((b.possFor + b.possAgainst)/2)) - (a.assistsFor/((a.possFor + a.possAgainst)/2));
      case 'tov%':
        if(!isFinite(b.turnoversFor/((b.possFor + b.possAgainst)/2)) && !isFinite(a.turnoversFor/((a.possFor + a.possAgainst)/2))){
          return 0;
        }
        if(!isFinite(b.turnoversFor/((b.possFor + b.possAgainst)/2))){
          return -1;
        }
        if(!isFinite(a.turnoversFor/((a.possFor + a.possAgainst)/2))){
          return 1;
        }
        return (a.turnoversFor/((a.possFor + a.possAgainst)/2)) - (b.turnoversFor/((b.possFor + b.possAgainst)/2))
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

  sortClick = (e)=> {
    const prevSort = this.props.sortType[this.props.dataType].sortType;
    const newSort = e.target.id;
    this.props.changeSortType(prevSort, newSort, this.props.dataType);
  }

  render(){
    let lineupArray, playerArray;
    if(this.props.gameName === ''){
      lineupArray = this.props.lineupTotal.filter((x)=>x.possFor!== 0 && x.possAgainst !== 0);
      playerArray = this.props.playerTotal.filter((x)=>x.possFor!== 0 && x.possAgainst !== 0);
    }
    else if(this.props.gameName === 'Acc-Totals'){
      lineupArray = this.props.accLineupTotal.filter((x)=>x.possFor!== 0 && x.possAgainst !== 0);
      playerArray = this.props.accPlayerTotal.filter((x)=>x.possFor!== 0 && x.possAgainst !== 0);
    }
    else{
      lineupArray = this.props.individualGames[this.props.gameName].lineup;
      playerArray = this.props.individualGames[this.props.gameName].player;
    }
    //handle sorting here
    lineupArray.sort((a,b)=>this.sort(a,b,'lineup'));
    playerArray.sort((a,b)=>this.sort(a,b,'player'));
    //reverse if needed
    lineupArray = this.props.sortType.lineup.reverse ? lineupArray.reverse() : lineupArray;
    playerArray = this.props.sortType.player.reverse ? playerArray.reverse() : playerArray;

    let finderArray = this.props.sortType.finder.reverse ? this.props.finderArray.sort((a,b,)=>this.sort(a,b,'finder')).reverse() :
      this.props.finderArray.sort((a,b)=>this.sort(a,b,'finder'));

    return(
      <div>
        {(this.props.dataType === 'player' &&
          <TableLayout array = {playerArray} sort = {this.sortClick}
            fixTime = {this.fixTime} total = {this.totalStats(playerArray)} type = {this.props.infoType}/>
        )}
        {(this.props.dataType === 'lineup' &&
          <TableLayout array = {lineupArray} sort = {this.sortClick}
            fixTime = {this.fixTime} total = {this.totalStats(lineupArray)} type = {this.props.infoType}/>)}
        {(this.props.dataType === 'finder' &&
          <TableLayout array = {finderArray} sort = {this.sortClick} fixTime = {this.fixTime}
            total = {this.totalStats(finderArray)} type = {this.props.infoType} />
      )}
    </div>
  )}
}

export const mapDispatchToProps = dispatch =>({
changeSortType : (prevSort, newSort, sortBy) => dispatch(changeSortType(prevSort, newSort, sortBy)),
changeGame: (game)=> dispatch(chooseGame(game))
})

export const mapStateToProps = state =>({
  lineupTotal: state.lineupData.lineup,
  playerTotal: state.lineupData.player,
  finderArray: state.finder,
  gameName: state.gameName,
  dataType: state.dataType,
  sortType: state.sort,
  individualGames: state.individualGames,
  infoType: state.infoType,
  accLineupTotal: state.accData.lineup,
  accPlayerTotal: state.accData.player,
})

export default connect(mapStateToProps, mapDispatchToProps)(DataTable)
