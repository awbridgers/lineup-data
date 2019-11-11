import React, {useState} from 'react';
import { connect } from 'react-redux';
import { changeFinderActive } from '../actions/index.js';
import {roster} from '../lineupClass.js';



const FinderPlayerSelector = (props) => (
  <select className = 'finderSelector' value = {props.selection} onChange = {props.onChange}>
    <option value = '' >None</option>
    {roster.map((player,i)=>{
      if(props.selectedPlayers.includes(player)){
        return(
          <option disabled value = {player}>{player}</option>
        )
      }
      return (
        <option value = {player}>{player}</option>
      )
    })
  }
  </select>
)

export const Finder = (props) =>{
  const playerArray = [
    props.player1,
    props.player2,
    props.player3,
    props.player4,
    props.player5,
    props.omit1,
    props.omit2,
    props.omit3,
    props.omit4,
    props.omit5
  ];
  return(
    <div className = "finder">
      <div>
        <h2>Lineup Finder</h2>
      </div>
      {/*INCLUDE PLAYERS*/}
      <div className = 'finderSelections'>
        <div style = {{padding: '5px'}}><b>Include These Players</b></div>
        <div className = 'finderplayer' >
          Player 1:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.player1}
            onChange = {(e)=>props.handleInput(e,1)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 2:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.player2}
            onChange = {(e)=>props.handleInput(e,2)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 3:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.player3}
            onChange = {(e)=>props.handleInput(e,3)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 4:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.player4}
            onChange = {(e)=>props.handleInput(e,4)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 5:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.player5}
            onChange = {(e)=>props.handleInput(e,5)}
          />
        </div>
      </div>

      {/*  OMIT PLAYERS*/}
      <div className = 'finderSelections'>
        <div style = {{padding: '5px'}}><b>Omit These Players</b></div>
        <div className = 'finderplayer' >
          Player 1:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.omit1}
            onChange = {(e)=>props.handleOmit(e,1)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 2:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.omit2}
            onChange = {(e)=>props.handleOmit(e,2)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 3:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.omit3}
            onChange = {(e)=>props.handleOmit(e,3)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 4:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.omit4}
            onChange = {(e)=>props.handleOmit(e,4)}
          />
        </div>
        <div className = 'finderplayer'>
          Player 5:
          <FinderPlayerSelector
            selectedPlayers = {playerArray}
            selection = {props.omit5}
            onChange = {(e)=>props.handleOmit(e,5)}
          />
        </div>
      </div>
      <div className = 'finderSubmit'>
        <button className = "lineupSubmit" type = "button" onClick = {props.onClick}>Submit</button>
        <button className = "lineupSubmit" type = "button" onClick = {props.cancelFinder}>Cancel</button>
      </div>

    </div>
  )
}

export const mapDispatchToProps = dispatch =>({
  cancelFinder: ()=> dispatch(changeFinderActive(false)),
})


export default connect(null,mapDispatchToProps)(Finder);
