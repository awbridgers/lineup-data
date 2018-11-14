import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import Dropdown from './dropDown.js';
import roster from './roster.js'
import convert from "convert-seconds"
import Finder from './finder.jsx'



export default class DataTable extends Component{
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
    return isFinite(rating) ? rating : 1
  }
  returnDefRating = (player) =>{
    const rating = Math.round((player.pointsAgainst/player.possAgainst)*100)
    return isFinite(rating) ? rating : 1
  }
  render(){
    return(
      <div sytle = {{textAlign: 'center'}}>
        {(this.props.dataType === 'player' &&
          <table className = 'playerTable'>
            <tbody>
              <tr>
                  <th>Player</th>
                  <th  className = "click" id = "time" onClick = {(e) => {this.props.sort(e, 'player')}}>Time</th>
                  <th  className = "click" id = "pf" onClick = {(e) => {this.props.sort(e, 'player')}}>Points For</th>
                  <th  className = "click" id = "pa" onClick = {(e) => {this.props.sort(e, 'player')}}>Points Against</th>
                  <th  className = "click" id = "net" onClick = {(e) => {this.props.sort(e, 'player')}}>Points +/-</th>
                  <th  className = "click" id = "reb" onClick = {(e) => {this.props.sort(e, 'player')}}>Rebounds +/-</th>
                  <th  className = "click" id = "offRating" onClick = {(e) => {this.props.sort(e, 'player')}}>Off Rating</th>
                  <th  className = "click" id = "defRating" onClick = {(e) => {this.props.sort(e, 'player')}}>Def Rating</th>

              </tr>
          {this.props.playerArray.map((x,i) => {
            return (
              <tr key ={i}>
                <td>{x.lineup}</td><td>{this.fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td><td>{x.pointsFor-x.pointsAgainst}</td>
                  <td>{x.reboundsFor-x.reboundsAgainst}</td><td>{this.returnOffRating(x)}</td>
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
                <th  className = "click" id = "time" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Time</th>
                <th  className = "click" id = "pf" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Points For</th>
                <th  className = "click" id = "pa" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Points Against</th>
                <th  className = "click" id = "net" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Points +/-</th>
                <th  className = "click" id = "reb" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Rebounds +/-</th>
                <th  className = "click" id = "offRating" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Off Rating</th>
                <th  className = "click" id = "defRating" onClick = {(e) => {this.props.sort(e, 'lineup')}}>Def Rating</th>



            </tr>
        {this.props.dataArray.map((x,i) => {
          return (
            <tr key ={i}>
              <td id = 'pre'>{x.lineup.replace(/-/g, '\n')}</td><td>{this.fixTime(x.time)}</td><td>{x.pointsFor}</td><td>{x.pointsAgainst}</td>
              <td>{x.pointsFor-x.pointsAgainst}</td><td>{x.reboundsFor-x.reboundsAgainst}</td><td>{this.returnOffRating(x)}</td>
              <td>{this.returnDefRating(x)}</td>
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
              <th className = "click" id = "time" onClick = {(e) => {this.props.sort(e, 'finder')}}>Time</th>
              <th className = "click" id = "pf" onClick = {(e) => {this.props.sort(e, 'finder')}}>Points For</th>
              <th className = "click" id = "pa" onClick = {(e) => {this.props.sort(e, 'finder')}}>Points Against</th>
              <th className = "click" id = "net" onClick = {(e) => {this.props.sort(e, 'finder')}}>Points +/-</th>
              <th className = "click" id = "reb" onClick = {(e) => {this.props.sort(e, 'finder')}}>Rebounds +/-</th>
              <th className = "click" id = "offRating" onClick = {(e) => {this.props.sort(e, 'finder')}}>Off Rating</th>
              <th className = "click" id = "defRating" onClick = {(e) => {this.props.sort(e, 'finder')}}>Def Rating</th>

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
