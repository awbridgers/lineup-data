import React from 'react';
import { connect } from 'react-redux';
import { changeFinderActive } from '../actions/index.js';

const Finder = (props) =>(
  <div className = "finder">
    <div>
      <h2>Lineup Finder</h2>
      <p id = 'finderInstr'>Enter up to 5 players to find a specific lineup. Leave the input blank if it is unused.</p>
      <p><b>Player 1: <input className = "finderText" type="text" onChange = {props.handleInput} name = "player1" value = {props.player1}/></b></p>
      <p><b>Player 2: <input className = "finderText" type="text" onChange = {props.handleInput} name = "player2" value = {props.player2}/></b></p>
      <p><b>Player 3: <input className = "finderText" type="text" onChange = {props.handleInput} name = "player3" value = {props.player3}/></b></p>
      <p><b>Player 4: <input className = "finderText" type="text" onChange = {props.handleInput} name = "player4" value = {props.player4}/></b></p>
      <p><b>Player 5: <input className = "finderText" type="text" onChange = {props.handleInput} name = "player5" value = {props.player5}/></b></p>
      <p style = {{position: "relative", left: "35px"}}><button className = "lineupSubmit" type = "button" onClick = {props.onClick}>Submit</button>
      <button className = "lineupSubmit" type = "button" onClick = {props.cancelFinder}>Cancel</button></p>
    </div>
  </div>
  )

const mapDispatchToProps = dispatch =>({
  cancelFinder: ()=> dispatch(changeFinderActive(false)),
})


export default connect(null,mapDispatchToProps)(Finder);
