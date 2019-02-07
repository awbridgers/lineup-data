import React, { Component } from 'react';
import './App.css';
import convert from "convert-seconds"
import { connect } from 'react-redux';
import { changeSortType, chooseGame } from './actions/index.js'
import { withRouter } from 'react-router'




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
        return (b.reboundsFor - b.reboundsAgainst) - (a.reboundsFor - a.reboundsAgainst)
      case 'offRating':
        return this.returnOffRating(b)- this.returnOffRating(a);
      case 'defRating':
        return this.returnDefRating(a) - this.returnDefRating(b);
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
    let time = 0;
    let pf = 0;
    let pa = 0;
    let reboundsFor = 0;
    let reboundsAgainst = 0;
    let possFor = 0;
    let possAgainst = 0;
    array.forEach((lineup)=>{
      time += lineup.time;
      pf += lineup.pointsFor;
      pa += lineup.pointsAgainst;
      reboundsFor += lineup.reboundsFor;
      reboundsAgainst += lineup.reboundsAgainst;
      possFor += lineup.possFor;
      possAgainst += lineup.possAgainst;

    });
    return {time: time, pointsFor: pf, pointsAgainst: pa, reboundsFor: reboundsFor, reboundsAgainst:
      reboundsAgainst, possFor: possFor, possAgainst: possAgainst};
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
    let lineupArray = [], playerArray = [];
    if(this.props.gameName === ''){
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
    return(
      <div sytle = {{textAlign: 'center'}}>
        {(this.props.dataType === 'player' &&
          <table className = 'playerTable'>
            <tbody>
              <tr>
                  <th>Player</th>
                  <th  className = "click" id = "time" onClick = {this.sortClick}>Time</th>
                  <th  className = "click" id = "pf" onClick = {this.sortClick}>Points For</th>
                  <th  className = "click" id = "pa" onClick = {this.sortClick}>Points Against</th>
                  <th  className = "click" id = "net" onClick = {this.sortClick}>Points +/-</th>
                  <th  className = "click" id = "reb" onClick = {this.sortClick}>Rebounds +/-</th>
                  <th  className = "click" id = "offRating" onClick = {this.sortClick}>Off Rating</th>
                  <th  className = "click" id = "defRating" onClick = {this.sortClick}>Def Rating</th>

              </tr>
          {playerArray.map((x,i) => {
            return (
              <tr key ={i}>
                <td>{x.lineup}</td><td>{this.fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
                  <td>{x.reboundsFor-x.reboundsAgainst}</td><td>{x.possFor > 0 ? this.returnOffRating(x) : 'N/A'}</td>
                  <td>{this.returnDefRating(x)}</td>
              </tr>
            )
          })
          }
          </tbody>
          </table>
        )}
        {(this.props.dataType === 'lineup' &&
        <table className = 'lineupTable'>
          <tbody>
            <tr>
                <th>Lineup</th>
                <th  className = "click" id = "time" onClick = {this.sortClick}>Time</th>
                <th  className = "click" id = "pf" onClick = {this.sortClick}>Points For</th>
                <th  className = "click" id = "pa" onClick = {this.sortClick}>Points Against</th>
                <th  className = "click" id = "net" onClick = {this.sortClick}>Points +/-</th>
                <th  className = "click" id = "reb" onClick = {this.sortClick}>Rebounds +/-</th>
                <th  className = "click" id = "offRating" onClick = {this.sortClick}>Off Rating</th>
                <th  className = "click" id = "defRating" onClick = {this.sortClick}>Def Rating</th>



            </tr>
        {lineupArray.map((x,i) => {
            return (
              <tr key ={i}>
                <td id = 'pre'>{x.lineup.replace(/-/g, '\n')}</td><td>{this.fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td>
                <td>{x.pointsFor-x.pointsAgainst}</td><td>{x.reboundsFor-x.reboundsAgainst}</td><td>{x.possFor > 0 ? this.returnOffRating(x) : 'N/A'}</td>
                <td>{x.possAgainst > 0 ? this.returnDefRating(x) : 'N/A'}</td>
              </tr>
            )
          })
        }
        </tbody>
        </table>
      )}
      {(this.props.dataType === 'finder' &&
      <div>
      <table className = 'finderTable'>
        <tbody>
          <tr>
              <th>Lineup</th>
              <th className = "click" id = "time" onClick = {this.sortClick}>Time</th>
              <th className = "click" id = "pf" onClick = {this.sortClick}>Points For</th>
              <th className = "click" id = "pa" onClick = {this.sortClick}>Points Against</th>
              <th className = "click" id = "net" onClick = {this.sortClick}>Points +/-</th>
              <th className = "click" id = "reb" onClick = {this.sortClick}>Rebounds +/-</th>
              <th className = "click" id = "offRating" onClick = {this.sortClick}>Off Rating</th>
              <th className = "click" id = "defRating" onClick = {this.sortClick}>Def Rating</th>

          </tr>
      {this.props.finderArray.map((x,i) => {
        return (
          <tr key ={i}>
            <td id = 'pre'>{x.lineup.replace(/-/g, '\n')}</td><td>{this.fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
              <td>{x.reboundsFor-x.reboundsAgainst}</td><td>{this.returnOffRating(x)}</td>
              <td>{this.returnDefRating(x)}</td>
          </tr>
        )
      })}
      <tr>
      <td>Total</td><td>{this.fixTime(this.totalStats(this.props.finderArray).time)}</td><td>{this.totalStats(this.props.finderArray).pointsFor}</td>
      <td>{this.totalStats(this.props.finderArray).pointsAgainst}</td><td>{this.totalStats(this.props.finderArray).pointsFor - this.totalStats(this.props.finderArray).pointsAgainst}</td>
        <td>{this.totalStats(this.props.finderArray).reboundsFor-this.totalStats(this.props.finderArray).reboundsAgainst}</td>
          <td>{this.returnOffRating(this.totalStats(this.props.finderArray))}</td>
          <td>{this.returnDefRating(this.totalStats(this.props.finderArray))}</td>
      </tr>
      </tbody>
      </table>
      </div>
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
  gameName: state.gameName,
  dataType: state.dataType,
  sortType: state.sort,
  individualGames: state.individualGames
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataTable))
